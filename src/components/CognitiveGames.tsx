import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Target, Shuffle, Play, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/AppContext';
import { GameConfig, GameResult } from '@/types/games';
import SequenceGame from './games/SequenceGame';
import AssociationGame from './games/AssociationGame';
import ReactionGame from './games/ReactionGame';
import { cn } from '@/lib/utils';

const gameConfigs: GameConfig[] = [
  {
    type: 'sequence',
    title: 'Jogo de Sequência',
    description: 'Teste sua memória de curto prazo',
    icon: 'Shuffle',
    color: 'from-blue-500 to-purple-600',
    maxLevel: 10
  },
  {
    type: 'association',
    title: 'Jogo de Associação',
    description: 'Conecte palavras e imagens',
    icon: 'Target',
    color: 'from-green-500 to-teal-600',
    maxLevel: 10
  },
  {
    type: 'reaction',
    title: 'Jogo de Reação',
    description: 'Teste sua velocidade mental',
    icon: 'Trophy',
    color: 'from-red-500 to-pink-600',
    maxLevel: 10
  }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Shuffle': return Shuffle;
    case 'Target': return Target;
    case 'Trophy': return Trophy;
    default: return Brain;
  }
};

const getMotivationalMessage = (score: number): string => {
  if (score >= 90) return "Sua mente está afiada hoje!";
  if (score >= 70) return "Continue assim, você está evoluindo rápido.";
  if (score >= 50) return "Bom esforço! Repita para melhorar ainda mais.";
  return "Não desanime, cada treino fortalece sua mente.";
};

const CognitiveGames: React.FC = () => {
  const { userData, updateUserData, saveGameResult } = useAppContext();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameOfTheDay, setGameOfTheDay] = useState<string>('');

  useEffect(() => {
    // Set game of the day based on date rotation
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const gameIndex = dayOfYear % gameConfigs.length;
    setGameOfTheDay(gameConfigs[gameIndex].type);
  }, []);

  const getAverageScore = () => {
    if (!userData.gameResults || userData.gameResults.length === 0) return 0;
    const recentGames = userData.gameResults.slice(-10);
    const average = recentGames.reduce((sum, game) => sum + game.score, 0) / recentGames.length;
    return Math.round(average);
  };

  const getGameLevel = (gameType: string) => {
    if (!userData.gameLevels) return 1;
    return userData.gameLevels[gameType] || 1;
  };

  const handleGameComplete = (result: GameResult) => {
    // Save game result
    saveGameResult(result);
    
    // Update game level based on performance
    const currentLevel = getGameLevel(result.gameType);
    let newLevel = currentLevel;
    
    if (result.score >= 80 && currentLevel < 10) {
      newLevel = currentLevel + 1;
    } else if (result.score < 40 && currentLevel > 1) {
      newLevel = currentLevel - 1;
    }
    
    updateUserData({
      gameLevels: {
        ...userData.gameLevels,
        [result.gameType]: newLevel
      }
    });

    setSelectedGame(null);
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;
    
    const level = getGameLevel(selectedGame);
    
    switch (selectedGame) {
      case 'sequence':
        return <SequenceGame level={level} onComplete={handleGameComplete} onExit={() => setSelectedGame(null)} />;
      case 'association':
        return <AssociationGame level={level} onComplete={handleGameComplete} onExit={() => setSelectedGame(null)} />;
      case 'reaction':
        return <ReactionGame level={level} onComplete={handleGameComplete} onExit={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return renderGameComponent();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Jogos Cognitivos</h1>
          <p className="text-muted-foreground">Exercite sua mente com jogos divertidos</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">{getAverageScore()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jogos Jogados</p>
                <p className="text-2xl font-bold">{userData.gameResults?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nível Médio</p>
                <p className="text-2xl font-bold">
                  {userData.gameLevels ? 
                    Math.round(Object.values(userData.gameLevels).reduce((sum: number, level: number) => sum + level, 0) / Object.keys(userData.gameLevels).length) || 1
                    : 1
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game of the Day */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Jogo do Dia
              </CardTitle>
              <CardDescription>Recomendação especial para hoje</CardDescription>
            </div>
            <Badge variant="secondary">Destaque</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {gameConfigs.map((game) => {
            if (game.type !== gameOfTheDay) return null;
            
            const IconComponent = getIconComponent(game.icon);
            const level = getGameLevel(game.type);
            
            return (
              <div key={game.type} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br", game.color)}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">Nível {level}</Badge>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setSelectedGame(game.type)}>
                  Jogar Agora
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* All Games */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Todos os Jogos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameConfigs.map((game) => {
            const IconComponent = getIconComponent(game.icon);
            const level = getGameLevel(game.type);
            const recentResults = userData.gameResults?.filter(r => r.gameType === game.type).slice(-5) || [];
            const averageScore = recentResults.length > 0 ? 
              Math.round(recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length) : 0;

            return (
              <Card key={game.type} className="group hover:shadow-elevated transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br", game.color)}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">Nível {level}</Badge>
                  </div>
                  <CardTitle className="text-lg">{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {averageScore > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Performance Recente</span>
                        <span className="font-medium">{averageScore}%</span>
                      </div>
                      <Progress value={averageScore} className="h-2" />
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => setSelectedGame(game.type)}
                    className="w-full"
                    variant={game.type === gameOfTheDay ? "default" : "outline"}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Jogar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Results */}
      {userData.gameResults && userData.gameResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados Recentes</CardTitle>
            <CardDescription>Seus últimos jogos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userData.gameResults.slice(-5).reverse().map((result, index) => {
                const game = gameConfigs.find(g => g.type === result.gameType);
                if (!game) return null;
                
                const IconComponent = getIconComponent(game.icon);
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br", game.color)}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{game.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{result.score}%</p>
                      <p className="text-xs text-muted-foreground">Nível {result.level}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CognitiveGames;