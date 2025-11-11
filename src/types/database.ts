export type Player = {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Game = {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "active" | "finished";
  created_by?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  game_id: string;
  question_text: string;
  image_url?: string;
  correct_answer: string;
  display_order: number;
  time_limit_seconds: number;
  created_at: string;
  updated_at: string;
};

export type Score = {
  id: string;
  game_id: string;
  player_id: string;
  question_id: string;
  answer_text?: string;
  is_correct: boolean;
  points_earned: number;
  response_time_ms?: number;
  created_at: string;
};

export type GameParticipant = {
  id: string;
  game_id: string;
  player_id: string;
  joined_at: string;
  final_score?: number;
  final_rank?: number;
  players?: Player;
};

export type Scoreboard = {
  player_id: string;
  username: string;
  avatar_url?: string;
  total_points: number;
  correct_answers: number;
  total_answers: number;
  rank: number;
};

export type GameState = {
  game: Game | null;
  participants: GameParticipant[];
  scoreboard: Scoreboard[];
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
};

export type PlayerAnswer = {
  questionId: string;
  answer: string;
  responseTimeMs: number;
};
