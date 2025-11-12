import { useEffect, useState } from 'react';
import { useGameSync } from '@/hooks/useGameSync';
import { Medal, Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameEnd() {
  const gameId = new URLSearchParams(window.location.search).get('gameId');
  const gameState = useGameSync(gameId);
  const navigate = useNavigate();

  const sortedParticipants = [...(gameState.participants || [])].sort(
    (a: any, b: any) => (b.final_score || 0) - (a.final_score || 0)
  );

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-orange-600" />;
    return null;
  };

  const handlePlayAgain = () => {
    navigate('/');
  };

  if (gameState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (gameState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-purple-600 to-pink-500 flex items-center justify-center p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Erreur:</strong>
          <span className="block sm:inline ml-2">{gameState.error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-600 to-pink-500 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎉 Fin de Partie
          </h1>
          <p className="text-lg sm:text-2xl text-white/90 font-medium">
            {gameState.game?.title || 'Classement Final'}
          </p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3 sm:space-y-4">
          {sortedParticipants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-muted-foreground text-lg">Aucun participant</p>
            </div>
          ) : (
            sortedParticipants.map((participant: any, index: number) => (
              <div
                key={participant.player_id}
                className={`rounded-lg shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 transform transition-all hover:scale-102 ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 scale-105'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                    : 'bg-white'
                }`}
              >
                {/* Rank Medal */}
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center">
                  {getMedalIcon(index + 1) ? (
                    getMedalIcon(index + 1)
                  ) : (
                    <span className={`text-3xl sm:text-4xl font-bold ${
                      index < 3 ? 'text-white' : 'text-foreground'
                    }`}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-grow text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2">
                    {participant.players?.avatar_url && (
                      <img
                        src={participant.players.avatar_url}
                        alt={participant.players.username}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white"
                      />
                    )}
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold ${
                        index < 3 ? 'text-white' : 'text-foreground'
                      }`}>
                        {participant.players?.username || 'Joueur'}
                      </h3>
                      <p className={`text-xs sm:text-sm ${
                        index < 3 ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        Rang #{index + 1}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-center sm:text-right">
                  <div className={`text-2xl sm:text-4xl font-bold flex items-center gap-1 sm:gap-2 justify-center sm:justify-end ${
                    index < 3 ? 'text-white' : 'text-foreground'
                  }`}>
                    <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8" />
                    {participant.final_score || 0}
                  </div>
                  <p className={`text-xs sm:text-sm ${
                    index < 3 ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    points
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Game Statistics */}
        {gameState.scoreboard && gameState.scoreboard.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              📊 Statistiques de la Partie
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-4xl font-bold text-blue-600">
                  {gameState.participants?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Joueurs</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-4xl font-bold text-green-600">
                  {gameState.scoreboard.reduce((sum: number, s: any) => sum + s.total_answers, 0)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Réponses</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-4xl font-bold text-purple-600">
                  {Math.round(
                    (gameState.scoreboard.reduce((sum: number, s: any) => sum + s.correct_answers, 0) /
                      Math.max(gameState.scoreboard.reduce((sum: number, s: any) => sum + s.total_answers, 0), 1)) *
                      100
                  )}%
                </p>
                <p className="text-sm text-muted-foreground mt-2">Taux de Réussite</p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-4xl font-bold text-orange-600">
                  {Math.max(...gameState.scoreboard.map((s: any) => s.total_points), 0)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Score Max</p>
              </div>
            </div>
          </div>
        )}

        {/* Play Again Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={handlePlayAgain}
            className="px-8 sm:px-12 py-3 sm:py-4 bg-white hover:bg-gray-100 text-primary font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            🎮 Nouvelle Partie
          </button>
        </div>
      </div>
    </div>
  );
}
