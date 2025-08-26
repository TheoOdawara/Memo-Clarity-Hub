import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge as BadgeIcon, Award, Sparkles, Flame } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  milestone: number;
  earnedAt?: string;
}

interface BadgeModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ badge, isOpen, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && badge) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, badge]);

  if (!badge) return null;

  const getBadgeIcon = (milestone: number) => {
    if (milestone >= 90) return Award;
    if (milestone >= 30) return Flame;
    if (milestone >= 7) return BadgeIcon;
    return Sparkles;
  };

  const getBadgeColor = (milestone: number) => {
    if (milestone >= 90) return 'text-yellow-500';
    if (milestone >= 30) return 'text-orange-500';
    if (milestone >= 7) return 'text-blue-500';
    return 'text-purple-500';
  };

  const Icon = getBadgeIcon(badge.milestone);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-center p-8 max-w-md">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="confetti-animation">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-secondary rounded animate-pulse-soft"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-secondary flex items-center justify-center ${getBadgeColor(badge.milestone)}`}>
              <Icon className="w-10 h-10" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Parabéns!</h2>
              <h3 className="text-xl font-semibold text-foreground">{badge.name}</h3>
              <p className="text-muted-foreground">{badge.description}</p>
            </div>
          </div>
          
          <div className="bg-gradient-brain text-white p-4 rounded-lg">
            <p className="font-semibold mb-2">🎉 Conquista Desbloqueada!</p>
            <p className="text-sm opacity-90">
              {badge.milestone === 7 && "Você provou que pode ser consistente. Continue assim!"}
              {badge.milestone === 30 && "Um mês inteiro de dedicação. Sua mente agradece!"}
              {badge.milestone === 60 && "Dois meses de transformação. Você é imparável!"}
              {badge.milestone === 90 && "Três meses de excelência. Você é um exemplo para todos!"}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1"
            >
              Continuar
            </Button>
            <Button 
              onClick={onClose} 
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              Compartilhar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeModal;