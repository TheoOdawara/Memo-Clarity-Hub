import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameResult } from '@/types/games';
import { cn } from '@/lib/utils';

interface SequenceGameProps {
  level: number;
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

const colors = [
  { id: 'red', name: 'Vermelho', bg: 'bg-red-500', active: 'bg-red-600' },
  { id: 'blue', name: 'Azul', bg: 'bg-blue-500', active: 'bg-blue-600' },
  { id: 'green', name: 'Verde', bg: 'bg-green-500', active: 'bg-green-600' },
  { id: 'yellow', name: 'Amarelo', bg: 'bg-yellow-500', active: 'bg-yellow-600' },
  { id: 'purple', name: 'Roxo', bg: 'bg-purple-500', active: 'bg-purple-600' },
  { id: 'orange', name: 'Laranja', bg: 'bg-orange-500', active: 'bg-orange-600' },
];

type GamePhase = 'instructions' | 'countdown' | 'showing' | 'input' | 'result';

const SequenceGame: React.FC<SequenceGameProps> = ({ level, onComplete, onExit }) => {
  const [phase, setPhase] = useState<GamePhase>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [startTime, setStartTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const sequenceLength = Math.min(3 + level, 8); // 3-8 elements based on level

  useEffect(() => {
    const skipInstructions = localStorage.getItem('skipSequenceInstructions') === 'true';
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
      startNewRound();
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (phase === 'showing' && currentIndex < sequence.length) {
      const timer = setTimeout(() => {
        setActiveColor(sequence[currentIndex]);
        setTimeout(() => {
          setActiveColor(null);
          setCurrentIndex(currentIndex + 1);
        }, 600);
      }, 400);
      return () => clearTimeout(timer);
    } else if (phase === 'showing' && currentIndex >= sequence.length) {
      setTimeout(() => {
        setPhase('input');
        setCurrentIndex(0);
      }, 800);
    }
  }, [phase, currentIndex, sequence]);

  const generateSequence = () => {
    const newSequence: string[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      newSequence.push(randomColor.id);
    }
    return newSequence;
  };

  const startNewRound = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentIndex(0);
    setPhase('showing');
    if (round === 1) setStartTime(Date.now());
  };

  const handleColorClick = (colorId: string) => {
    if (phase !== 'input') return;

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    const isCorrect = sequence[userSequence.length] === colorId;

    if (newUserSequence.length === sequence.length) {
      // Round complete
      const allCorrect = newUserSequence.every((color, index) => color === sequence[index]);
      if (allCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }

      if (round < totalRounds) {
        setRound(round + 1);
        setTimeout(() => {
          setPhase('countdown');
          setCountdown(3);
        }, 1000);
      } else {
        // Game complete
        completeGame();
      }
    } else if (!isCorrect) {
      // Wrong answer - end round
      if (round < totalRounds) {
        setRound(round + 1);
        setTimeout(() => {
          setPhase('countdown');
          setCountdown(3);
        }, 1000);
      } else {
        completeGame();
      }
    }
  };

  const completeGame = () => {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000);
    const finalScore = Math.round((correctAnswers / totalRounds) * 100);

    const result: GameResult = {
      id: `sequence_${Date.now()}`,
      gameType: 'sequence',
      score: finalScore,
      level,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      stats: {
        correctAnswers,
        totalQuestions: totalRounds,
        timeSpent
      }
    };

    setScore(finalScore);
    setPhase('result');
    setTimeout(() => onComplete(result), 2000);
  };

  const handleSkipInstructions = (skip: boolean) => {
    if (skip) {
      localStorage.setItem('skipSequenceInstructions', 'true');
    }
    setShowInstructions(false);
    setPhase('countdown');
  };

  const getMotivationalMessage = (score: number): string => {
    if (score >= 90) return "Sua memória está excepcional!";
    if (score >= 70) return "Ótima performance! Continue treinando.";
    if (score >= 50) return "Bom trabalho! Sua memória está melhorando.";
    return "Continue praticando, sua memória vai fortalecer!";
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
                <CardTitle>Jogo de Sequência</CardTitle>
                <CardDescription>Nível {level}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Como jogar:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Memorize a sequência de cores que aparecer</li>
                <li>• Repita a sequência na mesma ordem</li>
                <li>• A sequência tem {sequenceLength} cores</li>
                <li>• Você jogará {totalRounds} rodadas</li>
              </ul>
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
          <h2 className="text-2xl font-bold mb-4">Rodada {round}/{totalRounds}</h2>
          <div className="text-6xl font-bold text-primary animate-pulse">
            {countdown || 'Vai!'}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
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
                <p className="font-bold">{correctAnswers}/{totalRounds}</p>
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Rodada {round}/{totalRounds}</Badge>
            <Badge variant="secondary">Nível {level}</Badge>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          {phase === 'showing' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Memorize a sequência</h2>
              <p className="text-muted-foreground">
                {currentIndex + 1} / {sequence.length}
              </p>
            </div>
          )}
          {phase === 'input' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Repita a sequência</h2>
              <p className="text-muted-foreground">
                {userSequence.length} / {sequence.length}
              </p>
            </div>
          )}
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-3 gap-4">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorClick(color.id)}
              disabled={phase !== 'input'}
              className={cn(
                "aspect-square rounded-lg transition-all duration-200 border-2 border-transparent",
                color.bg,
                activeColor === color.id ? color.active : '',
                phase === 'input' ? 'hover:scale-105 active:scale-95' : '',
                phase !== 'input' && 'cursor-not-allowed opacity-60'
              )}
            />
          ))}
        </div>

        {/* Progress indicator */}
        {phase === 'input' && (
          <div className="mt-6 flex justify-center gap-2">
            {sequence.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full",
                  index < userSequence.length ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SequenceGame;