import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Clock, Headphones } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/AppContext';
import { createTicketAction } from '@/utils/ticketSystem';
import { cn } from '@/lib/utils';

interface Frequency {
  id: string;
  category: string;
  title: string;
  description: string;
  durations: number[];
  audioUrl: string;
  color: string;
}

const frequencies: Frequency[] = [
  {
    id: 'focus_40hz',
    category: 'foco',
    title: 'Frequência do Gênio',
    description: '40 Hz para concentração máxima',
    durations: [10, 15, 20, 30],
    audioUrl: 'https://www.soundjay.com/misc/sounds/beep-28.wav', // placeholder
    color: '#FF6B6B'
  },
  {
    id: 'memory_alpha',
    category: 'memória', 
    title: 'Memória Alpha',
    description: '8-10 Hz para consolidação',
    durations: [15, 20, 30, 45],
    audioUrl: 'https://www.soundjay.com/misc/sounds/beep-28.wav', // placeholder
    color: '#4ECDC4'
  },
  {
    id: 'sleep_theta',
    category: 'sono',
    title: 'Sono Reparador', 
    description: '4-7 Hz para relaxamento profundo',
    durations: [20, 30, 45, 60],
    audioUrl: 'https://www.soundjay.com/misc/sounds/beep-28.wav', // placeholder
    color: '#45B7D1'
  }
];

const categoryColors = {
  foco: 'bg-red-500/10 text-red-600 border-red-200',
  memória: 'bg-teal-500/10 text-teal-600 border-teal-200', 
  sono: 'bg-blue-500/10 text-blue-600 border-blue-200'
};

const Frequencies: React.FC = () => {
  const { updateUserData, userData, awardTickets } = useAppContext();
  const [activeFrequency, setActiveFrequency] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying && selectedDuration > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedDuration * 60) {
            handleStop();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, selectedDuration]);

  const handlePlay = (frequency: Frequency, duration: number) => {
    if (activeFrequency === frequency.id && selectedDuration === duration && isPlaying) {
      handlePause();
      return;
    }

    setActiveFrequency(frequency.id);
    setSelectedDuration(duration);
    setCurrentTime(0);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      audioRef.current.play().catch(console.error);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Award ticket and update weekly frequency minutes
    if (selectedDuration > 0) {
      const ticketAction = createTicketAction('frequency', `Frequência ${frequencies.find(f => f.id === activeFrequency)?.title || 'sonora'} - ${selectedDuration}min`);
      awardTickets(ticketAction);
      
      updateUserData({
        weeklyFrequencyMinutes: userData.weeklyFrequencyMinutes + selectedDuration
      });
    }

    setActiveFrequency(null);
    setSelectedDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (selectedDuration === 0) return 0;
    return (currentTime / (selectedDuration * 60)) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Frequências Sonoras</h1>
          <p className="text-muted-foreground">Otimize sua mente com frequências binaurais</p>
        </div>
      </div>

      {/* Active Session */}
      {activeFrequency && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Sessão Ativa</h3>
                <p className="text-sm text-muted-foreground">
                  {frequencies.find(f => f.id === activeFrequency)?.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPlaying ? handlePause : () => {
                    const freq = frequencies.find(f => f.id === activeFrequency);
                    if (freq) handlePlay(freq, selectedDuration);
                  }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleStop}>
                  Parar
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Progress value={getProgress()} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(selectedDuration * 60)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frequencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frequencies.map((frequency) => (
          <Card key={frequency.id} className="group hover:shadow-elevated transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: frequency.color }}
                />
                <Badge variant="outline" className={categoryColors[frequency.category as keyof typeof categoryColors]}>
                  {frequency.category}
                </Badge>
              </div>
              <CardTitle className="text-lg">{frequency.title}</CardTitle>
              <CardDescription>{frequency.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Durações disponíveis
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {frequency.durations.map((duration) => (
                    <Button
                      key={duration}
                      variant={
                        activeFrequency === frequency.id && selectedDuration === duration
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handlePlay(frequency, duration)}
                      className="flex items-center justify-center gap-1"
                    >
                      {activeFrequency === frequency.id && selectedDuration === duration && isPlaying ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      {duration}min
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Volume Control */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume;
                  }
                }}
                className="w-full"
              />
            </div>
            <span className="text-sm text-muted-foreground min-w-[3ch]">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata">
        <source src={frequencies.find(f => f.id === activeFrequency)?.audioUrl} />
      </audio>
    </div>
  );
};

export default Frequencies;