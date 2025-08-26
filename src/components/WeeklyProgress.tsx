import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface CheckInEntry {
  date: string;
  completed: boolean;
}

interface WeeklyProgressProps {
  weekData: CheckInEntry[];
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ weekData }) => {
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const getDayNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Últimos 7 dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          {weekData.map((day, index) => (
            <div key={day.date} className="flex flex-col items-center space-y-2">
              <span className="text-xs text-muted-foreground font-medium">
                {getDayName(day.date)}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isToday(day.date) ? 'ring-2 ring-primary ring-offset-2' : ''
              } ${
                day.completed 
                  ? 'bg-success text-success-foreground' 
                  : isToday(day.date) 
                    ? 'bg-primary/10 border-2 border-primary' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {day.completed ? (
                  <Check className="w-5 h-5" />
                ) : new Date(day.date) > new Date() ? (
                  <span className="text-xs font-bold">{getDayNumber(day.date)}</span>
                ) : (
                  <X className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs font-bold">
                {getDayNumber(day.date)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;