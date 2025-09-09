import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Shuffle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameResult } from '@/types/games';
import { cn } from '@/lib/utils';

interface AssociationGameProps {
  level: number;
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

interface WordImagePair {
  id: string;
  word: string;
  emoji: string;
}

const availablePairs: WordImagePair[] = [
  { id: 'sun', word: 'Sol', emoji: '☀️' },
  { id: 'moon', word: 'Lua', emoji: '🌙' },
  { id: 'tree', word: 'Árvore', emoji: '🌳' },
  { id: 'car', word: 'Carro', emoji: '🚗' },
  { id: 'house', word: 'Casa', emoji: '🏠' },
  { id: 'cat', word: 'Gato', emoji: '🐱' },
  { id: 'dog', word: 'Cachorro', emoji: '🐶' },
  { id: 'book', word: 'Livro', emoji: '📚' },
  { id: 'phone', word: 'Telefone', emoji: '📱' },
  { id: 'heart', word: 'Coração', emoji: '❤️' },
  { id: 'star', word: 'Estrela', emoji: '⭐' },
  { id: 'fire', word: 'Fogo', emoji: '🔥' },
  { id: 'water', word: 'Água', emoji: '💧' },
  { id: 'flower', word: 'Flor', emoji: '🌸' },
  { id: 'music', word: 'Música', emoji: '🎵' },
  { id: 'food', word: 'Comida', emoji: '🍕' },
];

type GamePhase = 'instructions' | 'countdown' | 'memorize' | 'match' | 'result';

const AssociationGame: React.FC<AssociationGameProps> = ({ level, onComplete, onExit }) => {
  const [phase, setPhase] = useState<GamePhase>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [gamePairs, setGamePairs] = useState<WordImagePair[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [shuffledEmojis, setShuffledEmojis] = useState<string[]>([]);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [memorizeTime, setMemorizeTime] = useState(5); // seconds to memorize

  const pairCount = Math.min(6 + Math.floor(level / 2), 12); // 6-12 pairs based on level

  useEffect(() => {
    const skipInstructions = localStorage.getItem('skipAssociationInstructions') === 'true';
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
      initializeGame();
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (phase === 'memorize' && memorizeTime > 0) {
      const timer = setTimeout(() => setMemorizeTime(memorizeTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'memorize' && memorizeTime === 0) {
      startMatchingPhase();
    }
  }, [phase, memorizeTime]);

  const initializeGame = () => {
    // Select random pairs
    const shuffledPairs = [...availablePairs].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledPairs.slice(0, pairCount);
    
    setGamePairs(selectedPairs);
    setTotalMatches(selectedPairs.length);
    setStartTime(Date.now());
    setPhase('memorize');
  };

  const startMatchingPhase = () => {
    // Shuffle words and emojis separately
    const words = gamePairs.map(pair => pair.word).sort(() => Math.random() - 0.5);
    const emojis = gamePairs.map(pair => pair.emoji).sort(() => Math.random() - 0.5);
    
    setShuffledWords(words);
    setShuffledEmojis(emojis);
    setPhase('match');
  };

  const handleWordClick = (word: string) => {
    if (matches[word]) return; // Already matched
    setSelectedWord(selectedWord === word ? null : word);
  };

  const handleEmojiClick = (emoji: string) => {
    if (Object.values(matches).includes(emoji)) return; // Already matched
    setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
  };

  useEffect(() => {
    if (selectedWord && selectedEmoji) {
      // Check if it's a correct match
      const pair = gamePairs.find(p => p.word === selectedWord && p.emoji === selectedEmoji);
      
      if (pair) {
        // Correct match
        setMatches(prev => ({ ...prev, [selectedWord]: selectedEmoji }));
        setCorrectMatches(correctMatches + 1);
        
        if (correctMatches + 1 === totalMatches) {
          // Game complete
          completeGame();
        }
      }
      
      // Reset selections
      setSelectedWord(null);
      setSelectedEmoji(null);
    }
  }, [selectedWord, selectedEmoji]);

  const completeGame = () => {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000);
    const finalScore = Math.round((correctMatches / totalMatches) * 100);

    const result: GameResult = {
      id: `association_${Date.now()}`,
      gameType: 'association',
      score: finalScore,
      level,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      stats: {
        correctAnswers: correctMatches,
        totalQuestions: totalMatches,
        timeSpent
      }
    };

    setPhase('result');
    setTimeout(() => onComplete(result), 2000);
  };

  const handleSkipInstructions = (skip: boolean) => {
    if (skip) {
      localStorage.setItem('skipAssociationInstructions', 'true');
    }
    setShowInstructions(false);
    setPhase('countdown');
  };

  const getMotivationalMessage = (score: number): string => {
    if (score >= 90) return "Sua memória associativa é excelente!";
    if (score >= 70) return "Ótimas conexões! Continue assim.";
    if (score >= 50) return "Bom trabalho! Suas associações estão melhorando.";
    return "Continue praticando, sua memória vai se fortalecer!";
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
                <CardTitle>Jogo de Associação</CardTitle>
                <CardDescription>Nível {level}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Como jogar:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Memorize os pares palavra-emoji por {memorizeTime} segundos</li>
                <li>• Depois conecte as palavras aos emojis corretos</li>
                <li>• Você terá {pairCount} pares para conectar</li>
                <li>• Clique na palavra e depois no emoji correspondente</li>
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
          <h2 className="text-2xl font-bold mb-4">Prepare-se!</h2>
          <div className="text-6xl font-bold text-primary animate-pulse">
            {countdown || 'Vai!'}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'memorize') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={onExit}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <Badge variant="secondary">Nível {level}</Badge>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Memorize os pares</h2>
            <div className="text-3xl font-bold text-primary">{memorizeTime}s</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gamePairs.map((pair) => (
              <Card key={pair.id} className="p-4 text-center">
                <div className="text-3xl mb-2">{pair.emoji}</div>
                <div className="font-semibold">{pair.word}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const finalScore = Math.round((correctMatches / totalMatches) * 100);
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Jogo Concluído!</CardTitle>
            <CardDescription>{getMotivationalMessage(finalScore)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-primary">{finalScore}%</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Acertos</p>
                <p className="font-bold">{correctMatches}/{totalMatches}</p>
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
            <Badge variant="outline">{correctMatches}/{totalMatches}</Badge>
            <Badge variant="secondary">Nível {level}</Badge>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Conecte os pares</h2>
          <p className="text-muted-foreground">Clique na palavra e depois no emoji</p>
        </div>

        {/* Words */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Palavras:</h3>
          <div className="grid grid-cols-2 gap-2">
            {shuffledWords.map((word) => (
              <Button
                key={word}
                variant={selectedWord === word ? "default" : matches[word] ? "secondary" : "outline"}
                onClick={() => handleWordClick(word)}
                disabled={!!matches[word]}
                className={cn("h-12", matches[word] && "opacity-50")}
              >
                {word}
              </Button>
            ))}
          </div>
        </div>

        {/* Emojis */}
        <div>
          <h3 className="font-semibold mb-3">Emojis:</h3>
          <div className="grid grid-cols-4 gap-2">
            {shuffledEmojis.map((emoji) => {
              const isMatched = Object.values(matches).includes(emoji);
              return (
                <Button
                  key={emoji}
                  variant={selectedEmoji === emoji ? "default" : isMatched ? "secondary" : "outline"}
                  onClick={() => handleEmojiClick(emoji)}
                  disabled={isMatched}
                  className={cn("h-12 text-2xl", isMatched && "opacity-50")}
                >
                  {emoji}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 flex justify-center gap-1">
          {Array.from({ length: totalMatches }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full",
                index < correctMatches ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssociationGame;