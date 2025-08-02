import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotificationSettings } from '@/contexts/NotificationSettingsContext';
import { notificationSounds } from '@/utils/notificationSounds';
import { Volume2, Bell, Timer } from 'lucide-react';

const NotificationSettings = () => {
  const { settings, updateSettings, resetSettings } = useNotificationSettings();

  const testNotification = async () => {
    if (settings.soundEnabled) {
      await notificationSounds.playSound(settings.soundType, settings.volume);
    }
  };

  const soundOptions = [
    { value: 'default', label: 'Padrão' },
    { value: 'bell', label: 'Sino' },
    { value: 'chime', label: 'Carrilhão' },
    { value: 'ping', label: 'Ping' },
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Notificação
        </CardTitle>
        <CardDescription>
          Personalize como você recebe notificações de novos pedidos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Habilitar/Desabilitar Notificações */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-enabled" className="text-base font-medium">
              Notificações de Novos Pedidos
            </Label>
            <p className="text-sm text-muted-foreground">
              Receber notificações quando novos pedidos chegarem
            </p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>

        <Separator />

        {/* Duração da Notificação */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <Label className="text-base font-medium">
              Duração na Tela: {settings.duration / 1000}s
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Por quanto tempo a notificação ficará visível
          </p>
          <Slider
            value={[settings.duration]}
            onValueChange={([value]) => updateSettings({ duration: value })}
            min={3000}
            max={15000}
            step={1000}
            className="w-full"
            disabled={!settings.enabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3s</span>
            <span>15s</span>
          </div>
        </div>

        <Separator />

        {/* Configurações de Som */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-enabled" className="text-base font-medium">
                Som de Notificação
              </Label>
              <p className="text-sm text-muted-foreground">
                Reproduzir som quando receber notificações
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              disabled={!settings.enabled}
            />
          </div>

          {settings.soundEnabled && settings.enabled && (
            <>
              {/* Tipo de Som */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Som</Label>
                <Select
                  value={settings.soundType}
                  onValueChange={(value: any) => updateSettings({ soundType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um som" />
                  </SelectTrigger>
                  <SelectContent>
                    {soundOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Volume */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <Label className="text-sm font-medium">
                    Volume: {Math.round(settings.volume * 100)}%
                  </Label>
                </div>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([value]) => updateSettings({ volume: value })}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Botão de Teste */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testNotification}
                className="w-full"
              >
                Testar Som
              </Button>
            </>
          )}
        </div>

        <Separator />

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="flex-1"
          >
            Restaurar Padrão
          </Button>
          <Button 
            onClick={() => {
              // As configurações são salvas automaticamente
              console.log('Configurações salvas!');
            }}
            className="flex-1"
          >
            Configurações Salvas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;