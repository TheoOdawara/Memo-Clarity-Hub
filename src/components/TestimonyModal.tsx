import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageSquare, Globe, Lock } from 'lucide-react';

interface TestimonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testimony: string, isPublic: boolean) => void;
}

const TestimonyModal: React.FC<TestimonyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [testimony, setTestimony] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = () => {
    if (testimony.trim()) {
      onSubmit(testimony.trim(), isPublic);
    }
    handleSkip();
  };

  const handleSkip = () => {
    setTestimony('');
    setIsPublic(false);
    onClose();
  };

  const placeholder = "Ex: Me sinto mais focado hoje! A memória está mais nítida...";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Quer deixar um depoimento?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testimony">Em uma frase, como você se sente hoje?</Label>
            <Textarea
              id="testimony"
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              placeholder={placeholder}
              rows={3}
              maxLength={200}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Opcional</span>
              <span>{testimony.length}/200</span>
            </div>
          </div>
          
          {testimony.trim() && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <Globe className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="public-switch" className="font-medium">
                    {isPublic ? 'Publicar no ranking' : 'Manter privado'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isPublic ? 'Outros usuários poderão ver' : 'Apenas para você'}
                  </p>
                </div>
              </div>
              <Switch
                id="public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={handleSkip}
              variant="outline" 
              className="flex-1"
            >
              Pular
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!testimony.trim()}
              className="flex-1 bg-success hover:bg-success/90"
            >
              {testimony.trim() ? (isPublic ? 'Publicar' : 'Salvar') : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonyModal;