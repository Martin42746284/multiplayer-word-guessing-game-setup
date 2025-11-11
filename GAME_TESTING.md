# Game Testing Guide - "Chasseur d'indice"

## Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 2. Testing Flow

#### Option A: Test Player Screen
1. Go to `http://localhost:5173`
2. Click on any role (e.g., "Droit")
3. You'll be taken to the player game screen
4. This will cycle through all player screens: Join → Confirm → Waiting → Game → Correction → Results

#### Option B: Test Public Display
1. Go to `http://localhost:5173`
2. Click the "📺 Affichage Public" button
3. Opens public display in fullscreen mode
4. Shows all 8 public screens in sequence

### 3. Screen Walkthrough

#### Player Screen Flow
```
HomePage (Role Selection)
    ↓
Screen A: Join Game (shows logo + JOUER button)
    ↓
Screen C: Confirmation (Êtes-vous [Role]?)
    ↓
Screen D: Waiting (En attente des joueurs...)
    ↓
Screen E: Game (with images + keyboard)
    ↓
Screen F: Correction (showing answer)
    ↓
Screen F: Final Results (You Win/Lose)
    ↓
Back to HomePage
```

#### Public Display Flow
```
Screen 1: Welcome (LOGO + title)
    ↓
Screen 2: Waiting for Players (8-slot grid)
    ↓
Screen 3: Countdown (3, 2, 1)
    ↓
Screen 4: Images Display (15 seconds)
    ↓
Screen 5: Playing (timer + scores)
    ↓
Screen 6: Correction (answer reveal)
    ↓
Screen 7: Leaderboard (rankings + chart)
    ↓
Repeat Screens 3-7 for each question
    ↓
Screen 8: Winner (celebration)
```

## Testing Specific Components

### Timer Component
```typescript
<Timer 
  initialSeconds={30}
  onTimeUp={() => console.log('Time is up!')}
  showWarning={true}
/>
```

### Countdown Component
```typescript
<Countdown 
  from={3}
  onComplete={() => console.log('Countdown finished')}
  size="lg"
/>
```

### PlayerCard Component
```typescript
<PlayerCard 
  role="Droit"
  playerName="P1"
  score={250}
  rank={1}
  isAnswered={true}
  notification="+100"
  size="md"
/>
```

### CustomKeyboard Component
```typescript
<CustomKeyboard 
  onInput={(letter) => console.log(letter)}
  onSubmit={() => console.log('Submitted')}
  onBackspace={() => console.log('Backspace')}
  answerLength={3}
  correctAnswerLength={7}
/>
```

### AnswerReveal Component
```typescript
<AnswerReveal 
  answer="EXAMPLE"
  duration={2000}
  isCorrect={true}
/>
```

## Game Constants (in `utils/gameLogic.ts`)

```typescript
const SCORING_RULES = {
  CORRECT_ANSWER: 100,           // Points for correct answer
  INCORRECT_ANSWER: -25,         // Penalty for wrong answer
  SPEED_BONUS: 30,               // Bonus for fast answer
  SPEED_BONUS_THRESHOLD_MS: 20000, // 20 seconds
};
```

## Keyboard Input Reference

The CustomKeyboard component includes:
- **A-Z**: All alphabet letters (auto-uppercase)
- **0-9**: Numbers
- **Special**: `-`, `'`, `.`, space
- **Backspace**: Clear last letter
- **Validate**: Submit answer (only enabled when complete)

## Example Questions for Testing

```typescript
const testQuestions = [
  {
    id: '1',
    images: ['https://via.placeholder.com/300?text=Image+1'],
    answer: 'YES',
  },
  {
    id: '2',
    images: ['https://via.placeholder.com/300?text=Image+2'],
    answer: 'EXAMPLE',
  },
  {
    id: '3',
    images: ['https://via.placeholder.com/300?text=Image+3'],
    answer: 'ANSWER',
  },
];
```

## State Management

### useGameSync Hook
Provides real-time game state:
```typescript
const gameState = useGameSync(gameId);
// Returns: { game, participants, scoreboard, currentQuestion, isLoading, error }
```

### usePlayerState Hook
Manages player authentication:
```typescript
const { player, joinGame, logout, isLoading } = usePlayerState();
```

## Performance Tips

1. **Image Optimization**: Use placeholder images during development
2. **Animations**: Reduce animation duration in dev mode for faster testing
3. **Real-time Updates**: Use Supabase Realtime for multi-player testing
4. **Score Calculation**: Edge functions handle server-side validation

## Debugging

### Enable Console Logs
```typescript
// In components, add:
console.log('Current screen:', currentScreen);
console.log('Game state:', gameState);
console.log('Player answer:', playerAnswer);
```

### Check Timer Accuracy
```typescript
const startTime = Date.now();
// ... after some action
const elapsed = Date.now() - startTime;
console.log(`Elapsed: ${elapsed}ms`);
```

### Validate Answer Logic
```typescript
import { validateAnswer, calculatePoints } from '@/utils/gameLogic';

const isCorrect = validateAnswer(userInput, correctAnswer);
const points = calculatePoints(isCorrect, responseTime);
console.log('Validation:', { isCorrect, points });
```

## Common Issues & Fixes

### Issue: Timer doesn't update
**Fix**: Ensure `onTimeUp` callback is provided and timer is re-mounted properly

### Issue: Keyboard input not working
**Fix**: Check that the `CustomKeyboard` is receiving the correct props and handlers are connected

### Issue: Images not loading
**Fix**: Verify image URLs are valid and CORS is configured

### Issue: Scores not updating
**Fix**: Check Supabase Realtime is enabled and subscriptions are active

## Multi-Player Testing

To test with multiple players:
1. Open multiple browser windows/tabs
2. Have each player select different roles
3. All players should join the same game (use same gameId)
4. Leaderboard updates in real-time across all screens

## Performance Testing

### Monitor rendering performance
```bash
npm run build
# Check bundle size and load time
```

### Test with slow network
1. Open DevTools → Network
2. Select "Slow 3G" or "Fast 3G"
3. Verify all features still work

### Check memory usage
1. Open DevTools → Memory
2. Take heap snapshot before and after game
3. Verify no memory leaks

## Browser Compatibility

Tested and supported:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Accessibility Testing

- ✅ Keyboard navigation (Tab key)
- ✅ Screen reader compatibility (role labels)
- ✅ Color contrast (for score notifications)
- ✅ Font sizes (minimum 12px)

---

## Quick Reference URLs

- **Home**: `http://localhost:5173/`
- **Player Screen**: `http://localhost:5173/player/Droit?gameId=game-123`
- **Public Display**: `http://localhost:5173/display?gameId=game-123`
- **Game End**: `http://localhost:5173/end`

---

**Happy Testing! 🎮**
