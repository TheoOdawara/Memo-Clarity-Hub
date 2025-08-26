import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Users, TrendingUp, MessageCircle, ChevronRight } from 'lucide-react';

const Community: React.FC = () => {
  const leaderboard = [
    { rank: 1, name: 'Ana Silva', score: 94, streak: 28, avatar: 'AS' },
    { rank: 2, name: 'Carlos Med', score: 91, streak: 25, avatar: 'CM' },
    { rank: 3, name: 'Marina F.', score: 88, streak: 22, avatar: 'MF' },
    { rank: 4, name: 'Você', score: 67, streak: 12, avatar: 'VC', isUser: true },
    { rank: 5, name: 'Pedro L.', score: 65, streak: 15, avatar: 'PL' },
  ];

  const groups = [
    {
      id: 'beginners',
      name: 'Iniciantes',
      members: 1247,
      description: 'Para quem está começando a jornada',
      active: true,
    },
    {
      id: 'advanced',
      name: 'Avançados',
      members: 832,
      description: 'Usuários com 60+ dias consecutivos',
      active: false,
    },
    {
      id: 'support',
      name: 'Suporte Mútuo',
      members: 567,
      description: 'Compartilhe experiências e dicas',
      active: true,
    },
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Comunidade</h2>
        <p className="text-muted-foreground">Conecte-se com outros usuários na sua jornada</p>
      </div>

      {/* Ranking */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            Ranking Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboard.map((user) => (
            <div 
              key={user.rank}
              className={`flex items-center gap-4 p-3 rounded-lg ${
                user.isUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  user.rank === 1 ? 'bg-secondary text-secondary-foreground' :
                  user.rank === 2 ? 'bg-muted text-muted-foreground' :
                  user.rank === 3 ? 'bg-accent text-accent-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {user.rank}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={user.isUser ? 'bg-primary text-primary-foreground' : ''}>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{user.name}</span>
                  {user.isUser && <Badge variant="outline">Você</Badge>}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {user.score} pts
                  </span>
                  <span>{user.streak} dias</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Grupos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Grupos da Comunidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groups.map((group) => (
            <div 
              key={group.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{group.name}</h4>
                  {group.active && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                      Ativo
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{group.description}</p>
                <span className="text-xs text-muted-foreground">{group.members} membros</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 border-l-4 border-primary/20 bg-primary/5 rounded-r-lg">
            <Avatar className="w-8 h-8">
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm"><strong>Ana Silva</strong> completou 30 dias consecutivos!</p>
              <span className="text-xs text-muted-foreground">2 horas atrás</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 border-l-4 border-secondary/20 bg-secondary/5 rounded-r-lg">
            <Avatar className="w-8 h-8">
              <AvatarFallback>CM</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm"><strong>Carlos Med</strong> alcançou score 91 pontos</p>
              <span className="text-xs text-muted-foreground">4 horas atrás</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;