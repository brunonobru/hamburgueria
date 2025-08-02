export class NotificationSounds {
  private audioContext: AudioContext | null = null;

  private getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private createTone(frequency: number, duration: number, volume: number) {
    const context = this.getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);

    return oscillator;
  }

  async playSound(type: string, volume: number = 0.3) {
    try {
      // Resume audio context if suspended (required for some browsers)
      const context = this.getAudioContext();
      if (context.state === 'suspended') {
        await context.resume();
      }

      switch (type) {
        case 'default':
          // Simple beep
          this.createTone(800, 0.2, volume);
          break;
          
        case 'bell':
          // Bell-like sound with multiple tones
          this.createTone(800, 0.1, volume);
          setTimeout(() => this.createTone(600, 0.1, volume * 0.7), 100);
          setTimeout(() => this.createTone(400, 0.2, volume * 0.5), 200);
          break;
          
        case 'chime':
          // Ascending chime
          this.createTone(523, 0.15, volume);
          setTimeout(() => this.createTone(659, 0.15, volume), 150);
          setTimeout(() => this.createTone(784, 0.2, volume), 300);
          break;
          
        case 'ping':
          // Quick ping sound
          this.createTone(1000, 0.1, volume);
          setTimeout(() => this.createTone(800, 0.05, volume * 0.5), 100);
          break;
          
        default:
          this.createTone(800, 0.2, volume);
      }
    } catch (error) {
      console.warn('Erro ao reproduzir som de notificação:', error);
      // Fallback para notification API se disponível
      this.fallbackNotificationSound();
    }
  }

  private fallbackNotificationSound() {
    try {
      // Use the browser's notification sound if available
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('', {
          tag: 'sound-only',
          silent: false,
          body: ' ',
        });
        
        // Close immediately since we only want the sound
        setTimeout(() => notification.close(), 1);
      }
    } catch (error) {
      console.warn('Fallback notification sound failed:', error);
    }
  }
}

// Create a singleton instance
export const notificationSounds = new NotificationSounds();