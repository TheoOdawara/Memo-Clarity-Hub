import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppContext } from '@/context/AppContext';
import { moderateContent } from '@/utils/moderation';
import { toast } from '@/hooks/use-toast';

interface TestimonyModalProps {
  onClose: () => void;
  currentDay: number;
}

const TestimonyModal: React.FC<TestimonyModalProps> = ({ onClose, currentDay }) => {
  const { userData, saveTestimony } = useAppContext();
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState('');
  
  const isMilestone = [7, 30, 60, 90].includes(currentDay);
  const charLimit = 280;
  const remainingChars = charLimit - content.length;

  const handleSubmit = async () => {
    if (content.trim().length < 10) {
      setModerationError('Depoimento muito curto. Mínimo 10 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setModerationError('');

    // Content moderation
    const moderationResult = moderateContent(content.trim());
    
    if (!moderationResult.approved) {
      setModerationError(moderationResult.reason || 'Conteúdo não aprovado.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Save testimony
      const testimony = {
        id: `testimony_${Date.now()}`,
        userId: userData.email || 'anonymous',
        username: userData.username || `Usuario${Math.floor(Math.random() * 999)}`,
        avatar: userData.avatar || '👤',
        content: content.trim(),
        dayNumber: currentDay,
        milestone: isMilestone ? currentDay : undefined,
        likes: 0,
        likedBy: [],
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        isPublic
      };

      if (saveTestimony) {
        saveTestimony(testimony);
      }

      toast({
        title: "Depoimento salvo!",
        description: isPublic 
          ? "Seu depoimento foi compartilhado com a comunidade." 
          : "Seu depoimento foi salvo de forma privada.",
      });

      onClose();
    } catch (error) {
      setModerationError('Erro ao salvar depoimento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Compartilhe sua experiência
                {isMilestone && <Badge variant="secondary">🎯 Marco {currentDay} dias</Badge>}
              </CardTitle>
              <CardDescription>
                {isMilestone 
                  ? `Parabéns pelos ${currentDay} dias! Como tem sido sua jornada?`
                  : "Como está sendo sua experiência com o Memo Clarity?"
                }
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isMilestone && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Este é um marco especial! Seu depoimento pode inspirar outros usuários.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="testimony">Seu depoimento</Label>
            <Textarea
              id="testimony"
              placeholder="Compartilhe como o Memo Clarity tem ajudado você..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              maxLength={charLimit}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Dia {currentDay} da sua jornada</span>
              <span className={remainingChars < 20 ? 'text-destructive' : ''}>
                {remainingChars} caracteres restantes
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public" className="text-sm">
                Compartilhar publicamente
              </Label>
            </div>
            {!isPublic && (
              <Badge variant="outline" className="text-xs">Privado</Badge>
            )}
          </div>

          {moderationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{moderationError}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || content.trim().length < 10}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Enviando...' : 'Compartilhar'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Os depoimentos passam por moderação automática para manter a comunidade segura.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonyModal;