
export type Role = 
  | 'Droit'
  | 'Nurs'
  | 'Théologie'
  | 'Informatique'
  | 'Langue Anglaise'
  | 'Communication'
  | 'Gestion'
  | 'Professeur';

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