import { useCallback, useRef, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

// Audio context singleton
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Simple synthesized sounds for kids
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Play a cheerful melody sequence
const playMelody = (notes: number[], noteDuration: number, volume = 0.2) => {
  notes.forEach((freq, index) => {
    setTimeout(() => {
      playTone(freq, noteDuration, 'sine', volume);
    }, index * (noteDuration * 1000 * 0.8));
  });
};

export const useSoundEffects = () => {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const bgMusicRef = useRef<{ stop: () => void } | null>(null);
  const bgMusicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Button click sound - cheerful pop
  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    playTone(800, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(1000, 0.1, 'sine', 0.15), 50);
  }, [soundEnabled]);

  // Star reward sound - magical ascending
  const playStarReward = useCallback(() => {
    if (!soundEnabled) return;
    const starNotes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    playMelody(starNotes, 0.15, 0.25);
  }, [soundEnabled]);

  // Success sound - happy fanfare
  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    const successNotes = [392, 494, 587, 784, 784, 659]; // G4, B4, D5, G5, G5, E5
    playMelody(successNotes, 0.2, 0.3);
  }, [soundEnabled]);

  // Error/wrong choice sound - gentle descending
  const playError = useCallback(() => {
    if (!soundEnabled) return;
    playTone(400, 0.2, 'triangle', 0.2);
    setTimeout(() => playTone(300, 0.3, 'triangle', 0.15), 150);
  }, [soundEnabled]);

  // Positive choice sound - uplifting
  const playPositiveChoice = useCallback(() => {
    if (!soundEnabled) return;
    const notes = [440, 554, 659]; // A4, C#5, E5
    playMelody(notes, 0.15, 0.25);
  }, [soundEnabled]);

  // Game complete sound - celebration
  const playGameComplete = useCallback(() => {
    if (!soundEnabled) return;
    const celebrationNotes = [523, 587, 659, 784, 880, 1047, 1175, 1319]; // C major scale celebration
    playMelody(celebrationNotes, 0.12, 0.25);
  }, [soundEnabled]);

  // Plant/collect sound - soft plop
  const playCollect = useCallback(() => {
    if (!soundEnabled) return;
    playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(900, 0.15, 'sine', 0.15), 80);
  }, [soundEnabled]);

  // Background music - cheerful loop
  const startBackgroundMusic = useCallback(() => {
    if (!soundEnabled || bgMusicIntervalRef.current) return;

    const playBgMelody = () => {
      if (!soundEnabled) return;
      // Simple cheerful melody pattern
      const melodyPattern = [
        { freq: 523, delay: 0 },    // C5
        { freq: 587, delay: 300 },  // D5
        { freq: 659, delay: 600 },  // E5
        { freq: 523, delay: 900 },  // C5
        { freq: 659, delay: 1200 }, // E5
        { freq: 784, delay: 1500 }, // G5
        { freq: 659, delay: 1800 }, // E5
        { freq: 523, delay: 2100 }, // C5
      ];

      melodyPattern.forEach(({ freq, delay }) => {
        setTimeout(() => {
          if (soundEnabled) {
            playTone(freq, 0.25, 'sine', 0.08);
          }
        }, delay);
      });
    };

    playBgMelody();
    bgMusicIntervalRef.current = setInterval(playBgMelody, 3000);
  }, [soundEnabled]);

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicIntervalRef.current) {
      clearInterval(bgMusicIntervalRef.current);
      bgMusicIntervalRef.current = null;
    }
  }, []);

  // Clean up on unmount or when sound is disabled
  useEffect(() => {
    if (!soundEnabled) {
      stopBackgroundMusic();
    }
    return () => {
      stopBackgroundMusic();
    };
  }, [soundEnabled, stopBackgroundMusic]);

  return {
    playClick,
    playStarReward,
    playSuccess,
    playError,
    playPositiveChoice,
    playGameComplete,
    playCollect,
    startBackgroundMusic,
    stopBackgroundMusic,
  };
};
