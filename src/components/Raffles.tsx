import React, { useState, useEffect } from 'react';
import { Gift, Ticket, Clock, Trophy, Star, CheckCircle, Circle, Calendar, Users, Award, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { TicketOpportunity, RafflePrize, RaffleWinner } from '@/types/raffles';
import { getDaysRemainingInMonth, getTodayTicketOpportunities } from '@/utils/ticketSystem';
import { cn } from '@/lib/utils';

// Mock data for current month's raffle
const currentRafflePrizes: RafflePrize[] = [
  {
    position: 1,
    title: '1º Lugar - Grande Prêmio',
    description: '3 frascos grátis + consulta VIP personalizada',
    value: 'R$ 450',
    image: '🏆'
  },
  {
    position: 2,
    title: '2º Lugar - Prêmio Premium',
    description: '2 frascos + bônus digital exclusivo',
    value: 'R$ 280',
    image: '🥈'
  },
  {
    position: 3,
    title: '3º Lugar - Prêmio Bronze',
    description: '1 frasco + e-book de otimização mental',
    value: 'R$ 150',
    image: '🥉'
  },
  {
    position: 4,
    title: '4º ao 10º Lugar',
    description: '50% de desconto + conteúdo exclusivo',
    value: 'R$ 75',
    image: '🎁'
  }
];

// Mock winners from previous months
const previousWinners: RaffleWinner[] = [
  {
    position: 1,
    username: 'Ana***',
    ticketCount: 89,
    prizeWon: '3 frascos + consulta VIP',
    drawDate: '2024-01-31'
  },
  {
    position: 2,
    username: 'Car***',
    ticketCount: 76,
    prizeWon: '2 frascos + bônus digital',
    drawDate: '2024-01-31'
  },
  {
    position: 3,
    username: 'Mar***',
    ticketCount: 65,
    prizeWon: '1 frasco + e-book',
    drawDate: '2024-01-31'
  }
];

const Raffles: React.FC = () => {
  const { userData, userTicketData } = useAppContext();
  const [showTicketAnimation, setShowTicketAnimation] = useState(false);
  
  const daysRemaining = getDaysRemainingInMonth();
  const currentTickets = userTicketData?.currentMonthTickets || 0;
  const opportunities = getTodayTicketOpportunities(
    userTicketData?.dailyActions || {}, 
    userData.currentStreak
  );

  const dailyOpportunities = opportunities.filter(op => op.type === 'daily');
  const bonusOpportunities = opportunities.filter(op => op.type === 'bonus');
  const completedToday = dailyOpportunities.filter(op => op.completed).length;
  const maxDaily = dailyOpportunities.length;

  const getPrizeIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Award className="w-6 h-6 text-gray-400" />;
      case 3: return <Trophy className="w-6 h-6 text-amber-600" />;
      default: return <Gift className="w-6 h-6 text-primary" />;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'border-yellow-200 bg-yellow-50';
      case 2: return 'border-gray-200 bg-gray-50';  
      case 3: return 'border-amber-200 bg-amber-50';
      default: return 'border-primary/20 bg-primary/5';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Sorteio Mensal</h1>
          <p className="text-muted-foreground">Ganhe bilhetes e concorra a prêmios incríveis</p>
        </div>
      </div>

      {/* Current Tickets Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentTickets}</h3>
                <p className="text-muted-foreground">bilhetes este mês</p>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Sorteio em</span>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {daysRemaining} dias
              </Badge>
            </div>
          </div>

          {daysRemaining <= 3 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-destructive font-medium">
                {daysRemaining === 0 
                  ? "🚨 Hoje é sua última chance de participar!" 
                  : `⏰ Faltam apenas ${daysRemaining} dias para o sorteio!`
                }
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Sorteio acontece no último dia do mês às 20h</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Ganhar Bilhetes</TabsTrigger>
          <TabsTrigger value="prizes">Prêmios</TabsTrigger>
          <TabsTrigger value="winners">Vencedores</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Como ganhar bilhetes hoje</h2>
            <Badge variant={completedToday === maxDaily ? "default" : "outline"}>
              {completedToday}/{maxDaily} concluídas
            </Badge>
          </div>

          <div className="grid gap-4">
            {dailyOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className={cn(
                "transition-all duration-200",
                opportunity.completed ? "bg-success/5 border-success/20" : "hover:shadow-md"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      opportunity.completed ? "bg-success text-white" : "bg-muted"
                    )}>
                      {opportunity.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{opportunity.title}</h4>
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={opportunity.completed ? "default" : "secondary"}>
                        +{opportunity.tickets} bilhete{opportunity.tickets > 1 ? 's' : ''}
                      </Badge>
                      {opportunity.completed && (
                        <p className="text-xs text-success mt-1">✅ Concluído</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {bonusOpportunities.length > 0 && (
              <>
                <div className="flex items-center gap-2 mt-6">
                  <Star className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-secondary">Oportunidades Bônus</h3>
                </div>
                {bonusOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="border-secondary/20 bg-secondary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{opportunity.title}</h4>
                          <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                        </div>
                        <Badge className="bg-secondary text-white">
                          +{opportunity.tickets} bilhetes
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>

          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">📋 Resumo das Regras</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Máximo de 3 bilhetes por dia (ações diárias)</li>
                <li>• Bônus não contam para o limite diário</li>
                <li>• 1 bilhete por tipo de ação por dia</li>
                <li>• Marcos especiais dão 3 bilhetes bônus</li>
                <li>• Semana perfeita (7/7) dá 5 bilhetes bônus</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prizes" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold mb-2">Prêmios deste mês</h2>
            <p className="text-muted-foreground">Quanto mais bilhetes, maiores suas chances!</p>
          </div>

          <div className="grid gap-4">
            {currentRafflePrizes.map((prize) => (
              <Card key={prize.position} className={cn(
                "transition-all duration-200 hover:shadow-lg",
                getPositionColor(prize.position)
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {prize.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPrizeIcon(prize.position)}
                        <h3 className="font-bold text-lg">{prize.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-2">{prize.description}</p>
                      <Badge variant="outline">
                        Valor: {prize.value}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-secondary-foreground" />
                <div>
                  <h4 className="font-semibold text-secondary-foreground">Como funciona o sorteio?</h4>
                  <p className="text-sm text-secondary-foreground/80">
                    Cada bilhete é uma chance de ganhar. O sorteio é transparente e todos os usuários podem acompanhar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="winners" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold mb-2">Vencedores Anteriores</h2>
            <p className="text-muted-foreground">Transparência total nos nossos sorteios</p>
          </div>

          <div className="space-y-4">
            {previousWinners.map((winner) => (
              <Card key={`${winner.drawDate}-${winner.position}`} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      {getPrizeIcon(winner.position)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {winner.position}º lugar
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{winner.username}</h4>
                      <p className="text-sm text-muted-foreground">{winner.prizeWon}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {winner.ticketCount} bilhetes
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(winner.drawDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Seja o próximo vencedor!</h3>
              <p className="text-muted-foreground text-sm">
                Complete suas ações diárias para maximizar suas chances no próximo sorteio.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Raffles;