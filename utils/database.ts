import { supabase } from "./supabase";

// ============ PLAYERS ============

export async function createPlayer(username: string, email?: string, avatarUrl?: string) {
  const { data, error } = await supabase
    .from("players")
    .insert({ username, email, avatar_url: avatarUrl })
    .select();

  if (error) throw error;
  return data[0];
}

export async function getPlayer(playerId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();

  if (error) throw error;
  return data;
}

export async function getPlayerByUsername(username: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") throw error; // no rows
  return data || null;
}

export async function updatePlayer(playerId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("players")
    .update(updates)
    .eq("id", playerId)
    .select();

  if (error) throw error;
  return data[0];
}

// ============ GAMES ============

export async function createGame(title: string, description?: string, createdBy?: string) {
  // Supabase générera automatiquement un UUID pour `id`
  const { data, error } = await supabase
    .from("games")
    .insert({
      title,
      description,
      created_by: createdBy,
      status: "pending",
    })
    .select();

  if (error) throw error;
  return data[0]; // data[0].id est le UUID généré automatiquement
}

export async function getGame(gameId: string) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllGames(status?: string) {
  let query = supabase.from("games").select("*");
  if (status) query = query.eq("status", status);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateGameStatus(gameId: string, status: "pending" | "active" | "finished") {
  const updates: Record<string, any> = { status };
  if (status === "active") updates.started_at = new Date().toISOString();
  if (status === "finished") updates.ended_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("games")
    .update(updates)
    .eq("id", gameId)
    .select();

  if (error) throw error;
  return data[0];
}

// ============ QUESTIONS ============

export async function createQuestion(
  gameId: string,
  questionText: string,
  correctAnswer: string,
  displayOrder: number,
  imageUrl?: string,
  timeLimitSeconds: number = 30
) {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      game_id: gameId, // <--- UUID correct
      question_text: questionText,
      image_url: imageUrl,
      correct_answer: correctAnswer,
      display_order: displayOrder,
      time_limit_seconds: timeLimitSeconds,
    })
    .select();

  if (error) throw error;
  return data[0];
}

export async function getQuestion(questionId: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionId)
    .single();

  if (error) throw error;
  return data;
}

export async function getGameQuestions(gameId: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("game_id", gameId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}

// ============ SCORES ============

export async function recordScore(
  gameId: string,
  playerId: string,
  questionId: string,
  answerText: string,
  isCorrect: boolean,
  responseTimeMs: number
) {
  let pointsEarned = isCorrect ? 100 : -25;
  if (isCorrect && responseTimeMs < 10000) pointsEarned += 30; // bonus rapide

  const { data, error } = await supabase
    .from("scores")
    .insert({
      game_id: gameId, // <--- UUID correct
      player_id: playerId,
      question_id: questionId,
      answer_text: answerText,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      response_time_ms: responseTimeMs,
    })
    .select();

  if (error) throw error;
  return data[0];
}

export async function getPlayerScore(gameId: string, playerId: string) {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("game_id", gameId)
    .eq("player_id", playerId);

  if (error) throw error;

  const totalPoints = data.reduce((sum, s) => sum + s.points_earned, 0);
  return { totalPoints, answers: data };
}

export async function getGameScoreboard(gameId: string) {
  const { data, error } = await supabase
    .from("scores")
    .select("player_id, players(username, avatar_url)")
    .eq("game_id", gameId);

  if (error) throw error;

  const scoreboard: Record<string, any> = {};
  data.forEach((score: any) => {
    if (!scoreboard[score.player_id]) {
      scoreboard[score.player_id] = {
        player_id: score.player_id,
        username: score.players?.username,
        avatar_url: score.players?.avatar_url,
        total_points: 0,
        correct_answers: 0,
        total_answers: 0,
      };
    }
    scoreboard[score.player_id].total_points += score.points_earned;
    if (score.is_correct) scoreboard[score.player_id].correct_answers += 1;
    scoreboard[score.player_id].total_answers += 1;
  });

  return Object.values(scoreboard)
    .sort((a: any, b: any) => b.total_points - a.total_points)
    .map((p: any, i: number) => ({ ...p, rank: i + 1 }));
}

// ============ GAME PARTICIPANTS ============

export async function addGameParticipant(gameId: string, playerId: string) {
  const { data, error } = await supabase
    .from("game_participants")
    .insert({ game_id: gameId, player_id: playerId })
    .select();

  if (error) throw error;
  return data[0];
}

export async function getGameParticipants(gameId: string) {
  const { data, error } = await supabase
    .from("game_participants")
    .select("*, players(username, avatar_url)")
    .eq("game_id", gameId)
    .order("final_score", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data;
}

export async function updateParticipantFinalScore(
  gameId: string,
  playerId: string,
  finalScore: number,
  finalRank: number
) {
  const { data, error } = await supabase
    .from("game_participants")
    .update({ final_score: finalScore, final_rank: finalRank })
    .eq("game_id", gameId)
    .eq("player_id", playerId)
    .select();

  if (error) throw error;
  return data[0];
}

// ============ REAL-TIME SUBSCRIPTIONS ============

export function subscribeToGameUpdates(gameId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`game:${gameId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "games", filter: `id=eq.${gameId}` },
      callback
    )
    .subscribe();
}

export function subscribeToScores(gameId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`scores:${gameId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "scores", filter: `game_id=eq.${gameId}` },
      callback
    )
    .subscribe();
}

export function subscribeToGameParticipants(gameId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`participants:${gameId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_participants", filter: `game_id=eq.${gameId}` },
      callback
    )
    .subscribe();
}

export async function unsubscribeFromChannel(channel: any) {
  if (channel) await supabase.removeChannel(channel);
}
