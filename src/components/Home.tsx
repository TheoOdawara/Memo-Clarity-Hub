import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Brain, Headphones, Gamepad2, Trophy, Gift } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Home: React.FC = () => {
  const { userData, completeDailyCheckIn } = useAppContext();

  const handleCheckIn = () => {
    completeDailyCheckIn();
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
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Check-in Card */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userData.dailyCheckInComplete ? 'bg-muted' : 'bg-success'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  userData.dailyCheckInComplete ? 'text-muted-foreground' : 'text-success-foreground'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Check-in do Dia</h3>
                <p className="text-sm text-muted-foreground">
                  {userData.dailyCheckInComplete ? 'Concluído hoje' : 'Como você está se sentindo?'}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleCheckIn}
              disabled={userData.dailyCheckInComplete}
              variant={userData.dailyCheckInComplete ? "secondary" : "default"}
              className={!userData.dailyCheckInComplete ? 'bg-success hover:bg-success/90' : ''}
            >
              {userData.dailyCheckInComplete ? 'Feito' : 'Fazer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Score Card */}
      <Card className="shadow-card bg-gradient-brain text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6" />
                <span className="font-semibold">Score de Cognição</span>
              </div>
              <div className="text-3xl font-bold mb-1">{userData.cognitiveScore}</div>
              <p className="text-sm opacity-90">
                Sua mente está mais afiada que {userData.cognitiveScore}% da comunidade
              </p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              +3 hoje
            </Badge>
          </div>
        </CardContent>
      </Card>

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