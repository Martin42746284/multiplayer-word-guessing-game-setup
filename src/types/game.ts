
export type Role = 
  | 'Droit'
  | 'Nursing'
  | 'Théologie'
  | 'Informatique'
  | 'Langue Anglaise'
  | 'Communication'
  | 'Gestion'
  | 'Perso';

export interface PlayerProfile {
  id: string;
  role: Role;
  avatar: string;
  score: number;
  hasAnswered: boolean;
}

export interface GameQuestion {
  id: string;
  images: string[];
  answer: string;
  availableLetters: string[];
}

export interface GameState {
  players: PlayerProfile[];
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  isActive: boolean;
}