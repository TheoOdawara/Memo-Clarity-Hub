import React from 'react';
import { Home, CheckCircle, Activity, Users, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'checkin', icon: CheckCircle, label: 'Check-in' },
    { id: 'activities', icon: Activity, label: 'Atividades' },
    { id: 'community', icon: Users, label: 'Comunidade' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="bg-card border-t border-border px-2 py-2 flex justify-around items-center shadow-elevated">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;