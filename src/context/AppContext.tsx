import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GameResult } from '@/types/games';

interface CheckInEntry {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  testimony?: string;
  isPublic?: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt?: string;
  milestone: number;
}

interface UserData {
  email?: string;
  timezone: string;
  reminderTime: string;
  goal: string;
  cognitiveScore: number;
  avgGameScore: number; // 0-70 average score from cognitive games
  weeklyFrequencyMinutes: number; // total minutes of audio frequencies this week
  dailyCheckInComplete: boolean;
  onboardingComplete: boolean;
  isLoggedIn: boolean;
  checkIns: CheckInEntry[];
  currentStreak: number;
  maxStreak: number;
  badges: Badge[];
  gameResults?: GameResult[];
  gameLevels?: { [gameType: string]: number };
}

interface AppContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  completeOnboarding: () => void;
  loginWithEmail: (email: string) => void;
  completeDailyCheckIn: (testimony?: string, isPublic?: boolean) => Badge | null;
  saveGameResult: (result: GameResult) => void;
  getTodayCheckIn: () => CheckInEntry | null;
  getWeeklyProgress: () => CheckInEntry[];
  hasCompletedToday: () => boolean;
  calculateCognitiveScore: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUserData: UserData = {
  email: '',
  timezone: '',
  reminderTime: '',
  goal: '',
  cognitiveScore: 67,
  avgGameScore: 50, // Initial average game score
  weeklyFrequencyMinutes: 120, // Initial weekly frequency minutes (2 hours)
  dailyCheckInComplete: false,
  onboardingComplete: false,
  isLoggedIn: false,
  checkIns: [],
  currentStreak: 0,
  maxStreak: 0,
  badges: [],
  gameResults: [],
  gameLevels: { sequence: 1, association: 1, reaction: 1 },
};

