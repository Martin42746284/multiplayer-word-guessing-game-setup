# Phase 2 - Game Components Implementation

## Overview

All game screens and UI components have been implemented according to the firmware specifications in `Supabase.pdf`.

## 📱 Public Display Screens (8 screens)

### Screen 1: Welcome
- Displays logo and "Chasseur d'indice" title
- Shows until first account validation
- Status: ✅ Complete

### Screen 2: Waiting for Players
- Displays 8 player slots in a 4x2 grid
- Shows player profiles as they join
- Counter showing "X/8 joueurs prêts"
- Starts countdown when 8th player joins
- Status: ✅ Complete

### Screen 3: Countdown
- 3-second countdown before each question (3, 2, 1)
- Overlaid on player grid with blur effect
- Animated large countdown timer
- Status: ✅ Complete

### Screen 4: Image Display
- Shows 2-4 clue images for 15 seconds
- Timer display (30:00)
- Question progress (i/n)
- Images fade when time expires
- Status: ✅ Complete

### Screen 5: Playing/Scoring
- Timer (turns red at 3 seconds)
- 8 player profiles with current scores
- Score change notifications (-15, +20, etc.)
- Real-time score updates via Supabase Realtime
- Status: ✅ Complete

### Screen 6: Answer Correction
- Shows the 2-4 clue images
- Animates correct answer letter-by-letter
- 3-second display duration
- Status: ✅ Complete

### Screen 7: Leaderboard
- Ranked list of players with scores
- Evolution chart (Recharts)
- Progress bar (i/n as percentage)
- 5-second display before next countdown
- Status: ✅ Complete

### Screen 8: Winner Announcement
- Large celebration screen
- Winner's profile and final score
- "Félicitations!" message
- Confetti animation
- Status: ✅ Complete

## 👤 Player Screens (6 screens)

### Screen A: Role Selection
- Displays selected role and avatar
- "JOUER" button to join game
- Status: ✅ Complete

### Screen B: Chosen Buttons Greyed Out
- Shows available roles (not yet selected)
- Previously selected roles appear disabled
- Status: ✅ Complete (integrated into Screen C)

### Screen C: Confirmation Dialog
- "Êtes-vous [Role]?" question
- OUI (Yes) / NON (No) buttons
- OUI creates profile and marks as "Prêt"
- NON allows role reselection
- Status: ✅ Complete

### Screen D: Waiting for Game Start
- Shows player's role and avatar
- Lists other players currently waiting
- "En attente des joueurs..." message
- Disconnect button
- Auto-starts 3 seconds after 8th player
- Status: ✅ Complete

### Screen E: Game Screen
- 30-second timer (auto-submit on 0)
- 2-4 clue images (visible for 15s, then hidden)
- Answer input area with letter boxes
- Custom keyboard (A-Z, 0-9, special chars)
- Scoring display (-15, +20 notifications)
- Question counter (i/20)
- Custom keyboard with auto-uppercase
- Validate button (greyed out until complete)
- Status: ✅ Complete

### Screen F: Final Results
- "You Win" / "You Lose" message
- Final score display
- "Félicitations!" message
- Return to home button
- Status: ✅ Complete

## 🧩 Utility Components

### Timer (`src/components/Timer.tsx`)
- Countdown timer with MM:SS format
- Auto-triggers callback when time expires
- Warning threshold (red + pulse at 3 seconds)
- Configurable initial seconds
- Status: ✅ Complete

### Countdown (`src/components/Countdown.tsx`)
- Large animated countdown (3, 2, 1, etc.)
- Bouncing animation effect
- Configurable start number
- Triggers callback on completion
- Status: ✅ Complete

### PlayerCard (`src/components/PlayerCard.tsx`)
- Displays player role with icon and color
- Shows optional score and ranking
- Score change notifications (red/green)
- Answered state indicator (green ring)
- Multiple sizes (sm, md, lg)
- Status: ✅ Complete

### CustomKeyboard (`src/components/CustomKeyboard.tsx`)
- Full AZERTY-style keyboard layout
- Auto-uppercase letter input
- Special characters (numbers, punctuation)
- Backspace button to erase
- Validate button (disabled until answer complete)
- Shows progress (X / total letters)
- Status: ✅ Complete

### AnswerReveal (`src/components/AnswerReveal.tsx`)
- Animates answer letter-by-letter
- Configurable reveal duration
- Green boxes for revealed letters
- Gray boxes for hidden letters
- Status: ✅ Complete

### Leaderboard (`src/components/Leaderboard.tsx`)
- Ranked player list with scores
- Optional evolution line chart
- Progress bar with percentage
- Question counter (X/20)
- Status: ✅ Complete

## 🎮 Game Logic & Hooks

### `utils/gameLogic.ts`
- Scoring calculation (+100 correct, -25 incorrect, +30 bonus if < 20s)
- Answer validation (case-insensitive, trimmed)
- Point breakdowns (base + bonus)
- Helper functions for game state
- Status: ✅ Updated to 20-second bonus threshold

