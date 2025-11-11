import { recordScore, getPlayerScore } from "./database";

/**
 * Scoring system:
 * - Correct answer: +100 points
 * - Incorrect answer: -25 points
 * - Speed bonus: +30 points (if answered in less than 10 seconds)
 */

export const SCORING_RULES = {
  CORRECT_ANSWER: 100,
  INCORRECT_ANSWER: -25,
  SPEED_BONUS: 30,
  SPEED_BONUS_THRESHOLD_MS: 20000, // 20 seconds
};

/**
 * Calculate points for a single answer
 */
export function calculatePoints(
  isCorrect: boolean,
  responseTimeMs: number
): {
  basePoints: number;
  bonus: number;
  total: number;
} {
  const basePoints = isCorrect
    ? SCORING_RULES.CORRECT_ANSWER
    : SCORING_RULES.INCORRECT_ANSWER;

  const bonus =
    isCorrect && responseTimeMs < SCORING_RULES.SPEED_BONUS_THRESHOLD_MS
      ? SCORING_RULES.SPEED_BONUS
      : 0;

  return {
    basePoints,
    bonus,
    total: basePoints + bonus,
  };
}

/**
 * Validate if an answer is correct (case-insensitive, trimmed)
 */
export function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * Record a player's answer and calculate score
 */
export async function recordPlayerAnswer(
  gameId: string,
  playerId: string,
  questionId: string,
  userAnswer: string,
  correctAnswer: string,
  responseTimeMs: number
) {
  const isCorrect = validateAnswer(userAnswer, correctAnswer);
  const pointsCalculation = calculatePoints(isCorrect, responseTimeMs);

  const score = await recordScore(
    gameId,
    playerId,
    questionId,
    userAnswer,
    isCorrect,
    responseTimeMs
  );

  return {
    score,
    isCorrect,
    pointsEarned: pointsCalculation.total,
    breakdown: pointsCalculation,
  };
}

/**
 * Get formatted score display
 */
export async function getFormattedScore(gameId: string, playerId: string) {
  const { totalPoints, answers } = await getPlayerScore(gameId, playerId);

  const correctCount = answers.filter((a: any) => a.is_correct).length;
  const accuracy = answers.length > 0 ? (correctCount / answers.length) * 100 : 0;

  return {
    totalPoints,
    correctAnswers: correctCount,
    totalAnswers: answers.length,
    accuracy: Math.round(accuracy),
  };
}

/**
 * Calculate final rankings for all participants
 */
export function calculateRankings(scoreboard: any[]) {
  return scoreboard.map((player, index) => ({
    ...player,
    rank: index + 1,
  }));
}

/**
 * Format time for display (e.g., "1:30" for 90 seconds)
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format milliseconds to readable duration
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Get question progress (e.g., "3 of 10")
 */
export function getQuestionProgress(current: number, total: number): string {
  return `${current} of ${total}`;
}

/**
 * Validate if a game can start
 */
export function canStartGame(participants: any[], minPlayers: number = 2): boolean {
  return participants.length >= minPlayers;
}

/**
 * Check if a game is still accepting participants
 */
export function isAcceptingParticipants(gameStatus: string): boolean {
  return gameStatus === "pending";
}
