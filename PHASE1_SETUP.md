# Phase 1 - Backend & Real-Time Setup

This document covers the setup for the database schema, Supabase integration, and edge functions.

## Step 1: Create Database Schema

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to the SQL Editor
3. Open a new SQL query
4. Copy the contents of `db-schema.sql`
5. Execute the SQL script to create all tables, indexes, and enable real-time

The script creates:
- `players` - User profiles
- `games` - Game/quiz instances
- `questions` - Quiz questions with images
- `scores` - Player answers and points
- `game_participants` - Track who's in each game
- Indexes for better query performance
- Real-time subscriptions for all tables

## Step 2: Environment Variables

Your `.env` file already contains:
```
REACT_APP_SUPABASE_URL=https://tkqriznutvgwozqegyym.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are used by `utils/supabase.ts` and the frontend for real-time subscriptions.

## Step 3: Deploy Edge Functions

Edge functions provide server-side game logic. To deploy:

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project (one time):
   ```bash
   supabase link --project-ref tkqriznutvgwozqegyym
   ```

3. Deploy functions:
   ```bash
   supabase functions deploy verify-answer
   supabase functions deploy finalize-game
   ```

### Option B: Using Supabase Dashboard

1. Go to Functions in Supabase dashboard
2. Create new function: `verify-answer`
3. Copy contents of `supabase/functions/verify-answer/index.ts`
4. Deploy
5. Repeat for `finalize-game`

## Step 4: Verify Setup

Test the database connection:

```typescript
import { getPlayerByUsername, createPlayer } from './utils/database';

// Test creating a player
const player = await createPlayer('testplayer', 'test@example.com');
console.log('Player created:', player);

// Test retrieving player
const retrieved = await getPlayerByUsername('testplayer');
console.log('Player retrieved:', retrieved);
```

## Available Functions

### Player Management
- `createPlayer(username, email, avatarUrl)` - Create new player
- `getPlayer(playerId)` - Get player by ID
- `getPlayerByUsername(username)` - Get player by username
- `updatePlayer(playerId, updates)` - Update player profile

### Game Management
- `createGame(title, description, createdBy)` - Create new game
- `getGame(gameId)` - Get game details
- `getAllGames(status)` - List games (filtered by status)
- `updateGameStatus(gameId, status)` - Change game status

### Questions
- `createQuestion(gameId, questionText, correctAnswer, displayOrder, imageUrl, timeLimitSeconds)` - Add question
- `getQuestion(questionId)` - Get question details
- `getGameQuestions(gameId)` - Get all questions for a game

### Scores & Leaderboard
- `recordScore(gameId, playerId, questionId, answerText, isCorrect, responseTimeMs)` - Record answer
- `getPlayerScore(gameId, playerId)` - Get player's total score
- `getGameScoreboard(gameId)` - Get leaderboard with rankings

### Real-Time Subscriptions
- `subscribeToGameUpdates(gameId, callback)` - Listen for game status changes
- `subscribeToScores(gameId, callback)` - Listen for new scores
- `subscribeToGameParticipants(gameId, callback)` - Listen for participant changes

## Data Model

### Players
```typescript
{
  id: UUID,
  username: VARCHAR(255),
  email: VARCHAR(255),
  avatar_url: VARCHAR(500),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Games
```typescript
{
  id: UUID,
  title: VARCHAR(255),
  description: TEXT,
  status: 'pending' | 'active' | 'finished',
  created_by: UUID (references players),
  started_at: TIMESTAMP,
  ended_at: TIMESTAMP,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Questions
```typescript
{
  id: UUID,
  game_id: UUID (references games),
  question_text: VARCHAR(500),
  image_url: VARCHAR(500),
  correct_answer: VARCHAR(255),
  display_order: INT,
  time_limit_seconds: INT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Scores
```typescript
{
  id: UUID,
  game_id: UUID,
  player_id: UUID,
  question_id: UUID,
  answer_text: VARCHAR(255),
  is_correct: BOOLEAN,
  points_earned: INT,
  response_time_ms: INT,
  created_at: TIMESTAMP
}
```

## Scoring System

- **Correct answer**: +100 points
- **Incorrect answer**: -25 points
- **Speed bonus**: +30 points (if answered in less than 10 seconds)

Examples:
- Fast correct answer: 100 + 30 = 130 points
- Slow correct answer: 100 points
- Wrong answer: -25 points

## Real-Time Features

The application uses Supabase Realtime to synchronize:
1. Game status changes (pending → active → finished)
2. New scores (as players answer questions)
3. Participant list updates (as players join)

This enables live leaderboard updates and synchronized game flow across all players.

## Next Steps (Phase 2)

✅ **Phase 2 is now COMPLETE!**

All UI components have been implemented:
- ✅ Player screens (A-F) with game flow
- ✅ Public display screens (1-8) with all animations
- ✅ Custom keyboard with answer validation
- ✅ Timer, countdown, and leaderboard components
- ✅ Real-time synchronization hooks
- ✅ Game logic and scoring system

See **PHASE2_COMPONENTS.md** for complete component documentation.

### Phase 2 Components
1. Timer component - 30-second countdown
2. Countdown component - 3-2-1 animations
3. PlayerCard component - Role display with icons
4. CustomKeyboard component - AZERTY keyboard input
5. AnswerReveal component - Letter-by-letter animation
6. Leaderboard component - Rankings + chart
7. PlayerScreen page - All 6 game screens (A-F)
8. PublicDisplay page - All 8 public screens (1-8)
9. useGameSync hook - Real-time subscriptions
10. usePlayerState hook - Player authentication

### Remaining Tasks
1. Database setup - Execute SQL schema in Supabase
2. Deploy edge functions - Deploy verify-answer & finalize-game
3. Add question data - Create 20 questions with images
4. Integration testing - Full game flow with real data
5. Performance optimization - Image loading & animations
6. Mobile responsiveness - Layout adjustments

See main README for complete project timeline.
