import { TicketAction, TicketOpportunity } from '@/types/raffles';

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDaysRemainingInMonth = (): number => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate();
};

export const canEarnTicketsToday = (dailyActions: any, date: string): {
  checkin: boolean;
  frequency: boolean;
  game: boolean;
} => {
  const todayActions = dailyActions[date];
  
  if (!todayActions) {
    return { checkin: true, frequency: true, game: true };
  }

  return {
    checkin: !todayActions.checkin,
    frequency: !todayActions.frequency,
    game: !todayActions.game
  };
};

export const getTodayTicketOpportunities = (
  dailyActions: any,
  currentStreak: number
): TicketOpportunity[] => {
  const today = getCurrentDate();
  const canEarn = canEarnTicketsToday(dailyActions, today);
  const todayActions = dailyActions[today];
  const ticketsEarnedToday = todayActions?.ticketsEarned || 0;

  const opportunities: TicketOpportunity[] = [
    {
      id: 'checkin',
      title: 'Check-in Diário',
      description: 'Complete seu check-in do dia',
      tickets: 1,
      completed: !canEarn.checkin,
      maxDaily: 1,
      type: 'daily'
    },
    {
      id: 'frequency',
      title: 'Frequência Sonora',
      description: 'Complete 1 sessão de frequência hoje',
      tickets: 1,
      completed: !canEarn.frequency,
      maxDaily: 1,
      type: 'daily'
    },
    {
      id: 'game',
      title: 'Jogo Cognitivo',
      description: 'Jogue 1 partida de qualquer jogo',
      tickets: 1,
      completed: !canEarn.game,
      maxDaily: 1,
      type: 'daily'
    }
  ];

  // Add milestone opportunities
  const milestones = [7, 30, 60, 90];
  if (milestones.includes(currentStreak)) {
    opportunities.push({
      id: 'milestone',
      title: `Marco de ${currentStreak} dias`,
      description: 'Deixe um depoimento especial',
      tickets: 3,
      completed: false,
      maxDaily: 1,
      type: 'bonus'
    });
  }

  // Check for perfect week bonus
  if (isEligibleForPerfectWeek(dailyActions)) {
    opportunities.push({
      id: 'perfect_week',
      title: 'Semana Perfeita',
      description: '7 check-ins consecutivos',
      tickets: 5,
      completed: false,
      maxDaily: 1,
      type: 'bonus'
    });
  }

  return opportunities;
};

export const isEligibleForPerfectWeek = (dailyActions: any): boolean => {
  const today = new Date();
  let consecutiveDays = 0;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    if (dailyActions[dateString]?.checkin) {
      consecutiveDays++;
    } else {
      break;
    }
  }
  
  return consecutiveDays >= 7;
};

export const calculateTicketsEarned = (
  action: 'checkin' | 'frequency' | 'game' | 'testimony' | 'perfect_week',
  isBonus: boolean = false
): number => {
  switch (action) {
    case 'checkin':
    case 'frequency':
    case 'game':
      return 1;
    case 'testimony':
      return isBonus ? 3 : 0;
    case 'perfect_week':
      return 5;
    default:
      return 0;
  }
};

export const createTicketAction = (
  type: 'checkin' | 'frequency' | 'game' | 'testimony' | 'perfect_week',
  description: string,
  isBonus: boolean = false
): TicketAction => {
  const tickets = calculateTicketsEarned(type, isBonus);
  
  return {
    id: `ticket_${Date.now()}_${Math.random()}`,
    type,
    date: getCurrentDate(),
    tickets,
    description,
    timestamp: Date.now()
  };
};

export const getTicketDisplayMessage = (action: TicketAction): string => {
  const emoji = {
    checkin: '✅',
    frequency: '🎧',
    game: '🎮',
    testimony: '💬',
    perfect_week: '🔥'
  };

  return `${emoji[action.type]} +${action.tickets} bilhete${action.tickets > 1 ? 's' : ''}: ${action.description}`;
};