import { useEffect, useState } from 'react';
import { useGameSync } from '@/hooks/useGameSync';
import { Timer } from '@/components/Timer';
import { Countdown } from '@/components/Countdown';
import { AnswerReveal } from '@/components/AnswerReveal';
import { Leaderboard } from '@/components/Leaderboard';
import { PlayerCard } from '@/components/PlayerCard';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Role } from '@/types/game';

type ScreenType = 'welcome' | 'waiting' | 'countdown' | 'images' | 'playing' | 'correction' | 'leaderboard' | 'winner';

const roles: Role[] = [
  'Droit',
  'Nurs',
  'Théologie',
  'Informatique',
  'Langue Anglaise',
  'Communication',
  'Gestion',
  'Professeur',
];

export default function PublicDisplay() {
  const gameId = new URLSearchParams(window.location.search).get('gameId');
  const gameState = useGameSync(gameId);

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);
  const [showScores, setShowScores] = useState(false);
  const [scoringAnimations, setScoringAnimations] = useState<Record<string, string>>({});

  // Auto-transition to waiting when game is active
  useEffect(() => {
    if (gameState.game?.status === 'active' && currentScreen === 'welcome') {
      setCurrentScreen('waiting');
    }
  }, [gameState.game?.status, currentScreen]);

  // Mock data for demo - replace with real data from gameState
  const players = roles.map((role, idx) => ({
    id: `player-${idx}`,
    role,
    score: Math.floor(Math.random() * 500),
    hasAnswered: Math.random() > 0.5,
  }));

  const currentQuestionData = {
    id: `q-${currentQuestion}`,
    images: ['https://via.placeholder.com/200?text=Image+1', 'https://via.placeholder.com/200?text=Image+2'],
    answer: 'EXAMPLE',
  };

  // Screen 1: Welcome screen (until first account validation)
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-8">
          <div className="text-6xl font-bold text-white drop-shadow-lg animate-bounce">
            🎮
          </div>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Chasseur d'indice
          </h1>
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
            <div className="text-8xl font-bold text-white">LOGO</div>
          </div>
          <p className="text-xl text-white/90">
            En attente de la première validation de compte...
          </p>
        </div>
      </div>
    );
  }

  // Screen 2: Waiting for 8 players
  if (currentScreen === 'waiting') {
    const readyPlayers = players.filter((p) => p.hasAnswered).length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-8">
        <div className="max-w-6xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <div className="text-4xl font-bold text-white">LOGO</div>
            </div>
            <h1 className="text-4xl font-bold text-white">Chasseur d'indice</h1>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
            {players.map((player, idx) => (
              <div key={player.id} className="flex flex-col items-center gap-2">
                <PlayerCard
                  role={player.role}
                  playerName={player.hasAnswered ? `P${idx + 1}` : '...'}
                  size="lg"
                  isDisabled={!player.hasAnswered}
                />
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="text-center text-white">
            <p className="text-2xl font-semibold">
              {readyPlayers}/8 joueurs prêts
            </p>
            {readyPlayers === 8 && (
              <p className="text-lg mt-2 animate-pulse">Démarrage dans 3 secondes...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: Countdown before question (3, 2, 1)
  if (currentScreen === 'countdown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-8 relative">
        {/* Background with player grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-8 h-full">
            {players.map((player) => (
              <div key={player.id} className="flex justify-center">
                <PlayerCard role={player.role} size="md" />
              </div>
            ))}
          </div>
        </div>

        {/* Countdown overlay */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <Countdown from={3} onComplete={() => setCurrentScreen('images')} size="lg" />
        </div>
      </div>
    );
  }

  // Screen 4: Display images (15 seconds)
  if (currentScreen === 'images') {
    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-8 space-y-8">
        {/* Top bar */}
        <div className="w-full flex justify-between items-center">
          <div className="text-2xl font-bold text-white">30 : 00</div>
          <div className="text-2xl font-bold text-white">i / n</div>
        </div>

        {/* Images display */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full px-4">
            {currentQuestionData.images.map((img, idx) => (
              <div
                key={idx}
                className={`transition-opacity duration-300 ${
                  imageVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <OptimizedImage
                  src={img}
                  alt={`Question ${idx + 1}`}
                  className="w-full h-40 sm:h-64 rounded-lg"
                  priority
                />
              </div>
            ))}
          </div>
        </div>

        {/* Timer */}
        <Timer
          initialSeconds={15}
          onTimeUp={() => {
            setImageVisible(false);
            setCurrentScreen('playing');
          }}
        />
      </div>
    );
  }

  // Screen 5: Playing - timer and scores
  if (currentScreen === 'playing') {
    return (
      <div className="min-h-screen bg-gray-800 p-8 space-y-8">
        {/* Top bar with timer and progress */}
        <div className="flex justify-between items-center text-white">
          <Timer initialSeconds={30} onTimeUp={() => setCurrentScreen('correction')} />
          <div className="text-2xl font-bold">
            {currentQuestion + 1} / 20
          </div>
        </div>

        {/* Player grid with scores and notifications */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {players.map((player, idx) => (
            <div key={player.id} className="flex flex-col items-center gap-2">
              <PlayerCard
                role={player.role}
                playerName={`P${idx + 1}`}
                score={player.score}
                isAnswered={player.hasAnswered}
                notification={scoringAnimations[player.id]}
                size="md"
              />
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center text-white text-lg">
          En attente des réponses...
        </div>
      </div>
    );
  }

  // Screen 6: Answer correction
  if (currentScreen === 'correction') {
    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 sm:p-8 space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center w-full max-w-4xl">
          {/* Images */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {currentQuestionData.images.map((img, idx) => (
              <OptimizedImage
                key={idx}
                src={img}
                alt={`Question ${idx + 1}`}
                className="w-full sm:w-48 h-40 sm:h-48 rounded-lg"
                priority
              />
            ))}
          </div>

          {/* Answer reveal */}
          <div className="space-y-6 w-full sm:w-auto">
            <h2 className="text-2xl font-bold text-white">Réponse:</h2>
            <AnswerReveal answer={currentQuestionData.answer} />
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-white text-sm">
          Affichage de la réponse - 3 secondes
        </div>

        {/* Auto-progress after 3 seconds */}
        <Timer
          initialSeconds={3}
          onTimeUp={() => {
            if (currentQuestion < 19) {
              setCurrentQuestion(currentQuestion + 1);
              setImageVisible(true);
              setCurrentScreen('leaderboard');
            } else {
              setCurrentScreen('winner');
            }
          }}
          showWarning={false}
        />
      </div>
    );
  }

  // Screen 7: Leaderboard and results
  if (currentScreen === 'leaderboard') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const leaderboardEntries = sortedPlayers.map((player, idx) => ({
      rank: idx + 1,
      role: player.role,
      playerName: `P${players.indexOf(player) + 1}`,
      score: player.score,
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <Leaderboard
            entries={leaderboardEntries}
            showChart={true}
            progressPercentage={((currentQuestion + 1) / 20) * 100}
            questionNumber={currentQuestion + 1}
            totalQuestions={20}
            chartData={[
              { question: `Q${currentQuestion}`, player1: 100, player2: 120, player3: 90 },
            ]}
          />
        </div>

        {/* Auto-progress after 5 seconds */}
        <Timer
          initialSeconds={5}
          onTimeUp={() => setCurrentScreen('countdown')}
          showWarning={false}
        />
      </div>
    );
  }

  // Screen 8: Winner announcement
  if (currentScreen === 'winner') {
    const winner = [...players].sort((a, b) => b.score - a.score)[0];
    const winnerIdx = players.indexOf(winner);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex flex-col items-center justify-center p-4 sm:p-8 space-y-8 sm:space-y-12">
        {/* Winner announcement */}
        <div className="text-center space-y-6 sm:space-y-8 animate-bounce">
          <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg">
            🏆 GAGNANT! 🏆
          </h1>

          <PlayerCard
            role={winner.role}
            playerName={`P${winnerIdx + 1}`}
            score={winner.score}
            size="lg"
          />

          <div className="space-y-2">
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {winner.role}
            </p>
            <p className="text-xl sm:text-2xl text-white">
              Score: {winner.score}
            </p>
          </div>

          <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
            Félicitations!
          </p>
        </div>

        {/* Confetti effect (visual only) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
