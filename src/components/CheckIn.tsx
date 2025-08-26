import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Pill, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import StreakCounter from './StreakCounter';
import WeeklyProgress from './WeeklyProgress';
import BadgeModal from './BadgeModal';
import TestimonyModal from './TestimonyModal';

const CheckIn: React.FC = () => {
  const { userData, completeDailyCheckIn, hasCompletedToday, getWeeklyProgress } = useAppContext();
  const [isCompleted, setIsCompleted] = useState(hasCompletedToday());
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTestimonyModal, setShowTestimonyModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState<any>(null);
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const weeklyData = getWeeklyProgress();
  
  // Get next milestone
  const milestones = [7, 30, 60, 90];
  const nextMilestone = milestones.find(m => m > userData.currentStreak);

  useEffect(() => {
    setIsCompleted(hasCompletedToday());
  }, [hasCompletedToday, userData.checkIns]);

  const handleCheckIn = () => {
    if (isCompleted) return;
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowTestimonyModal(true);
    }, 1500);
  };

  const handleTestimonySubmit = (testimony: string, isPublic: boolean) => {
    const badge = completeDailyCheckIn(testimony, isPublic);
    setIsCompleted(true);
    
    if (badge) {
      setNewBadge(badge);
      setShowBadgeModal(true);
    }
  };

  const getMotivationalMessage = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    const yesterdayCheckIn = userData.checkIns.find(c => c.date === yesterdayString);
    
    if (isCompleted) {
      return `Perfeito! Check-in de hoje completo.`;
    }
    
    if (!yesterdayCheckIn?.completed && userData.currentStreak === 0) {
      return "Tudo bem, recomeçar faz parte. Hoje é Dia 1 — bora juntos!";
    }
    
    if (userData.currentStreak > 0) {
      return `Incrível! Você não perde um dia há ${userData.currentStreak} dias`;
    }
    
    return "Que tal começar uma nova sequência hoje?";
  };

  if (showSuccess) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh] animate-fade-in">
        <Card className="shadow-elevated max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-success rounded-full flex items-center justify-center animate-pulse-soft">
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Ótimo trabalho!</h2>
            <p className="text-muted-foreground">Check-in registrado com sucesso</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Check-in do Dia</h1>
        </div>
        <p className="text-muted-foreground capitalize">{formattedDate}</p>
      </div>

      {/* Streak Counter */}
      <StreakCounter 
        currentStreak={userData.currentStreak}
        maxStreak={userData.maxStreak}
        nextMilestone={nextMilestone}
      />

      {/* Main Check-in Button */}
      <Card className="shadow-card">
        <CardContent className="p-8 text-center space-y-6">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
            isCompleted ? 'bg-muted' : 'bg-success animate-pulse-soft'
          }`}>
            <Pill className={`w-12 h-12 ${
              isCompleted ? 'text-muted-foreground' : 'text-success-foreground'
            }`} />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              {isCompleted ? 'Dose registrada hoje!' : 'Marque sua dose do dia'}
            </h2>
            <p className="text-muted-foreground">
              {getMotivationalMessage()}
            </p>
          </div>
          
          <Button 
            onClick={handleCheckIn}
            disabled={isCompleted}
            size="lg"
            className={`w-full text-lg py-6 ${
              isCompleted 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-success hover:bg-success/90 animate-pulse-soft'
            }`}
          >
            {isCompleted ? 'Marcado hoje' : 'Marquei minha dose'}
          </Button>
          
          {isCompleted && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              +5 pontos no score cognitivo
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <WeeklyProgress weekData={weeklyData} />

      {/* Next Milestone */}
      {nextMilestone && (
        <Card className="shadow-card bg-gradient-secondary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-secondary-foreground" />
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-foreground">Próximo Marco</h4>
                <p className="text-sm text-secondary-foreground/80">
                  Faltam {nextMilestone - userData.currentStreak} dias para {nextMilestone} dias consecutivos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <TestimonyModal
        isOpen={showTestimonyModal}
        onClose={() => setShowTestimonyModal(false)}
        onSubmit={handleTestimonySubmit}
      />
      
      <BadgeModal
        badge={newBadge}
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
      />
    </div>
  );
};

export default CheckIn;