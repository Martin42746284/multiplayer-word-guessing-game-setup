import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      gameId,
      playerId,
      questionId,
      userAnswer,
      correctAnswer,
      responseTimeMs,
    } = await req.json();

    if (!gameId || !playerId || !questionId || !userAnswer || !correctAnswer) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Validate answer (case-insensitive)
    const isCorrect =
      userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    // Calculate points
    const CORRECT_POINTS = 100;
    const INCORRECT_POINTS = -25;
    const SPEED_BONUS = 30;
    const SPEED_BONUS_THRESHOLD = 10000;

    let basePoints = isCorrect ? CORRECT_POINTS : INCORRECT_POINTS;
    let bonus = isCorrect && responseTimeMs < SPEED_BONUS_THRESHOLD ? SPEED_BONUS : 0;
    const totalPoints = basePoints + bonus;

    // Record the score
    const { data: scoreData, error: scoreError } = await supabase
      .from("scores")
      .insert({
        game_id: gameId,
        player_id: playerId,
        question_id: questionId,
        answer_text: userAnswer,
        is_correct: isCorrect,
        points_earned: totalPoints,
        response_time_ms: responseTimeMs,
      })
      .select();

    if (scoreError) {
      console.error("Score insertion error:", scoreError);
      return new Response(JSON.stringify({ error: scoreError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Get updated player score
    const { data: allScores, error: fetchError } = await supabase
      .from("scores")
      .select("points_earned")
      .eq("game_id", gameId)
      .eq("player_id", playerId);

    if (fetchError) {
      console.error("Fetch scores error:", fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const playerTotalScore = allScores.reduce(
      (sum: number, score: any) => sum + score.points_earned,
      0
    );

    return new Response(
      JSON.stringify({
        isCorrect,
        pointsEarned: totalPoints,
        breakdown: {
          basePoints,
          bonus,
        },
        playerTotalScore,
        score: scoreData[0],
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};
