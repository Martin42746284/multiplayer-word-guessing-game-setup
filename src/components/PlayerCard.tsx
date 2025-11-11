import { 
  Scale, Heart, Church, Code, Languages, Radio, Briefcase, GraduationCap 
} from 'lucide-react';
import { Role } from '@/types/game';

const roleIcons: Record<Role, typeof Scale> = {
  'Droit': Scale,
  'Nurs': Heart,
  'Théologie': Church,
  'Informatique': Code,
  'Langue Anglaise': Languages,
  'Communication': Radio,
  'Gestion': Briefcase,
  'Professeur': GraduationCap,
};

const roleColors: Record<Role, string> = {
  'Droit': 'bg-gradient-to-br from-blue-400 to-blue-600',
  'Nurs': 'bg-gradient-to-br from-pink-400 to-pink-600',
  'Théologie': 'bg-gradient-to-br from-purple-400 to-purple-600',
  'Informatique': 'bg-gradient-to-br from-green-400 to-green-600',
  'Langue Anglaise': 'bg-gradient-to-br from-yellow-400 to-yellow-600',
  'Communication': 'bg-gradient-to-br from-orange-400 to-orange-600',
  'Gestion': 'bg-gradient-to-br from-indigo-400 to-indigo-600',
  'Professeur': 'bg-gradient-to-br from-red-400 to-red-600',
};

interface PlayerCardProps {
  role: Role;
  playerName?: string;
  score?: number;
  rank?: number;
  isAnswered?: boolean;
  isDisabled?: boolean;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  notification?: string;
}

export function PlayerCard({
  role,
  playerName,
  score,
  rank,
  isAnswered = false,
  isDisabled = false,
  showScore = true,
  size = 'md',
  onClick,
  notification,
}: PlayerCardProps) {
  const Icon = roleIcons[role];
  const colorClass = roleColors[role];

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} ${colorClass} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
            isDisabled ? 'opacity-50' : ''
          } ${isAnswered ? 'ring-4 ring-green-500' : ''}`}
        >
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>

        {rank && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {rank}
          </div>
        )}

        {notification && (
          <div
            className={`absolute -top-3 -right-3 text-sm font-bold px-2 py-1 rounded ${
              notification.startsWith('+')
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification}
          </div>
        )}
      </div>

      {playerName && <p className="text-sm font-semibold text-foreground">{playerName}</p>}

      {showScore && score !== undefined && (
        <p className="text-xs text-muted-foreground">
          Score: <span className="font-bold">{score}</span>
        </p>
      )}
    </div>
  );
}
