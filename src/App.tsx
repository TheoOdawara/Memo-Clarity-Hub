import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useAppContext } from './context/AppContext';
import Onboarding from './components/Onboarding';
import Header from './components/Header';
import { AppSidebar } from './components/AppSidebar';
import Home from './components/Home';
import CheckIn from './components/CheckIn';
import Activities from './components/Activities';
import Community from './components/Community';
import Profile from './components/Profile';

const queryClient = new QueryClient();

const AppContent = () => {
  const { userData } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <div className="flex flex-1">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto p-4">
              {renderContent()}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-80 border-l bg-card/50 p-4">
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-foreground mb-3">Patrocinado</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Suplementos Cognitivos</p>
                      <p className="text-xs text-muted-foreground">Melhore sua performance mental</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-semibold text-foreground mb-3">Membros Ativos</h3>
                <div className="space-y-2">
                  {['Ana Silva', 'Carlos Santos', 'Maria Oliveira'].map((name, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-sm">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
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
