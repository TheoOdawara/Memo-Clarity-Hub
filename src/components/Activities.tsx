import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Headphones, Gamepad2, BookOpen, Target, Play, Lock } from 'lucide-react';

const Activities: React.FC = () => {
  const activities = [
    {
      id: 'frequency',
      title: 'Frequência Cerebral',
      description: 'Sons binaurais para melhorar foco',
      duration: '15 min',
      icon: Headphones,
      completed: true,
      progress: 100,
      bgColor: 'bg-gradient-primary',
    },
    {
      id: 'memory-game',
      title: 'Jogo de Memória',
      description: 'Exercite sua memória de trabalho',
      duration: '10 min',
      icon: Gamepad2,
      completed: false,
      progress: 0,
      bgColor: 'bg-gradient-secondary',
    },
    {
      id: 'reading',
      title: 'Leitura Guiada',
      description: 'Artigos sobre neurociência',
      duration: '5 min',
      icon: BookOpen,
      completed: false,
      progress: 60,
      bgColor: 'bg-gradient-brain',
    },
    {
      id: 'meditation',
      title: 'Meditação Focada',
      description: 'Pratique mindfulness',
      duration: '12 min',
      icon: Target,
      completed: false,
      progress: 0,
      bgColor: 'bg-gradient-primary',
      locked: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Atividades Cognitivas</h2>
        <p className="text-muted-foreground">Complete suas atividades diárias para maximizar os resultados</p>
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <Card key={activity.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${activity.bgColor} flex items-center justify-center relative`}>
                      <Icon className="w-6 h-6 text-white" />
                      {activity.locked && (
                        <div className="absolute -top-1 -right-1 bg-muted w-6 h-6 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{activity.title}</h3>
                        {activity.completed && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Concluído
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.duration}</span>
                        {activity.progress > 0 && activity.progress < 100 && (
                          <>
                            <span>•</span>
                            <span>{activity.progress}% completo</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    disabled={activity.locked}
                    variant={activity.completed ? "secondary" : "default"}
                    className={activity.completed ? '' : 'bg-primary hover:bg-primary/90'}
                  >
                    {activity.locked ? (
                      <Lock className="w-4 h-4" />
                    ) : activity.completed ? (
                      'Revisar'
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        {activity.progress > 0 ? 'Continuar' : 'Iniciar'}
                      </>
                    )}
                  </Button>
                </div>
                
                {activity.progress > 0 && activity.progress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{activity.progress}%</span>
                    </div>
                    <Progress value={activity.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card bg-gradient-secondary">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-bold text-secondary-foreground mb-2">Desbloqueie Mais Atividades</h3>
            <p className="text-sm text-secondary-foreground/80 mb-4">Complete suas atividades por 7 dias consecutivos</p>
            <Progress value={42} className="h-2 mb-2" />
            <p className="text-xs text-secondary-foreground/70">3 de 7 dias completos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;