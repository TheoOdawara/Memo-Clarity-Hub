import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Clock, Target, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import brainLogo from '@/assets/brain-logo.png';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { updateUserData, completeOnboarding } = useAppContext();
  const [formData, setFormData] = useState({
    timezone: '',
    reminderTime: '',
    goal: '',
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      updateUserData(formData);
      completeOnboarding();
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex justify-center mb-8">
              <img 
                src={brainLogo} 
                alt="Memo Clarity" 
                className="w-24 h-24 animate-pulse-soft"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-primary">Memo Clarity</h1>
              <h2 className="text-xl font-semibold text-foreground">Sua jornada de transformação cerebral</h2>
              <p className="text-muted-foreground">Acompanhe seu progresso e maximize os resultados do seu tratamento</p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <Clock className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Quando você prefere tomar seu Memo Clarity?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select onValueChange={(value) => handleSelectChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america/sao_paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="america/rio_branco">Rio Branco (GMT-5)</SelectItem>
                    <SelectItem value="america/manaus">Manaus (GMT-4)</SelectItem>
                    <SelectItem value="america/fortaleza">Fortaleza (GMT-3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminderTime">Horário do Lembrete</Label>
                <Select onValueChange={(value) => handleSelectChange('reminderTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 text-secondary mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Qual sua meta pessoal?</h2>
            </div>
            
            <RadioGroup onValueChange={(value) => handleSelectChange('goal', value)}>
              <div className="space-y-3">
                <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <RadioGroupItem value="consistency" />
                  <span>Manter consistência por 30 dias</span>
                </Label>
                <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <RadioGroupItem value="memory" />
                  <span>Melhorar memória e foco</span>
                </Label>
                <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <RadioGroupItem value="score" />
                  <span>Atingir score cognitivo 80+</span>
                </Label>
                <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <RadioGroupItem value="custom" />
                  <span>Personalizar depois</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <Brain className="w-16 h-16 text-primary animate-pulse-soft" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Score de Cognição</h2>
              <p className="text-muted-foreground">
                Seu Score de Cognição (0-100) combina: dias consecutivos + jogos + frequências sonoras
              </p>
              <div className="bg-gradient-brain text-white p-6 rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Pronto para começar sua jornada!</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 0: return 'Começar';
      case 1: return 'Continuar';
      case 2: return 'Definir Meta';
      case 3: return 'Primeiro Check-in';
      default: return 'Próximo';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.timezone && formData.reminderTime;
      case 2: return formData.goal;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 shadow-elevated">
          {renderStep()}
          
          <div className="mt-8 space-y-4">
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {getButtonText()}
            </Button>
            
            <div className="flex justify-center space-x-2">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;