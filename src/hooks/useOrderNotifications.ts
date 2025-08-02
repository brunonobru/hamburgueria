import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSettings } from '@/contexts/NotificationSettingsContext';
import { notificationSounds } from '@/utils/notificationSounds';
import { Order } from '@/types';

export const useOrderNotifications = () => {
  const { toast } = useToast();
  const { settings } = useNotificationSettings();

  useEffect(() => {
    // Create a channel to listen for new orders
    const channel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const newOrder = payload.new as Order;
          
          // Só mostrar notificação se estiver habilitada
          if (!settings.enabled) return;
          
          // Show notification toast com duração personalizada
          toast({
            title: "Novo Pedido Recebido! 🍕",
            description: `Pedido #${newOrder.id.slice(0, 8)} de ${newOrder.customerName} - Total: R$ ${newOrder.total.toFixed(2)}`,
            duration: settings.duration,
          });

          // Reproduzir som se habilitado
          if (settings.soundEnabled) {
            notificationSounds.playSound(settings.soundType, settings.volume);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, settings]);
};