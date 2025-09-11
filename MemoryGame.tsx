import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameResult } from '@/types/games';
import { cn } from '@/lib/utils';

interface MemoryGameProps {
  level: number;
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

// Gera pares de cartas (emojis) para o jogo da memória
const availableEmojis = ['🍎','🚗','🐶','🌟','🎵','🏠','🌳','📚','💧','🔥','⭐','🍕','🎲','🦋','⚽','🎈'];

const getPairs = (count: number) => {
  const selected = availableEmojis.slice(0, count);
  return [...selected, ...selected].sort(() => Math.random() - 0.5);
};

const MemoryGame: React.FC<MemoryGameProps> = ({ level, onComplete, onExit }) => {
  const [phase, setPhase] = useState<'instructions'|'countdown'|'playing'|'result'>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState(0);

  const pairCount = Math.min(6 + level, 12); // 6-12 pares

  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'countdown' && countdown === 0) {
      setCards(getPairs(pairCount));
      setStartTime(Date.now());
      setPhase('playing');
    }
  }, [phase, countdown, pairCount]);

  useEffect(() => {
    if (phase === 'playing' && matched.length === cards.length) {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000);
      const finalScore = Math.max(10, Math.round(100 - (moves - pairCount) * 5 - timeSpent * 2));
      setScore(finalScore);
      setPhase('result');
      setTimeout(() => {
        onComplete({
          score: finalScore,
          moves,
          time: timeSpent,
          completed: true
        });
      }, 2000);
    }
  }, [phase, matched, cards, moves, pairCount, startTime, level, onComplete]);

  const handleCardClick = (idx: number) => {
    if (flipped.includes(idx) || matched.includes(idx) || flipped.length === 2) return;
    setFlipped([...flipped, idx]);
    if (flipped.length === 1) {
      setMoves(moves + 1);
      const firstIdx = flipped[0];
      if (cards[firstIdx] === cards[idx]) {
        setMatched([...matched, firstIdx, idx]);
        setTimeout(() => setFlipped([]), 800);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  if (phase === 'instructions') {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Button onClick={onExit}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle>Jogo da Memória</CardTitle>
                  <CardDescription>Nível {level}</CardDescription>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Como jogar:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Encontre todos os pares de cartas</li>
                    <li>• Clique para virar duas cartas por vez</li>
                    <li>• Memorize a posição das cartas</li>
                    <li>• Menos movimentos e tempo = maior pontuação</li>
                  </ul>
                </div>
                <Button onClick={() => setPhase('countdown')}>Começar Jogo</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Prepare-se!</h2>
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
        <div className="w-full max-w-md">
          <Card>
            <CardContent>
              <div className="text-center space-y-4">
                <CardTitle>Jogo Concluído!</CardTitle>
                <CardDescription>Parabéns! Sua memória está em ação.</CardDescription>
                <div className="text-4xl font-bold text-primary">{score}%</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Movimentos</p>
                    <p className="font-bold">{moves}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nível</p>
                    <p className="font-bold">{level}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onExit}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <Badge>Nível {level}</Badge>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Encontre os pares</h2>
          <p className="text-muted-foreground">Clique para virar as cartas</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {cards.map((emoji, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                disabled={isFlipped || flipped.length === 2}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-3xl font-bold border-2 transition-all duration-200",
                  isFlipped ? "bg-primary/10 border-primary text-primary" : "bg-muted border-muted-foreground text-muted-foreground",
                  flipped.includes(idx) && "scale-105",
                  matched.includes(idx) && "opacity-60"
                )}
              >
                {isFlipped ? emoji : <Eye className="w-6 h-6" />}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pairCount }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full",
                i < matched.length / 2 ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;