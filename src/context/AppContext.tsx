import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  timezone: string;
  reminderTime: string;
  goal: string;
  cognitiveScore: number;
  dailyCheckInComplete: boolean;
  onboardingComplete: boolean;
}

interface AppContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  completeOnboarding: () => void;
  completeDailyCheckIn: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUserData: UserData = {
  timezone: '',
  reminderTime: '',
  goal: '',
  cognitiveScore: 67,
  dailyCheckInComplete: false,
  onboardingComplete: false,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    setUserData(prev => ({ ...prev, onboardingComplete: true }));
  };

  const completeDailyCheckIn = () => {
    setUserData(prev => ({ ...prev, dailyCheckInComplete: true }));
  };

  return (
    <AppContext.Provider value={{
      userData,
      updateUserData,
      completeOnboarding,
      completeDailyCheckIn,
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