const milestones = [
  { id: 'first-week', name: 'Primeira Semana', description: '7 dias consecutivos', milestone: 7 },
  { id: 'first-month', name: 'Primeiro Mês', description: '30 dias consecutivos', milestone: 30 },
  { id: 'two-months', name: 'Dois Meses', description: '60 dias consecutivos', milestone: 60 },
  { id: 'three-months', name: 'Três Meses', description: '90 dias consecutivos', milestone: 90 },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const stored = localStorage.getItem('memoClarity-userData');
    return stored ? { ...defaultUserData, ...JSON.parse(stored) } : defaultUserData;
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('memoClarity-userData', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    setUserData(prev => ({ ...prev, onboardingComplete: true }));
  };

  const loginWithEmail = (email: string) => {
    setUserData(prev => ({ 
      ...prev, 
      email,
      isLoggedIn: true,
      onboardingComplete: true 
    }));
  };

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const calculateStreak = (checkIns: CheckInEntry[]): { current: number, max: number } => {
    if (checkIns.length === 0) return { current: 0, max: 0 };
    
    const sortedCheckIns = [...checkIns]
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Check current streak from today backwards
    for (let i = 0; i < sortedCheckIns.length; i++) {
      const checkIn = sortedCheckIns[i];
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      const expectedDateString = expectedDate.toISOString().split('T')[0];
      
      if (checkIn.date === expectedDateString) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate max streak
    for (let i = 0; i < sortedCheckIns.length; i++) {
      const current = sortedCheckIns[i];
      const next = sortedCheckIns[i + 1];
      
      tempStreak++;
      
      if (!next) {
        maxStreak = Math.max(maxStreak, tempStreak);
        break;
      }
      
      const currentDate = new Date(current.date);
      const nextDate = new Date(next.date);
      const dayDiff = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff !== 1) {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 0;
      }
    }
    
    return { current: currentStreak, max: Math.max(maxStreak, currentStreak) };
  };

  const calculateCognitiveScore = (): number => {
    const streakWeight = userData.currentStreak * 0.8; // máximo ~30 pontos
    
    // Calculate average game score from recent results
    let gameScore = userData.avgGameScore;
    if (userData.gameResults && userData.gameResults.length > 0) {
      const recentGames = userData.gameResults.slice(-10);
      gameScore = recentGames.reduce((sum, game) => sum + game.score, 0) / recentGames.length;
    }
    const gamesWeight = gameScore * 0.5; // máximo ~50 pontos (increased weight for games)
    
    const frequenciesWeight = userData.weeklyFrequencyMinutes * 0.1; // máximo ~20 pontos
    
    const rawScore = Math.min(100, streakWeight + gamesWeight + frequenciesWeight);
    return Math.round(rawScore);
  };

  const saveGameResult = (result: GameResult) => {
    setUserData(prev => {
      const newGameResults = [...(prev.gameResults || []), result];
      
      // Keep only last 50 results to avoid storage bloat
      const trimmedResults = newGameResults.slice(-50);
      
      // Update average game score
      const recentGames = trimmedResults.slice(-10);
      const newAvgGameScore = recentGames.length > 0 ? 
        recentGames.reduce((sum, game) => sum + game.score, 0) / recentGames.length : prev.avgGameScore;
      
      // Calculate new cognitive score
      const streakWeight = prev.currentStreak * 0.8;
      const gamesWeight = newAvgGameScore * 0.5;
      const frequenciesWeight = prev.weeklyFrequencyMinutes * 0.1;
      const newCognitiveScore = Math.round(Math.min(100, streakWeight + gamesWeight + frequenciesWeight));
      
      return {
        ...prev,
        gameResults: trimmedResults,
        avgGameScore: Math.round(newAvgGameScore),
        cognitiveScore: newCognitiveScore
      };
    });
  };

  const completeDailyCheckIn = (testimony?: string, isPublic?: boolean): Badge | null => {
    const today = getTodayString();
    
    setUserData(prev => {
      const existingCheckIn = prev.checkIns.find(c => c.date === today);
      if (existingCheckIn && existingCheckIn.completed) {
        return prev; // Already completed today
      }
      
      const newCheckIns = prev.checkIns.filter(c => c.date !== today);
      newCheckIns.push({
        date: today,
        completed: true,
        testimony,
        isPublic
      });
      
      const { current, max } = calculateStreak(newCheckIns);
      
      // Check for new badge
      let newBadge: Badge | null = null;
      const unearned = milestones.find(m => 
        m.milestone === current && 
        !prev.badges.find(b => b.id === m.id)
      );
      
      const updatedBadges = [...prev.badges];
      if (unearned) {
        newBadge = {
          ...unearned,
          earnedAt: today
        };
        updatedBadges.push(newBadge);
      }
      
      const updatedData = {
        ...prev,
        checkIns: newCheckIns,
        currentStreak: current,
        maxStreak: max,
        dailyCheckInComplete: true,
        badges: updatedBadges,
      };
      
      // Calculate cognitive score with updated data
      const streakWeight = current * 0.8;
      const gamesWeight = updatedData.avgGameScore * 0.5;
      const frequenciesWeight = updatedData.weeklyFrequencyMinutes * 0.2;
      const rawScore = Math.min(100, streakWeight + gamesWeight + frequenciesWeight);
      
      return {
        ...updatedData,
        cognitiveScore: Math.round(rawScore)
      };
    });
    
    return userData.badges.find(b => b.milestone === userData.currentStreak + 1) || null;
  };

  const getTodayCheckIn = (): CheckInEntry | null => {
    const today = getTodayString();
    return userData.checkIns.find(c => c.date === today) || null;
  };

  const getWeeklyProgress = (): CheckInEntry[] => {
    const result: CheckInEntry[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const checkIn = userData.checkIns.find(c => c.date === dateString);
      result.push(checkIn || { date: dateString, completed: false });
    }
    
    return result;
  };

  const hasCompletedToday = (): boolean => {
    const today = getTodayString();
    const todayCheckIn = userData.checkIns.find(c => c.date === today);
    return todayCheckIn?.completed || false;
  };

  return (
    <AppContext.Provider value={{
      userData,
      updateUserData,
      completeOnboarding,
      loginWithEmail,
      completeDailyCheckIn,
      saveGameResult,
      getTodayCheckIn,
      getWeeklyProgress,
      hasCompletedToday,
      calculateCognitiveScore,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};