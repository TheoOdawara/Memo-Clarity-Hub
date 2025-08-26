import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useAppContext } from './context/AppContext';
import Onboarding from './components/Onboarding';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Home from './components/Home';
import CheckIn from './components/CheckIn';
import Activities from './components/Activities';
import Community from './components/Community';
import Profile from './components/Profile';

const queryClient = new QueryClient();

const AppContent = () => {
  const { userData } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');

  if (!userData.onboardingComplete) {
    return <Onboarding />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'checkin':
        return <CheckIn />;
      case 'activities':
        return <Activities />;
      case 'community':
        return <Community />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-20">
        {renderContent()}
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
