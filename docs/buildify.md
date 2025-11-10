### Requirements

**Game Concept:**
- Multiplayer word guessing game (4 images 1 word concept)
- 8 players compete in real-time
- 3-6 images illustrate a single word per question
- Real-time scoring, validation, and synchronization

**Player Roles:**
Droit, Nurs, Théologie, Informatique, Langue Anglaise, Communication, Gestion, Professeur

**Scoring System:**
- Correct answer: +100 points
- Wrong answer: -25 points
- Speed bonus (< 20s): +30 points
- Question ends when 3 players answer correctly OR 60s timer expires

**Game Flow:**
1. Role selection (8 players)
2. Profile creation (automatic)
3. Game starts when all 8 players ready
4. Questions with images, custom keyboard, timer
5. Real-time score updates and visual feedback
6. End screen with rankings and statistics

### Designs

**Color System:**
- Correct answer: Green (--game-correct)
- Wrong answer: Red (--game-incorrect)
- Pending/Warning: Yellow (--game-pending)
- Completed: Blue (--game-completed)

**Screens:**
1. Home Page: Role selection (8 buttons with icons)
2. Player Screen: Individual game interface with keyboard, images, score
3. Public Display: Central screen showing all 8 players, question, timer
4. Game End: Rankings with color-coded scores (red/blue/green)

### Tasks

#### Phase 1: Backend & Real-time (8 tasks)
- [ ] T1.1: Link project to Supabase (50 LOC, 500 tokens)
- [ ] T1.2: Create database schema - players, games, questions, answers tables (150 LOC, 1500 tokens)
- [ ] T1.3: Seed sample questions with images (100 LOC, 1000 tokens)
- [ ] T1.4: Create Supabase context provider for React (80 LOC, 800 tokens)
- [ ] T1.5: Implement game state management with React Query (120 LOC, 1200 tokens)
- [ ] T1.6: Create real-time subscription hooks for game updates (100 LOC, 1000 tokens)
- [ ] T1.7: Build edge function for game logic validation (150 LOC, 1500 tokens)
- [ ] T1.8: Create edge function for score calculation (100 LOC, 1000 tokens)

#### Phase 2: Player Interface (6 tasks)
- [ ] T2.1: Build custom keyboard component with accent letters (120 LOC, 1200 tokens)
- [ ] T2.2: Create answer input zone with letter boxes (80 LOC, 800 tokens)
- [ ] T2.3: Implement answer validation with visual feedback (100 LOC, 1000 tokens)
- [ ] T2.4: Build score display with animations (+100, -25, +30) (90 LOC, 900 tokens)
- [ ] T2.5: Create timer component with countdown (60 LOC, 600 tokens)
- [ ] T2.6: Integrate player screen with real-time game state (130 LOC, 1300 tokens)

**Execution Strategy:**
Phase 1: Start with Supabase setup, then database schema, then real-time hooks
Phase 2: Build UI components first, then integrate with backend
