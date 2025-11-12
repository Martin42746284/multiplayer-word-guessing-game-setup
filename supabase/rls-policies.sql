-- RLS Policies for game management
-- These policies allow public (anon) access for game operations
-- For production, update to use auth.uid() instead of TRUE

-- Players table
DROP POLICY IF EXISTS "Enable public insert on players" ON players;
DROP POLICY IF EXISTS "Enable public read on players" ON players;
DROP POLICY IF EXISTS "Enable public update on players" ON players;

CREATE POLICY "Enable public insert on players" ON players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public read on players" ON players
  FOR SELECT USING (true);

CREATE POLICY "Enable public update on players" ON players
  FOR UPDATE USING (true);

-- Games table
DROP POLICY IF EXISTS "Enable public insert on games" ON games;
DROP POLICY IF EXISTS "Enable public read on games" ON games;
DROP POLICY IF EXISTS "Enable public update on games" ON games;

CREATE POLICY "Enable public insert on games" ON games
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public read on games" ON games
  FOR SELECT USING (true);

CREATE POLICY "Enable public update on games" ON games
  FOR UPDATE USING (true);

-- Questions table
DROP POLICY IF EXISTS "Enable public insert on questions" ON questions;
DROP POLICY IF EXISTS "Enable public read on questions" ON questions;

CREATE POLICY "Enable public insert on questions" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public read on questions" ON questions
  FOR SELECT USING (true);

-- Game participants table
DROP POLICY IF EXISTS "Enable public insert on game_participants" ON game_participants;
DROP POLICY IF EXISTS "Enable public read on game_participants" ON game_participants;
DROP POLICY IF EXISTS "Enable public update on game_participants" ON game_participants;

CREATE POLICY "Enable public insert on game_participants" ON game_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public read on game_participants" ON game_participants
  FOR SELECT USING (true);

CREATE POLICY "Enable public update on game_participants" ON game_participants
  FOR UPDATE USING (true);

-- Scores table
DROP POLICY IF EXISTS "Enable public insert on scores" ON scores;
DROP POLICY IF EXISTS "Enable public read on scores" ON scores;

CREATE POLICY "Enable public insert on scores" ON scores
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public read on scores" ON scores
  FOR SELECT USING (true);