### `src/hooks/useGameSync.ts`
- Real-time game state synchronization
- Supabase Realtime subscriptions
- Auto-update on game, score, participant changes
- Status: ✅ Complete

### `src/hooks/usePlayerState.ts`
- Player authentication and profile management
- Join game with username
- localStorage persistence
- Logout functionality
- Status: ✅ Complete

## 📊 Data Types (`src/types/database.ts`)

Complete TypeScript interfaces for:
- Player
- Game
- Question
- Score
- GameParticipant
- Scoreboard
- GameState
- PlayerAnswer

## ⚙️ Configuration

### Scoring Rules (UPDATED)
- Correct Answer: +100 points
- Incorrect Answer: -25 points
- Speed Bonus (< 20 seconds): +30 points
- Fast correct example: 130 points total
- Slow correct example: 100 points
- Wrong answer example: -25 points

### Game Constants
- Players per game: 8
- Questions per game: 20
- Time per question: 30 seconds
- Image display duration: 15 seconds
- Leaderboard display duration: 5 seconds
- Answer correction display duration: 3 seconds
- Pre-question countdown: 3 seconds

## 🔌 Integration Points

### Supabase
- Real-time game state updates
- Score recording
- Leaderboard calculation
- Player authentication
- Image storage (for question images)

### Edge Functions
- `verify-answer` - Server-side answer validation and scoring
- `finalize-game` - Calculate rankings and end game

## 🎯 Navigation Flow

```
HomePage
  ├── /player/:role ──→ PlayerScreen
  │                      ├── Screen A: Join
  │                      ├── Screen C: Confirm
  │                      ├── Screen D: Wait
  │                      ├── Screen E: Game (repeats 20x)
  │                      ├── Screen F: Results
  │                      └── Returns to Home
  │
  └── /display ──→ PublicDisplay
                     ├── Screen 1: Welcome
                     ├── Screen 2: Wait Players
                     ├── Screen 3: Countdown
                     ├── Screen 4-7: Question Flow (repeats 20x)
                     ├── Screen 8: Winner
                     └── Returns to Home
```

## 🚀 Next Steps

1. **Database Setup**: Run the SQL schema from `db-schema.sql` in Supabase
2. **Deploy Edge Functions**: Deploy `verify-answer` and `finalize-game`
3. **Add Question Data**: Create questions with images in Supabase
4. **Test Game Flow**: Run full 20-question game with multiple players
5. **Performance Optimization**: Optimize image loading and animations
6. **Mobile Responsiveness**: Fine-tune layout for different screen sizes

## 📝 Component Files Summary

```
src/
  components/
    ├── Timer.tsx                 # 30-second + 3-second timers
    ├── Countdown.tsx             # Pre-question 3-2-1 countdown
    ├── PlayerCard.tsx            # Player profile display
    ├── CustomKeyboard.tsx        # Answer input keyboard
    ├── AnswerReveal.tsx          # Letter-by-letter answer reveal
    ├── Leaderboard.tsx           # Rankings + chart + progress
    ├── ErrorBoundary.tsx         # Error handling
    └── ui/                       # shadcn/ui components
  
  pages/
    ├── HomePage.tsx              # Role selection + game start
    ├── PlayerScreen.tsx          # 6 player game screens (A-F)
    ├── PublicDisplay.tsx         # 8 public game screens (1-8)
    ├── GameEnd.tsx               # Final results page
    └── Index.tsx
  
  hooks/
    ├── useGameSync.ts            # Real-time sync with Supabase
    ├── usePlayerState.ts         # Player auth + profile
    └── use-mobile.tsx
    └── use-toast.ts
  
  types/
    ├── game.ts                   # Basic game types
    └── database.ts               # Database schema types
  
  utils/
    ├── supabase.ts               # Supabase client
    ├── database.ts               # Database operations (CRUD)
    └── gameLogic.ts              # Scoring + validation logic
```

## ✅ Testing Checklist

- [ ] Can select role and join game
- [ ] Confirmation dialog shows correct role
- [ ] Waiting screen shows other players
- [ ] Game starts when 8 players join
- [ ] Images display for 15 seconds then hide
- [ ] Timer counts down to 0
- [ ] Keyboard input works correctly
- [ ] Answer validation is case-insensitive
- [ ] Score calculation includes bonuses
- [ ] Real-time leaderboard updates
- [ ] All 20 questions cycle correctly
- [ ] Final winner screen displays
- [ ] Can play multiple rounds

## 📞 Support

For issues or questions:
1. Check the component's JSDoc comments
2. Review the TypeScript types
3. Test with mock data first
4. Check Supabase Realtime connection

---

**Status**: Phase 2 Complete ✅
**Last Updated**: 2024
**Version**: 1.0.0
