import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Award } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  maxStreak: number;
  nextMilestone?: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ currentStreak, maxStreak, nextMilestone }) => {
  const isRecord = currentStreak === maxStreak && currentStreak > 0;
  
  return (
    <Card className="shadow-card bg-gradient-primary text-white">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-8 h-8 animate-pulse-soft" />
            <h3 className="text-2xl font-bold">Dia {currentStreak}</h3>
          </div>
          
          <p className="text-white/90">
            {currentStreak === 0 ? 'Comece sua jornada hoje!' :
             currentStreak === 1 ? 'Primeiro dia da sua jornada' :
             `${currentStreak} dias consecutivos`}
          </p>
          
          {currentStreak > 0 && (
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/20">
              {isRecord && (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  <Award className="w-3 h-3 mr-1" />
                  Novo Recorde!
                </Badge>
              )}
              
              {!isRecord && maxStreak > 0 && (
                <span className="text-sm text-white/70">
                  Recorde: {maxStreak} dias
                </span>
              )}
              
              {nextMilestone && (
                <span className="text-sm text-white/70">
                  Próximo: {nextMilestone} dias
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCounter;