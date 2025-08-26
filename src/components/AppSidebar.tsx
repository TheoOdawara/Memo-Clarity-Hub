import React from 'react';
import { 
  Home, 
  CheckCircle, 
  Activity, 
  Users, 
  User, 
  Brain,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import realistic images
import headphonesRealistic from '@/assets/headphones-realistic.png';
import gamepadRealistic from '@/assets/gamepad-realistic.png';
import trophyRealistic from '@/assets/trophy-realistic.png';
import calendarRealistic from '@/assets/calendar-realistic.png';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const mainItems = [
  { id: 'home', title: 'Página Inicial', icon: Home },
  { id: 'checkin', title: 'Check-in Diário', icon: CheckCircle },
  { id: 'activities', title: 'Atividades', icon: Activity },
  { id: 'community', title: 'Comunidade', icon: Users },
  { id: 'profile', title: 'Perfil', icon: User },
];

const quickAccessItems = [
  { id: 'frequency', title: 'Frequência do Dia', image: headphonesRealistic, subtitle: '15 min', color: 'text-electric-blue' },
  { id: 'games', title: 'Jogos Cognitivos', image: gamepadRealistic, subtitle: 'Memória', color: 'text-neon-pink' },
  { id: 'ranking', title: 'Ranking Global', image: trophyRealistic, subtitle: 'Top 100', color: 'text-electric-orange' },
  { id: 'calendar', title: 'Calendário', image: calendarRealistic, subtitle: 'Progresso', color: 'text-electric-green' },
];

export function AppSidebar({ activeTab, onTabChange, collapsed, onToggleCollapsed }: AppSidebarProps) {
  const { userData } = useAppContext();

  const isActive = (tabId: string) => activeTab === tabId;

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="p-2 border-b flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleCollapsed}
          className="w-8 h-8 p-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User Profile Section */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Brain className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">Memo Clarity</p>
              <p className="text-xs text-muted-foreground">
                Score: {userData.cognitiveScore}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 p-2 space-y-1">
        {mainItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full justify-start h-10",
              isActive(item.id) 
                ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' 
                : 'hover:bg-muted/50'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3 truncate">{item.title}</span>}
            {!collapsed && item.id === 'checkin' && !userData.dailyCheckInComplete && (
              <div className="ml-auto w-2 h-2 bg-success rounded-full flex-shrink-0" />
            )}
          </Button>
        ))}

        {/* Quick Access Section */}
        {!collapsed && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground px-3">ACESSO RÁPIDO</p>
            </div>
            {quickAccessItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-muted/50 group transition-all duration-300 hover:bg-gradient-to-r hover:from-transparent hover:to-muted/30"
              >
                <div className="w-6 h-6 flex-shrink-0 transition-all duration-300 group-hover:scale-110 mr-3">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate group-hover:text-foreground transition-colors">{item.title}</p>
                  <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-all duration-300" />
              </Button>
            ))}

            {/* Stats Section */}
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground px-3">ESTATÍSTICAS</p>
            </div>
            <div className="px-3 py-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sequência</span>
                <Badge variant="secondary" className="text-xs">
                  {userData.currentStreak} dias
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score</span>
                <Badge variant="outline" className="text-xs">
                  {userData.cognitiveScore}/100
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Badges</span>
                <Badge variant="outline" className="text-xs">
                  {userData.badges.length}
                </Badge>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Settings */}
      <div className="border-t p-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-10 hover:bg-muted/50"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Configurações</span>}
        </Button>
      </div>
    </div>
  );
}