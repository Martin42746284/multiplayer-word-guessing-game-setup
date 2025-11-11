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
    const { gameId } = await req.json();

    if (!gameId) {
      return new Response(JSON.stringify({ error: "Missing gameId" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get all scores for the game
    const { data: scores, error: scoresError } = await supabase
      .from("scores")
      .select("player_id, points_earned")
      .eq("game_id", gameId);

    if (scoresError) {
      console.error("Error fetching scores:", scoresError);
      return new Response(JSON.stringify({ error: scoresError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Calculate total score per player
    const playerScores: Record<string, number> = {};
    scores.forEach((score: any) => {
      if (!playerScores[score.player_id]) {
        playerScores[score.player_id] = 0;
      }
      playerScores[score.player_id] += score.points_earned;
    });

    // Sort players by score and get rankings
    const rankedPlayers = Object.entries(playerScores)
      .map(([playerId, totalScore]) => ({
        playerId,
        totalScore,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));

    // Update game_participants table with final scores and ranks
    const updatePromises = rankedPlayers.map((player) =>
      supabase
        .from("game_participants")
        .update({
          final_score: player.totalScore,
          final_rank: player.rank,
        })
        .eq("game_id", gameId)
        .eq("player_id", player.playerId)
    );

    const updateResults = await Promise.all(updatePromises);

    // Check for any errors in updates
    const updateError = updateResults.find((result: any) => result.error);
    if (updateError?.error) {
      console.error("Error updating participants:", updateError.error);
      return new Response(
        JSON.stringify({ error: updateError.error.message }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Update game status to finished
    const { error: gameError } = await supabase
      .from("games")
      .update({
        status: "finished",
        ended_at: new Date().toISOString(),
      })
      .eq("id", gameId);

    if (gameError) {
      console.error("Error updating game:", gameError);
      return new Response(JSON.stringify({ error: gameError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        gameId,
        status: "finished",
        finalRankings: rankedPlayers,
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
