import React, { useState, useEffect } from 'react';
import { Users, Trophy, Heart, Medal, Crown, Star, TrendingUp, MessageSquare, Award, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppContext } from '@/context/AppContext';
import { RankingUser, Testimony, UserProfile } from '@/types/community';
import TestimonyModal from './TestimonyModal';
import { cn } from '@/lib/utils';

// Mock data - in a real app, this would come from an API
const generateMockRankings = (): { streakRanking: RankingUser[], scoreRanking: RankingUser[] } => {
  const names = [
    'Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Pedro', 'Fernanda Costa',
    'Roberto Lima', 'Juliana Souza', 'Miguel Ferreira', 'Beatriz Alves', 'Pedro Martins',
    'Larissa Pereira', 'Ricardo Barbosa', 'Camila Rodrigues', 'Lucas Mendes', 'Isabela Carvalho',
    'Diego Nascimento', 'Letícia Araújo', 'Rafael Torres', 'Amanda Ribeiro', 'Thiago Gonçalves'
  ];
  
  const streakRanking = names.map((name, index) => ({
    id: `user_${index}`,
    username: name.split(' ')[0] + Math.floor(Math.random() * 99),
    avatar: `👤`,
    currentStreak: Math.max(150 - index * 7 - Math.floor(Math.random() * 10), 1),
    cognitiveScore: Math.floor(Math.random() * 40) + 60,
    position: index + 1,
    badge: index < 3 ? (index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze') : undefined
  }));
  
  const scoreRanking = [...streakRanking]
    .sort((a, b) => b.cognitiveScore - a.cognitiveScore)
    .map((user, index) => ({
      ...user,
      position: index + 1,
      badge: index < 3 ? (index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze') : undefined
    }));
  
  return { streakRanking, scoreRanking };
};

const generateMockTestimonies = (): Testimony[] => {
  const testimonies = [
    { content: "Incrível como minha concentração melhorou em apenas uma semana!", dayNumber: 7, milestone: 7 },
    { content: "30 dias de consistência e já sinto diferença na memória.", dayNumber: 30, milestone: 30 },
    { content: "Os jogos cognitivos são viciantes, no bom sentido!", dayNumber: 15 },
    { content: "As frequências sonoras realmente me ajudam a focar no trabalho.", dayNumber: 45 },
    { content: "90 dias! Minha mente nunca esteve tão afiada.", dayNumber: 90, milestone: 90 },
    { content: "Comecei cético, mas os resultados falam por si.", dayNumber: 21 },
    { content: "O score cognitivo subindo me motiva ainda mais!", dayNumber: 60, milestone: 60 },
    { content: "Amo fazer o check-in diário, virou parte da rotina.", dayNumber: 12 }
  ];
  
  const mockNames = ['Ana67', 'Carlos23', 'Maria89', 'João45', 'Fernanda12', 'Roberto78', 'Juliana34', 'Miguel91'];
  
  return testimonies.map((testimony, index) => ({
    id: `testimony_${index}`,
    userId: `user_${index}`,
    username: mockNames[index],
    avatar: '👤',
    content: testimony.content,
    dayNumber: testimony.dayNumber,
    milestone: testimony.milestone,
    likes: Math.floor(Math.random() * 20) + 5,
    likedBy: [],
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    isPublic: true
  }));
};

const getBadgeIcon = (badge?: string) => {
  switch (badge) {
    case 'gold': return <Crown className="w-4 h-4 text-yellow-500" />;
    case 'silver': return <Medal className="w-4 h-4 text-gray-400" />;
    case 'bronze': return <Award className="w-4 h-4 text-amber-600" />;
    default: return null;
  }
};

const getScoreBadge = (score: number) => {
  if (score >= 90) return { label: 'Gênio', color: 'bg-purple-500' };
  if (score >= 80) return { label: 'Expert', color: 'bg-blue-500' };
  if (score >= 70) return { label: 'Avançado', color: 'bg-green-500' };
  if (score >= 60) return { label: 'Intermediário', color: 'bg-yellow-500' };
  return { label: 'Iniciante', color: 'bg-gray-500' };
};

const Community: React.FC = () => {
  const { userData } = useAppContext();
  const [showTestimonyModal, setShowTestimonyModal] = useState(false);
  const [likedTestimonies, setLikedTestimonies] = useState<Set<string>>(new Set());
  
  // Mock data - replace with real API calls
  const [rankings, setRankings] = useState(() => generateMockRankings());
  const [testimonies, setTestimonies] = useState(() => generateMockTestimonies());
  
  // User's position in rankings (mock)
  const userPosition = {
    streak: Math.floor(Math.random() * 50) + 10,
    score: Math.floor(Math.random() * 30) + 15
  };

  const handleLikeTestimony = (testimonyId: string) => {
    setLikedTestimonies(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(testimonyId)) {
        newLiked.delete(testimonyId);
      } else {
        newLiked.add(testimonyId);
      }
      return newLiked;
    });
    
    // Update testimony likes count
    setTestimonies(prev => prev.map(t => 
      t.id === testimonyId 
        ? { ...t, likes: t.likes + (likedTestimonies.has(testimonyId) ? -1 : 1) }
        : t
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Comunidade</h1>
          <p className="text-muted-foreground">Conecte-se com outros usuários em sua jornada</p>
        </div>
      </div>

      <Tabs defaultValue="testimonies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="testimonies">Depoimentos</TabsTrigger>
          <TabsTrigger value="streak">Ranking Consistência</TabsTrigger>
          <TabsTrigger value="score">Ranking Score</TabsTrigger>
        </TabsList>
        
        <TabsContent value="testimonies" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Depoimentos da Comunidade</h2>
            <Button onClick={() => setShowTestimonyModal(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
          
          <div className="space-y-4">
            {testimonies.map((testimony) => (
              <Card key={testimony.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{testimony.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">{testimony.username}</span>
                        <Badge variant="outline" className="text-xs">
                          Dia {testimony.dayNumber}
                        </Badge>
                        {testimony.milestone && (
                          <Badge variant="secondary" className="text-xs">
                            🎯 {testimony.milestone} dias
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground mb-3">{testimony.content}</p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeTestimony(testimony.id)}
                          className={cn(
                            "flex items-center gap-1 h-8",
                            likedTestimonies.has(testimony.id) && "text-red-500"
                          )}
                        >
                          <Heart className={cn(
                            "w-4 h-4",
                            likedTestimonies.has(testimony.id) && "fill-current"
                          )} />
                          <span className="text-xs">{testimony.likes}</span>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {new Date(testimony.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="streak" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ranking de Consistência</h2>
            <Badge variant="outline">Sua posição: #{userPosition.streak}</Badge>
          </div>
          
          <div className="space-y-2">
            {rankings.streakRanking.slice(0, 20).map((user) => (
              <Card key={user.id} className={cn(
                "hover:shadow-md transition-all duration-200",
                user.position <= 3 && "border-primary/20 bg-primary/5"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-[3rem]">
                      <span className="font-bold text-lg">#{user.position}</span>
                      {getBadgeIcon(user.badge)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Score: {user.cognitiveScore}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        {user.currentStreak}
                      </p>
                      <p className="text-sm text-muted-foreground">dias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="score" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ranking de Score Cognitivo</h2>
            <Badge variant="outline">Sua posição: #{userPosition.score}</Badge>
          </div>
          
          <div className="space-y-2">
            {rankings.scoreRanking.slice(0, 20).map((user) => {
              const scoreBadge = getScoreBadge(user.cognitiveScore);
              return (
                <Card key={user.id} className={cn(
                  "hover:shadow-md transition-all duration-200",
                  user.position <= 3 && "border-primary/20 bg-primary/5"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 min-w-[3rem]">
                        <span className="font-bold text-lg">#{user.position}</span>
                        {getBadgeIcon(user.badge)}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Streak: {user.currentStreak} dias
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <Badge 
                          className={cn("text-white", scoreBadge.color)}
                        >
                          {scoreBadge.label}
                        </Badge>
                        <p className="font-bold text-lg text-primary">
                          {user.cognitiveScore}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
      
      {showTestimonyModal && (
        <TestimonyModal
          onClose={() => setShowTestimonyModal(false)}
          currentDay={userData.currentStreak}
        />
      )}
    </div>
  );
};

export default Community;