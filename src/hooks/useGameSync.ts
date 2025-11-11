import { useEffect, useState, useCallback, useRef } from "react";
import {
  subscribeToGameUpdates,
  subscribeToScores,
  subscribeToGameParticipants,
  unsubscribeFromChannel,
  getGameScoreboard,
  getGameParticipants,
  getGame,
} from "../../utils/database";
import { GameState, Game, Scoreboard, GameParticipant, Question } from "../types/database";

export function useGameSync(gameId: string | null) {
  const [gameState, setGameState] = useState<GameState>({
    game: null,
    participants: [],
    scoreboard: [],
    currentQuestion: null,
    isLoading: true,
    error: null,
  });

  const subscriptionsRef = useRef<any[]>([]);

  // Initialize game state
  const initializeGame = useCallback(async () => {
    if (!gameId) return;

    try {
      setGameState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [game, participants, scoreboard] = await Promise.all([
        getGame(gameId),
        getGameParticipants(gameId),
        getGameScoreboard(gameId),
      ]);

      setGameState((prev) => ({
        ...prev,
        game,
        participants,
        scoreboard,
        isLoading: false,
      }));
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load game",
        isLoading: false,
      }));
    }
  }, [gameId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!gameId) return;

    initializeGame();

    // Subscribe to game status changes
    const gameSubscription = subscribeToGameUpdates(gameId, (payload) => {
      setGameState((prev) => ({
        ...prev,
        game: payload.new as Game,
      }));
    });

    // Subscribe to score updates
    const scoresSubscription = subscribeToScores(gameId, async () => {
      try {
        const scoreboard = await getGameScoreboard(gameId);
        setGameState((prev) => ({
          ...prev,
          scoreboard,
        }));
      } catch (error) {
        console.error("Failed to update scoreboard:", error);
      }
    });

    // Subscribe to participant updates
    const participantsSubscription = subscribeToGameParticipants(gameId, async () => {
      try {
        const participants = await getGameParticipants(gameId);
        setGameState((prev) => ({
          ...prev,
          participants,
        }));
      } catch (error) {
        console.error("Failed to update participants:", error);
      }
    });

    subscriptionsRef.current = [
      gameSubscription,
      scoresSubscription,
      participantsSubscription,
    ];

    // Cleanup subscriptions on unmount
    return () => {
      subscriptionsRef.current.forEach((sub) => {
        unsubscribeFromChannel(sub);
      });
      subscriptionsRef.current = [];
    };
  }, [gameId, initializeGame]);

  return gameState;
}
