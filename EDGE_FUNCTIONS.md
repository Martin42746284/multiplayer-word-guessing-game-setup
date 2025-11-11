# Supabase Edge Functions - Deployment Guide

## Overview

Two edge functions handle the game logic server-side:

1. **verify-answer** - Validates player answers and calculates scores
2. **finalize-game** - Calculates final rankings and ends the game

These functions run on Deno runtime in Supabase and do NOT run in your React app.

## Environment

- **Runtime**: Deno (https://deno.land)
- **Module**: Uses esm.sh imports (not npm)
- **Config**: `supabase/functions/deno.json`

## Deployment

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

4. Verify deployment:
```bash
supabase functions list
```

### Option B: Using Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **Functions** in the left sidebar
4. Click **Create a new function**
5. Name: `verify-answer`
6. Copy contents of `supabase/functions/verify-answer/index.ts`
7. Click **Deploy**
8. Repeat for `finalize-game`

## Environment Variables

The edge functions need access to Supabase service role key (automatically available):

```
SUPABASE_URL          (automatically set)
SUPABASE_SERVICE_ROLE_KEY (automatically set)
```

These are NOT the same as frontend credentials. The service role key allows the function to perform admin operations.

## Testing Locally

### Test verify-answer:

```bash
curl -X POST http://localhost:54321/functions/v1/verify-answer \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "game-123",
    "playerId": "player-456",
    "questionId": "question-1",
    "userAnswer": "EXAMPLE",
    "correctAnswer": "EXAMPLE",
    "responseTimeMs": 15000
  }'
```

### Test finalize-game:

```bash
curl -X POST http://localhost:54321/functions/v1/finalize-game \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "game-123"
  }'
```

## Scoring Rules (Updated)

Both edge functions use the same scoring logic:

```
CORRECT_ANSWER: +100 points
INCORRECT_ANSWER: -25 points
SPEED_BONUS: +30 points (if answered in < 20 seconds)
```

Examples:
- Fast correct (< 20s): 100 + 30 = **130 points**
- Slow correct (> 20s): **100 points**
- Wrong answer: **-25 points**

## File Structure

```
supabase/
  functions/
    deno.json                    ← Deno config
    verify-answer/
      index.ts                   ← Answer validation
    finalize-game/
      index.ts                   ← Ranking calculation
  rls-policies.sql              ← Database permissions
```

## Troubleshooting

### Issue: "Function not found"
- Ensure function was deployed: `supabase functions list`
- Check function name matches (no hyphens in function names)
- Wait 30 seconds after deployment for propagation

### Issue: "SUPABASE_URL is undefined"
- Edge functions automatically get Supabase environment variables
- No need to add them to .env
- Check that Supabase project is linked with `supabase link`

### Issue: "Row violates RLS policy"
- Ensure RLS policies are set up: run `supabase/rls-policies.sql`
- Policies allow public (anon) access for game operations
- For production, update policies to use `auth.uid()` instead

### Issue: TypeScript errors in VS Code
- These are Deno files, not TypeScript/React files
- Errors in editor won't affect deployment
- Main project tsconfig.json excludes `supabase/` directory

## Scoring Validation Flow

1. **Player submits answer** in React app
2. **Frontend calls verify-answer** edge function
3. **Edge function**:
   - Validates answer (case-insensitive, trimmed)
   - Calculates points (+100/-25 + bonus if < 20s)
   - Records score in database
   - Returns result to frontend
4. **Frontend updates** player's score UI

## Monitoring

View edge function logs in Supabase Dashboard:
1. Go to **Functions**
2. Click on function name
3. View **Logs** tab

Logs show all API calls, errors, and console output.

## Next Steps

1. Deploy both edge functions
2. Test with the verify-answer curl example above
3. Play a full game and verify scores
4. Check function logs if there are issues

## Limits

- **Timeout**: 60 seconds per request
- **Memory**: 512 MB
- **Max file size**: 20 MB
- **Concurrent**: Depends on plan

---

For more info: https://supabase.com/docs/guides/functions
