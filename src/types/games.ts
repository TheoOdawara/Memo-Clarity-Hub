export interface GameResult {
  id: string;
  gameType: 'sequence' | 'association' | 'reaction';
  score: number; // 0-100
  level: number; // 1-10
  date: string; // YYYY-MM-DD
  timestamp: number;
  stats: {
    correctAnswers: number;
    totalQuestions: number;
    averageReactionTime?: number;
    timeSpent: number; // seconds
  };
}

export interface GameLevel {
  level: number;
  sequenceLength?: number; // for sequence game
  pairCount?: number; // for association game
  speed?: number; // for reaction game (ms between stimuli)
  distractors?: boolean; // for reaction game
}

export interface GameConfig {
  type: 'sequence' | 'association' | 'reaction';
  title: string;
  description: string;
  icon: string;
  color: string;
  maxLevel: number;
}

export interface GameState {
  isPlaying: boolean;
  currentGame: string | null;
  showInstructions: boolean;
  countdown: number;
  currentLevel: number;
  score: number;
  stats: {
    correctAnswers: number;
    totalQuestions: number;
    startTime: number;
    reactionTimes: number[];
  };
}