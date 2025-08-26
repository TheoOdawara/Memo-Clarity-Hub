import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Brain, Headphones, Gamepad2, Trophy, Gift, Flame, Calendar, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Home: React.FC = () => {
  const { userData, hasCompletedToday } = useAppContext();
  const isCheckInComplete = hasCompletedToday();

  // Get next milestone
  const milestones = [7, 30, 60, 90];
  const nextMilestone = milestones.find(m => m > userData.currentStreak);
  
  // Motivational messages based on streak
  const getStreakMessage = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    const yesterdayCheckIn = userData.checkIns.find(c => c.date === yesterdayString);
    
    if (!isCheckInComplete && !yesterdayCheckIn?.completed && userData.currentStreak === 0) {
      return "Tudo bem, recomeçar faz parte. Hoje é Dia 1 — bora juntos!";
    }
    
    if (!isCheckInComplete && userData.currentStreak > 0) {
      return `Não perca sua sequência de ${userData.currentStreak} dias! Faça seu check-in.`;
    }
    
    if (isCheckInComplete && userData.currentStreak > 0) {
      return `Parabéns! ${userData.currentStreak} dias consecutivos e contando.`;
    }
    
    return "Como você está se sentindo hoje?";
  };

  const quickActions = [
    {
      id: 'frequency',
      title: 'Frequência do Dia',
      subtitle: '15 min',
      icon: Headphones,
      bgColor: 'bg-gradient-primary',
    },
    {
      id: 'game',
      title: 'Jogo do Dia',
      subtitle: 'Memória',
      icon: Gamepad2,
      bgColor: 'bg-gradient-secondary',
    },
    {
      id: 'ranking',
      title: 'Ver Ranking',
      subtitle: 'Top 100',
      icon: Trophy,
      bgColor: 'bg-gradient-brain',
    },
    {
      id: 'giveaway',
      title: 'Sorteios do Mês',
      subtitle: 'Participe',
      icon: Gift,
      bgColor: 'bg-gradient-secondary',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Check-in Card */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCheckInComplete ? 'bg-muted' : 'bg-success'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  isCheckInComplete ? 'text-muted-foreground' : 'text-success-foreground'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Check-in do Dia</h3>
                <p className="text-sm text-muted-foreground">
                  {getStreakMessage()}
                </p>
              </div>
            </div>
            <Button 
              disabled={isCheckInComplete}
              variant={isCheckInComplete ? "secondary" : "default"}
              className={!isCheckInComplete ? 'bg-success hover:bg-success/90' : ''}
            >
              {isCheckInComplete ? 'Feito' : 'Fazer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Streak & Score Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak Card */}
        <Card className="shadow-card bg-gradient-primary text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5" />
              <span className="font-semibold text-sm">Sequência</span>
            </div>
            <div className="text-2xl font-bold mb-1">{userData.currentStreak}</div>
            <p className="text-xs opacity-90">
              {userData.currentStreak === 0 ? 'dias' : 
               userData.currentStreak === 1 ? 'dia' : 'dias'}
            </p>
          </CardContent>
        </Card>

        {/* Score Card */}
        <Card className="shadow-card bg-gradient-brain text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5" />
              <span className="font-semibold text-sm">Score</span>
            </div>
            <div className="text-2xl font-bold mb-1">{userData.cognitiveScore}</div>
            <p className="text-xs opacity-90">
              Top {100 - userData.cognitiveScore}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Milestone Alert */}
      {nextMilestone && userData.currentStreak > 0 && (
        <Card className="shadow-card bg-secondary/10 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Próximo Marco</h4>
                <p className="text-sm text-muted-foreground">
                  Faltam {nextMilestone - userData.currentStreak} dias para {nextMilestone} dias consecutivos
                </p>
              </div>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                {Math.round(((userData.currentStreak / nextMilestone) * 100))}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missed Day Alert */}
      {!isCheckInComplete && userData.currentStreak > 5 && (
        <Card className="shadow-card bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div className="flex-1">
                <h4 className="font-semibold text-destructive">Não perca sua sequência!</h4>
                <p className="text-sm text-destructive/80">
                  Você tem {userData.currentStreak} dias consecutivos. Faça seu check-in hoje.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.id} className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-12 h-12 rounded-full ${action.bgColor} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{action.title}</h4>
                      <p className="text-xs text-muted-foreground">{action.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Badges */}
      {userData.badges.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {userData.badges.slice(-3).map((badge) => (
                <Badge key={badge.id} variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 whitespace-nowrap">
                  {badge.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Promotional Banner */}
      <Card className="shadow-card bg-gradient-secondary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-secondary-foreground">Sorteio de Dezembro</h4>
              <p className="text-sm text-secondary-foreground/80">Participe e concorra a prêmios incríveis!</p>
            </div>
            <Button size="sm" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground">
              Participar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;