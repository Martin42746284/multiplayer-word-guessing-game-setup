-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'finished')),
  created_by UUID REFERENCES players(id) ON DELETE SET NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  question_text VARCHAR(500) NOT NULL,
  image_url VARCHAR(500),
  correct_answer VARCHAR(255) NOT NULL,
  display_order INT NOT NULL,
  time_limit_seconds INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create game_participants table
CREATE TABLE IF NOT EXISTS game_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  final_score INT DEFAULT 0,
  final_rank INT,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text VARCHAR(255),
  is_correct BOOLEAN NOT NULL,
  points_earned INT DEFAULT 0,
  response_time_ms INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_created_by ON games(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_game_id ON questions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_game_id ON game_participants(game_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_player_id ON game_participants(player_id);
CREATE INDEX IF NOT EXISTS idx_scores_game_id ON scores(game_id);
CREATE INDEX IF NOT EXISTS idx_scores_player_id ON scores(player_id);
CREATE INDEX IF NOT EXISTS idx_scores_question_id ON scores(question_id);

-- Enable real-time for tables
ALTER TABLE games REPLICA IDENTITY FULL;
ALTER TABLE game_participants REPLICA IDENTITY FULL;
ALTER TABLE scores REPLICA IDENTITY FULL;

-- Create RLS policies (public access for now, update for production)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) to read/write
CREATE POLICY "Enable public insert on players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable public read on players" ON players FOR SELECT USING (true);
CREATE POLICY "Enable public update on players" ON players FOR UPDATE USING (true);

CREATE POLICY "Enable public insert on games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable public read on games" ON games FOR SELECT USING (true);
CREATE POLICY "Enable public update on games" ON games FOR UPDATE USING (true);

CREATE POLICY "Enable public insert on questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable public read on questions" ON questions FOR SELECT USING (true);

CREATE POLICY "Enable public insert on game_participants" ON game_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable public read on game_participants" ON game_participants FOR SELECT USING (true);
CREATE POLICY "Enable public update on game_participants" ON game_participants FOR UPDATE USING (true);

CREATE POLICY "Enable public insert on scores" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable public read on scores" ON scores FOR SELECT USING (true);
