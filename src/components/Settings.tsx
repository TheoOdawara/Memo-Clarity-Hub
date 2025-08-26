import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Download, 
  Trash2, 
  ExternalLink, 
  Star,
  Clock,
  Volume2
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { userSettings, updateUserSettings } = useAppContext();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNotificationToggle = (key: keyof typeof userSettings.notifications, value: boolean) => {
    updateUserSettings({
      notifications: {
        ...userSettings.notifications,
        [key]: value
      }
    });
  };

  const handleDoseReminderTime = (time: string) => {
    updateUserSettings({
      notifications: {
        ...userSettings.notifications,
        doseReminder: {
          ...userSettings.notifications.doseReminder,
          time
        }
      }
    });
  };

  const handlePrivacyToggle = (key: keyof typeof userSettings.privacy, value: boolean) => {
    updateUserSettings({
      privacy: {
        ...userSettings.privacy,
        [key]: value
      }
    });
  };

  const handleGeneralSetting = (key: keyof typeof userSettings.general, value: any) => {
    updateUserSettings({
      general: {
        ...userSettings.general,
        [key]: value
      }
    });
  };

  const handleExportData = () => {
    // Simulate data export
    toast({
      title: "Dados exportados",
      description: "Seus dados foram exportados com sucesso. Verifique seus downloads."
    });
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // Simulate account deletion
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente.",
        variant: "destructive"
      });
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleRateApp = () => {
    window.open('https://play.google.com/store', '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Notifications */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Lembrete da dose</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Receba lembretes diários para tomar sua dose
              </p>
            </div>
            <Switch
              checked={userSettings.notifications.doseReminder.enabled}
              onCheckedChange={(checked) => 
                updateUserSettings({
                  notifications: {
                    ...userSettings.notifications,
                    doseReminder: {
                      ...userSettings.notifications.doseReminder,
                      enabled: checked
                    }
                  }
                })
              }
            />
          </div>

          {userSettings.notifications.doseReminder.enabled && (
            <div className="ml-6">
              <label className="text-sm font-medium">Horário do lembrete</label>
              <Input
                type="time"
                value={userSettings.notifications.doseReminder.time}
                onChange={(e) => handleDoseReminderTime(e.target.value)}
                className="w-32 mt-1"
              />
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium">Nudges do Score</span>
              <p className="text-sm text-muted-foreground">
                Dicas personalizadas baseadas no seu progresso
              </p>
            </div>
            <Switch
              checked={userSettings.notifications.scoreNudges}
              onCheckedChange={(checked) => handleNotificationToggle('scoreNudges', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium">Avisos de sorteio</span>
              <p className="text-sm text-muted-foreground">
                Lembretes sobre sorteios e bilhetes
              </p>
            </div>
            <Switch
              checked={userSettings.notifications.raffleAlerts}
              onCheckedChange={(checked) => handleNotificationToggle('raffleAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium">Celebrações de marcos</span>
              <p className="text-sm text-muted-foreground">
                Parabenizações por conquistas importantes
              </p>
            </div>
            <Switch
              checked={userSettings.notifications.milestones}
              onCheckedChange={(checked) => handleNotificationToggle('milestones', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium">Aparecer em rankings</span>
              <p className="text-sm text-muted-foreground">
                Mostrar seu progresso nos rankings públicos
              </p>
            </div>
            <Switch
              checked={userSettings.privacy.showInRankings}
              onCheckedChange={(checked) => handlePrivacyToggle('showInRankings', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium">Compartilhar depoimentos</span>
              <p className="text-sm text-muted-foreground">
                Permitir que seus depoimentos sejam vistos por outros
              </p>
            </div>
            <Switch
              checked={userSettings.privacy.shareTestimonies}
              onCheckedChange={(checked) => handlePrivacyToggle('shareTestimonies', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar meus dados
            </Button>

            <Button
              variant={showDeleteConfirm ? "destructive" : "outline"}
              onClick={handleDeleteAccount}
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {showDeleteConfirm ? "Confirmar exclusão da conta" : "Excluir conta"}
            </Button>
            
            {showDeleteConfirm && (
              <p className="text-sm text-muted-foreground">
                Clique novamente para confirmar. Esta ação não pode ser desfeita.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Idioma</label>
              <Select
                value={userSettings.general.language}
                onValueChange={(value) => handleGeneralSetting('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fuso horário</label>
              <Select
                value={userSettings.general.timezone}
                onValueChange={(value) => handleGeneralSetting('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {userSettings.general.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="font-medium">Modo escuro</span>
            </div>
            <Switch
              checked={userSettings.general.darkMode}
              onCheckedChange={(checked) => handleGeneralSetting('darkMode', checked)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tamanho da fonte</label>
            <Select
              value={userSettings.general.fontSize}
              onValueChange={(value) => handleGeneralSetting('fontSize', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Pequena</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* About and Support */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Sobre e Suporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Versão do app</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Termos de Uso e Privacidade
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              FAQ Expandido
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Contato (WhatsApp)
            </Button>

            <Button 
              variant="outline" 
              onClick={handleRateApp}
              className="w-full justify-start"
            >
              <Star className="w-4 h-4 mr-2" />
              Avaliar o app
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;