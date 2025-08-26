import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Zap, CheckCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const CheckIn: React.FC = () => {
  const { userData, completeDailyCheckIn } = useAppContext();
  const [mood, setMood] = useState([7]);
  const [energy, setEnergy] = useState([6]);
  const [focus, setFocus] = useState([8]);
  const [submitted, setSubmitted] = useState(userData.dailyCheckInComplete);

  const handleSubmit = () => {
    completeDailyCheckIn();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Check-in Completo!</h2>
          <p className="text-muted-foreground">Obrigado por compartilhar como você está se sentindo hoje.</p>
          
          <Card className="mt-6 shadow-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">+5</div>
                <p className="text-sm text-muted-foreground">Pontos adicionados ao seu Score de Cognição</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Check-in Diário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">Como você está se sentindo hoje? Suas respostas nos ajudam a personalizar sua experiência.</p>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">Humor</label>
                <Badge variant="outline">{mood[0]}/10</Badge>
              </div>
              <Slider
                value={mood}
                onValueChange={setMood}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muito baixo</span>
                <span>Excelente</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Energia
                </label>
                <Badge variant="outline">{energy[0]}/10</Badge>
              </div>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Sem energia</span>
                <span>Muito energético</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Foco Mental
                </label>
                <Badge variant="outline">{focus[0]}/10</Badge>
              </div>
              <Slider
                value={focus}
                onValueChange={setFocus}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muito disperso</span>
                <span>Super focado</span>
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-success hover:bg-success/90">
            Enviar Check-in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckIn;