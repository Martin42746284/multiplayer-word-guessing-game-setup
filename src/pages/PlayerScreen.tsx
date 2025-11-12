import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayerState } from '@/hooks/usePlayerState';
import { useGameSync } from '@/hooks/useGameSync';
import { Timer } from '@/components/Timer';
import { Countdown } from '@/components/Countdown';
import { AnswerReveal } from '@/components/AnswerReveal';
import { CustomKeyboard } from '@/components/CustomKeyboard';
import { PlayerCard } from '@/components/PlayerCard';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Role } from '@/types/game';
import { recordPlayerAnswer } from '@/utils/gameLogic';

type PlayerScreenType = 'join' | 'selectRole' | 'confirmation' | 'waiting' | 'game' | 'correction' | 'results' | 'final';

export default function PlayerScreen() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const decodedRole = decodeURIComponent(role || '') as Role;

  const { player, joinGame, logout, isLoading } = usePlayerState();
  const gameId = new URLSearchParams(window.location.search).get('gameId');
  const gameState = useGameSync(gameId);

  const [currentScreen, setCurrentScreen] = useState<PlayerScreenType>('selectRole');
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; points: number } | null>(null);
  const [countdownActive, setCountdownActive] = useState(false);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [playerScore, setPlayerScore] = useState(0);

  // Mock current question
  const currentQuestion = {
    id: 'q1',
    number: 1,
    total: 20,
    answer: 'EXAMPLE',
    images: ['https://via.placeholder.com/300?text=Clue+1', 'https://via.placeholder.com/300?text=Clue+2'],
  };

  // Handle role selection and joining game
  const handleJoinGame = async () => {
    try {
      const newPlayer = await joinGame(decodedRole);
      setAllPlayers((prev) => [...prev, newPlayer]);
      setCurrentScreen('confirmation');
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  // Auto-start game when status becomes active
  useEffect(() => {
    if (gameState.game?.status === 'active' && currentScreen === 'waiting') {
      setCountdownActive(true);
      setCurrentScreen('game');
    }
  }, [gameState.game?.status, currentScreen]);

  // Screen A: Role selection / Join game
  if (currentScreen === 'selectRole') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">Chasseur d'indice</h1>
            <p className="text-xl text-white/80">Bienvenue!</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <PlayerCard role={decodedRole} size="lg" />

            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Votre rôle:</p>
              <p className="text-2xl font-bold text-primary">{decodedRole}</p>
            </div>

            <button
              onClick={handleJoinGame}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
            >
              {isLoading ? 'Connexion...' : 'JOUER'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen C: Confirmation dialog
  if (currentScreen === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Êtes-vous <span className="text-primary">{decodedRole}</span> ?
          </h2>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentScreen('waiting')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              OUI
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              NON
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen D: Waiting for game to start
  if (currentScreen === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <div className="text-2xl font-bold text-white">LOGO</div>
          </div>
          <h1 className="text-3xl font-bold text-white">{decodedRole}</h1>
        </div>

        {/* Players list */}
        <div className="space-y-3 w-full max-w-md">
          {[...Array(7)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">LOGO</span>
              </div>
              <span className="text-white font-semibold">P{idx + 1}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold text-white">En attente des joueurs ...</p>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors mt-4"
          >
            Déconnection
          </button>
        </div>
      </div>
    );
  }

  // Screen E: Game screen with image and input
  if (currentScreen === 'game') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center text-white">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-400 rounded-lg flex items-center justify-center">
                <span className="font-bold">LOGO</span>
              </div>
              <p className="text-sm font-semibold">{decodedRole}</p>
            </div>

            <div className="text-2xl font-bold">
              Score: <span className="text-yellow-300">{playerScore}</span>
            </div>

            <div className="text-right space-y-2">
              <Timer initialSeconds={30} onTimeUp={() => setCurrentScreen('correction')} />
              <p className="text-sm">
                {currentQuestion.number} / {currentQuestion.total}
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-8">
            {/* Images (shown for 15 seconds then fade) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {currentQuestion.images.map((img, idx) => (
                <OptimizedImage
                  key={idx}
                  src={img}
                  alt={`Clue ${idx + 1}`}
                  className="w-full h-48 sm:h-64 rounded-lg"
                  priority={idx === 0}
                />
              ))}
            </div>

            {/* Answer input area */}
            <div className="space-y-4">
              <p className="text-lg font-semibold text-foreground">Votre réponse:</p>

              <div className="flex gap-2 justify-center flex-wrap bg-gray-100 p-4 rounded-lg min-h-16">
                {playerAnswer.split('').map((letter, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 bg-white border-2 border-blue-500 rounded flex items-center justify-center font-bold text-lg text-blue-600"
                  >
                    {letter.toUpperCase()}
                  </div>
                ))}

                {/* Empty spaces for remaining letters */}
                {[...Array(Math.max(0, currentQuestion.answer.length - playerAnswer.length))].map(
                  (_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="w-12 h-12 bg-white border-2 border-gray-300 rounded"
                    />
                  )
                )}
              </div>

              {/* Scoring indicators */}
              <div className="flex gap-4 justify-center text-sm font-semibold">
                <span className="text-red-600">-15</span>
                <span className="text-green-600">+20</span>
              </div>
            </div>

            {/* Custom keyboard */}
            <CustomKeyboard
              onInput={(letter) => {
                if (playerAnswer.length < currentQuestion.answer.length) {
                  setPlayerAnswer(playerAnswer + letter);
                }
              }}
              onBackspace={() => setPlayerAnswer(playerAnswer.slice(0, -1))}
              onSubmit={async () => {
                setHasSubmitted(true);
                const startTime = Date.now();
                const responseTime = Date.now() - startTime;

                try {
                  const result = await recordPlayerAnswer(
                    gameId || '',
                    player?.id || '',
                    currentQuestion.id,
                    playerAnswer,
                    currentQuestion.answer,
                    responseTime
                  );

                  setFeedback({
                    isCorrect: result.isCorrect,
                    points: result.pointsEarned,
                  });

                  setPlayerScore(playerScore + result.pointsEarned);
                  setCurrentScreen('correction');
                } catch (error) {
                  console.error('Failed to submit answer:', error);
                }
              }}
              isSubmitDisabled={playerAnswer.length !== currentQuestion.answer.length}
              answerLength={playerAnswer.length}
              correctAnswerLength={currentQuestion.answer.length}
            />
          </div>
        </div>
      </div>
    );
  }

  // Screen 6: Answer correction
  if (currentScreen === 'correction') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8 space-y-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-12 max-w-2xl w-full space-y-8">
          {/* Current score */}
          <div className="text-center space-y-2">
            <p className="text-lg text-muted-foreground">Votre score:</p>
            <p className="text-4xl font-bold text-primary">{playerScore}</p>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.images.map((img, idx) => (
              <OptimizedImage
                key={idx}
                src={img}
                alt={`Clue ${idx + 1}`}
                className="w-full h-40 sm:h-48 rounded-lg"
                priority
              />
            ))}
          </div>

          {/* Answer reveal */}
          <AnswerReveal answer={currentQuestion.answer} />

          {/* Feedback */}
          {feedback && (
            <div
              className={`text-center p-4 rounded-lg ${
                feedback.isCorrect
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <p className="text-lg font-bold">
                {feedback.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-sm">
                {feedback.points > 0 ? '+' : ''}{feedback.points} points
              </p>
            </div>
          )}
        </div>

        {/* Auto-progress */}
        <Timer
          initialSeconds={3}
          onTimeUp={() => {
            if (currentQuestion.number < currentQuestion.total) {
              setPlayerAnswer('');
              setHasSubmitted(false);
              setFeedback(null);
              setCurrentScreen('game');
            } else {
              setCurrentScreen('final');
            }
          }}
          showWarning={false}
        />
      </div>
    );
  }

  // Screen F: Final results
  if (currentScreen === 'final') {
    const isWinner = playerScore > 0; // Simplified logic

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full text-center space-y-8">
          <PlayerCard role={decodedRole} size="lg" />

          <div className="space-y-4">
            <p className="text-2xl font-bold text-foreground">Scores:</p>
            <p className="text-4xl font-bold text-primary">{playerScore}</p>
          </div>

          <div
            className={`text-3xl font-bold p-4 rounded-lg ${
              isWinner
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {isWinner ? '🏆 You Win!' : '👏 Great Try!'}
          </div>

          <p className="text-xl text-primary font-semibold">Félicitations!</p>

          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  );
}
