export interface TicketAction {
  id: string;
  type: 'checkin' | 'frequency' | 'game' | 'testimony' | 'perfect_week';
  date: string;
  tickets: number;
  description: string;
  timestamp: number;
}

export interface MonthlyRaffle {
  id: string;
  month: string; // YYYY-MM format
  startDate: string;
  endDate: string;
  prizes: RafflePrize[];
  winners?: RaffleWinner[];
  isActive: boolean;
}

export interface RafflePrize {
  position: number;
  title: string;
  description: string;
  image?: string;
  value: string;
}

export interface RaffleWinner {
  position: number;
  username: string;
  ticketCount: number;
  prizeWon: string;
  drawDate: string;
}

export interface UserTicketData {
  currentMonthTickets: number;
  totalLifetimeTickets: number;
  ticketHistory: TicketAction[];
  dailyActions: {
    [date: string]: {
      checkin: boolean;
      frequency: boolean;
      game: boolean;
      ticketsEarned: number;
    };
  };
  monthlyStats: {
    [month: string]: {
      totalTickets: number;
      actions: TicketAction[];
    };
  };
}

export interface TicketOpportunity {
  id: string;
  title: string;
  description: string;
  tickets: number;
  completed: boolean;
  maxDaily: number;
  type: 'daily' | 'bonus';
}