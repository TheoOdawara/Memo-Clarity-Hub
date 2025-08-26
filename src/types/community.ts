export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  currentStreak: number;
  maxStreak: number;
  cognitiveScore: number;
  totalCheckIns: number;
  joinDate: string;
  isPublic: boolean;
}

export interface Testimony {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  dayNumber: number; // Which day of their journey
  milestone?: number; // 7, 30, 60, 90 if it's a milestone testimony
  likes: number;
  likedBy: string[];
  date: string;
  timestamp: number;
  isPublic: boolean;
}

export interface RankingUser {
  id: string;
  username: string;
  avatar: string;
  currentStreak: number;
  cognitiveScore: number;
  position: number;
  badge?: string;
}

export interface CommunityData {
  userProfile?: UserProfile;
  testimonies: Testimony[];
  streakRanking: RankingUser[];
  scoreRanking: RankingUser[];
  userPosition: {
    streak: number;
    score: number;
  };
}