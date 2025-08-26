import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { User, Settings, Bell, Trophy, Calendar, Target, ChevronRight, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Profile: React.FC = () => {
  const { userData } = useAppContext();

  const stats = [
    { label: 'Dias Consecutivos', value: '12', icon: Calendar, color: 'text-primary' },
    { label: 'Score Total', value: userData.cognitiveScore.toString(), icon: Trophy, color: 'text-secondary' },
    { label: 'Atividades Completas', value: '24', icon: Target, color: 'text-success' },
  ];

  const achievements = [
    { id: 'first-week', name: 'Primeira Semana', description: '7 dias consecutivos', earned: true },
    { id: 'score-70', name: 'Score 70+', description: 'Alcançou 70 pontos', earned: false, progress: 95 },
    { id: 'social', name: 'Sociável', description: 'Participou da comunidade', earned: true },
    { id: 'consistency', name: 'Consistente', description: '30 dias consecutivos', earned: false, progress: 40 },
  ];

  const menuItems = [
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'logout', label: 'Sair', icon: LogOut, variant: 'destructive' as const },
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                VC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Seu Perfil</h2>
              <p className="text-muted-foreground">Membro desde dezembro 2024</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {userData.goal === 'consistency' ? 'Foco em Consistência' :
                   userData.goal === 'memory' ? 'Melhorando Memória' :
                   userData.goal === 'score' ? 'Meta Score 80+' : 'Explorando'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`flex items-center gap-4 p-3 rounded-lg ${
                achievement.earned ? 'bg-success/10' : 'bg-muted/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Trophy className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                  {achievement.earned && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                      Conquistado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                
                {!achievement.earned && achievement.progress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-1" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings Menu */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id}>
                <button className={`w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors ${
                  item.variant === 'destructive' ? 'text-destructive' : 'text-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                {index < menuItems.length - 1 && <hr className="border-border" />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;