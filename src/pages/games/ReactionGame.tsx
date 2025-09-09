import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Target, Zap, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameResult } from '@/types/games';
import { cn } from '@/lib/utils';

interface ReactionGameProps {
  level: number;
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

interface Target {
  id: string;
  x: number;
  y: number;
  isCorrect: boolean;
  appeared: number;
}

type GamePhase = 'instructions' | 'countdown' | 'playing' | 'result';

const ReactionGame: React.FC<ReactionGameProps> = ({ level, onComplete, onExit }) => {
  const [phase, setPhase] = useState<GamePhase>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [gameTime, setGameTime] = useState(30); // 30 seconds game
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const targetInterval = Math.max(1000 - (level * 100), 300); // Faster targets with higher level
  const targetLifetime = Math.max(2000 - (level * 150), 800); // Shorter lifetime with higher level
  const distractorChance = Math.min(level * 0.1, 0.4); // More distractors with higher level

  useEffect(() => {
    const skipInstructions = localStorage.getItem('skipReactionInstructions') === 'true';
    if (skipInstructions) {
      setShowInstructions(false);
      setPhase('countdown');
    }
  }, []);

  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'countdown' && countdown === 0) {
      startGame();
    }
  }, [phase, countdown]);

  useEffect(() => {
    let gameTimer: NodeJS.Timeout;
    let targetTimer: NodeJS.Timeout;

    if (phase === 'playing') {
      // Game timer
      gameTimer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Target spawner
      const spawnTarget = () => {
        const isCorrect = Math.random() > distractorChance;
        const newTarget: Target = {
          id: `target_${Date.now()}_${Math.random()}`,
          x: Math.random() * 80 + 10, // 10-90% of screen width
          y: Math.random() * 70 + 15, // 15-85% of screen height
          isCorrect,
          appeared: Date.now()
        };

        setTargets(prev => [...prev, newTarget]);
        setTotalTargets(prev => prev + 1);

        // Remove target after lifetime
        setTimeout(() => {
          setTargets(prev => prev.filter(t => t.id !== newTarget.id));
          if (isCorrect) {
            setMisses(prev => prev + 1);
          }
        }, targetLifetime);
      };

      targetTimer = setInterval(spawnTarget, targetInterval);
    }

    return () => {
      clearInterval(gameTimer);
      clearInterval(targetTimer);
    };
  }, [phase, targetInterval, targetLifetime, distractorChance]);

  const startGame = () => {
    setPhase('playing');
    setStartTime(Date.now());
    setTimeRemaining(gameTime);
  };

  const handleTargetClick = (target: Target) => {
    const reactionTime = Date.now() - target.appeared;
    
    setTargets(prev => prev.filter(t => t.id !== target.id));

    if (target.isCorrect) {
      setHits(prev => prev + 1);
      setReactionTimes(prev => [...prev, reactionTime]);
    } else {
      setMisses(prev => prev + 1);
    }
  };

  const endGame = () => {
    const totalCorrectTargets = totalTargets - Math.floor(totalTargets * distractorChance);
    const accuracy = totalCorrectTargets > 0 ? (hits / totalCorrectTargets) * 100 : 0;
    const avgReactionTime = reactionTimes.length > 0 ? 
      reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length : 0;
    
    // Score based on accuracy and speed
    const accuracyScore = accuracy;
    const speedScore = avgReactionTime > 0 ? Math.max(0, 100 - (avgReactionTime / 10)) : 0;
    const finalScore = Math.round((accuracyScore + speedScore) / 2);

    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000);

    const result: GameResult = {
      id: `reaction_${Date.now()}`,
      gameType: 'reaction',
      score: finalScore,
      level,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      stats: {
        correctAnswers: hits,
        totalQuestions: totalCorrectTargets,
        averageReactionTime: avgReactionTime,
        timeSpent
      }
    };

    setScore(finalScore);
    setPhase('result');
    setTimeout(() => onComplete(result), 2000);
  };

  const handleSkipInstructions = (skip: boolean) => {
    if (skip) {
      localStorage.setItem('skipReactionInstructions', 'true');
    }
    setShowInstructions(false);
    setPhase('countdown');
  };

  const getMotivationalMessage = (score: number): string => {
    if (score >= 90) return "Reflexos de ninja! Incrível velocidade!";
    if (score >= 70) return "Ótimos reflexos! Você está rápido.";
    if (score >= 50) return "Bom tempo de reação! Continue praticando.";
    return "Continue treinando, seus reflexos vão melhorar!";
  };

  if (phase === 'instructions') {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onExit}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle>Jogo de Reação</CardTitle>
                <CardDescription>Nível {level}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Como jogar:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Clique nos alvos verdes o mais rápido possível</li>
                <li>• Evite clicar nos alvos vermelhos (distrações)</li>
                <li>• Você tem {gameTime} segundos para jogar</li>
                <li>• Seja rápido e preciso para pontuar bem</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="w-4 h-4 bg-success rounded-full" />
              <span className="text-sm">Alvo correto</span>
              <div className="w-4 h-4 bg-destructive rounded-full ml-4" />
              <span className="text-sm">Distração</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => handleSkipInstructions(false)}>
                Começar Jogo
              </Button>
              <Button variant="outline" onClick={() => handleSkipInstructions(true)}>
                Não mostrar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Prepare seus reflexos!</h2>
          <div className="text-6xl font-bold text-primary animate-pulse">
            {countdown || 'Vai!'}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const avgReactionTime = reactionTimes.length > 0 ? 
      Math.round(reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length) : 0;
    
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Jogo Concluído!</CardTitle>
            <CardDescription>{getMotivationalMessage(score)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-primary">{score}%</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Acertos</p>
                <p className="font-bold">{hits}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Erros</p>
                <p className="font-bold">{misses}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reação Média</p>
                <p className="font-bold">{avgReactionTime}ms</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nível</p>
                <p className="font-bold">{level}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sair
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Zap className="w-3 h-3 mr-1" />
            {hits} acertos
          </Badge>
          <Badge variant="secondary">{timeRemaining}s</Badge>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-4 top-20">
        {targets.map((target) => (
          <button
            key={target.id}
            onClick={() => handleTargetClick(target)}
            className={cn(
              "absolute w-12 h-12 rounded-full flex items-center justify-center",
              "transform transition-all duration-200 hover:scale-110 active:scale-95",
              "animate-pulse",
              target.isCorrect 
                ? "bg-success text-white shadow-lg shadow-success/50" 
                : "bg-destructive text-white shadow-lg shadow-destructive/50"
            )}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
            }}
          >
            {target.isCorrect ? <Target className="w-6 h-6" /> : <X className="w-6 h-6" />}
          </button>
        ))}
      </div>

      {/* Game Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center relative z-10">
        <p className="text-muted-foreground text-sm">
          Clique nos alvos verdes, evite os vermelhos
        </p>
      </div>
    </div>
  );
};

export default ReactionGame;