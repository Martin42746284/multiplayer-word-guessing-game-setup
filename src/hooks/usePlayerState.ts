import { useState, useCallback, useEffect } from "react";
import { createPlayer, getPlayerByUsername, updatePlayer } from "../../utils/database";
import { Player, PlayerAnswer } from "../types/database";

export function usePlayerState() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get player from localStorage
  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    if (storedPlayerId) {
      // Player ID is stored, they'll be loaded from DB when needed
      setPlayer({ id: storedPlayerId } as any);
    }
  }, []);

  // Join game with username
  const joinGame = useCallback(async (username: string): Promise<Player> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if player exists
      let existingPlayer = await getPlayerByUsername(username);

      if (!existingPlayer) {
        // Create new player
        existingPlayer = await createPlayer(username);
      }

      setPlayer(existingPlayer);
      localStorage.setItem("playerId", existingPlayer.id);

      return existingPlayer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to join game";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update player profile
  const updatePlayerProfile = useCallback(
    async (updates: Partial<Player>): Promise<Player> => {
      if (!player?.id) throw new Error("No player logged in");

      try {
        setIsLoading(true);
        const updated = await updatePlayer(player.id, updates);
        setPlayer(updated);
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update player";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [player?.id]
  );

  // Logout
  const logout = useCallback(() => {
    setPlayer(null);
    localStorage.removeItem("playerId");
  }, []);

  return {
    player,
    isLoading,
    error,
    joinGame,
    updatePlayerProfile,
    logout,
  };
}
