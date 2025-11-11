-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- For "Chasseur d'indice" Multiplayer Game
-- ============================================

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;

-- ============ PLAYERS TABLE ============

-- Allow users to view all players (for leaderboard)
CREATE POLICY "Players are viewable by everyone" ON players
  FOR SELECT USING (true);

-- Allow anyone to create a new player (anonymous users can join)
CREATE POLICY "Anyone can insert players" ON players
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON players
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============ GAMES TABLE ============

-- Allow users to view all games
CREATE POLICY "Games are viewable by everyone" ON games
  FOR SELECT USING (true);

-- Allow anyone to create a new game
CREATE POLICY "Anyone can create games" ON games
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update game status (for game flow)
CREATE POLICY "Anyone can update game status" ON games
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============ QUESTIONS TABLE ============

-- Allow users to view questions in active games
CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (true);

-- Allow game creators to insert questions
CREATE POLICY "Anyone can insert questions" ON questions
  FOR INSERT WITH CHECK (true);

-- ============ SCORES TABLE ============

-- Allow users to view all scores (for public leaderboard)
CREATE POLICY "Scores are viewable by everyone" ON scores
  FOR SELECT USING (true);

-- Allow anyone to record scores
CREATE POLICY "Anyone can record scores" ON scores
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own scores
CREATE POLICY "Users can update scores" ON scores
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============ GAME_PARTICIPANTS TABLE ============

-- Allow users to view participants
CREATE POLICY "Game participants are viewable by everyone" ON game_participants
  FOR SELECT USING (true);

-- Allow anyone to join a game
CREATE POLICY "Anyone can join games" ON game_participants
  FOR INSERT WITH CHECK (true);

-- Allow updating participant data (final scores, rankings)
CREATE POLICY "Anyone can update participant data" ON game_participants
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- NOTES:
-- These are PERMISSIVE policies for a PUBLIC game
-- Anyone (anon users) can:
//   - Create a player profile
//   - Create/join a game
//   - View all game data
//   - Submit answers and scores
// 
// For production with authentication, you would:
//   - Add user authentication via Supabase Auth
//   - Restrict to: auth.uid() = user_id
//   - Add RESTRICTIVE policies for security
// ============================================
