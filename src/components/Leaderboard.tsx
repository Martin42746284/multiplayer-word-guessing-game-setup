import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PlayerCard } from './PlayerCard';
import { Role } from '@/types/game';

interface LeaderboardEntry {
  rank: number;
  role: Role;
  playerName?: string;
  score: number;
  correctAnswers?: number;
  totalAnswers?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  showChart?: boolean;
  chartData?: any[];
  progressPercentage?: number;
  questionNumber?: number;
  totalQuestions?: number;
}

export function Leaderboard({
  entries,
  showChart = false,
  chartData = [],
  progressPercentage = 0,
  questionNumber = 0,
  totalQuestions = 0,
}: LeaderboardProps) {
  return (
    <div className="space-y-6">
      {/* Rankings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Résultats</h2>

        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
            >
              <div className="text-2xl font-bold text-yellow-600 w-8">
                {entry.rank}
              </div>

              <PlayerCard role={entry.role} size="sm" showScore={false} />

              <div className="flex-1">
                {entry.playerName && (
                  <p className="font-semibold text-foreground">{entry.playerName}</p>
                )}
                <p className="text-sm text-muted-foreground">{entry.role}</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{entry.score}</p>
                {entry.correctAnswers !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {entry.correctAnswers}/{entry.totalAnswers}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      {showChart && chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Évolution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip />
              <Legend />
              {entries.map((entry, idx) => (
                <Line
                  key={entry.rank}
                  type="monotone"
                  dataKey={`player${entry.rank}`}
                  stroke={`hsl(${idx * 45}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Progress Bar */}
      {progressPercentage > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">Progression</span>
            <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-purple-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {questionNumber > 0 && totalQuestions > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Question {questionNumber} sur {totalQuestions}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
