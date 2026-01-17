import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import { KidButton } from '@/components/ui/kid-button';
import { StarCounter } from '@/components/StarCounter';
import { CharacterDialogue } from '@/components/CharacterDialogue';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

import bimoBear from '@/assets/characters/bimo-bear.png';
import lilaFish from '@/assets/characters/lila-fish.png';
import raniGirl from '@/assets/characters/rani-girl.png';

export function HomePage() {
  const navigate = useNavigate();
  const { playerName, setPlayerName, soundEnabled, toggleSound, stars } = useGameStore();
  const [showNameInput, setShowNameInput] = useState(!playerName);
  const [nameValue, setNameValue] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const { startBackgroundMusic, stopBackgroundMusic, playSuccess } = useSoundEffects();

  // Start background music when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startBackgroundMusic();
    }, 1000);
    return () => {
      clearTimeout(timer);
      stopBackgroundMusic();
    };
  }, [startBackgroundMusic, stopBackgroundMusic]);

  const handleStart = () => {
    if (nameValue.trim()) {
      setPlayerName(nameValue.trim());
      setShowNameInput(false);
      setShowWelcome(true);
      playSuccess();
    }
  };

  const handleContinue = () => {
    navigate('/world');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-secondary/30 via-background to-primary/20">
      {/* Decorative clouds */}
      <motion.div
        animate={{ x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-10 left-10 w-32 h-16 bg-white/60 rounded-full blur-sm"
      />
      <motion.div
        animate={{ x: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className="absolute top-20 right-20 w-40 h-20 bg-white/50 rounded-full blur-sm"
      />

      {/* Settings button */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <KidButton
          variant="ghost"
          size="icon"
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
        >
          {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </KidButton>
        <KidButton
          variant="ghost"
          size="icon"
          onClick={() => navigate('/parent')}
          aria-label="Mode Orang Tua"
        >
          <Settings className="w-6 h-6" />
        </KidButton>
      </div>

      {/* Stars counter (if returning player) */}
      {playerName && stars > 0 && (
        <div className="absolute top-4 left-4 z-20">
          <StarCounter showLevel={false} />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        
        {/* Logo and title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center mb-8"
        >
          {/* App icon */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-8xl mb-4"
          >
            🌍
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-gradient-forest mb-2">
            Sahabat Bumi
          </h1>
          <p className="text-xl text-muted-foreground font-semibold">
            Ayo jadi sahabat alam! 🌿
          </p>
        </motion.div>

        {/* Characters */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mb-8"
        >
          <motion.img
            src={bimoBear}
            alt="Bimo"
            className="w-20 h-20 object-contain animate-float"
            style={{ animationDelay: '0s' }}
          />
          <motion.img
            src={lilaFish}
            alt="Lila"
            className="w-20 h-20 object-contain animate-float"
            style={{ animationDelay: '0.5s' }}
          />
          <motion.img
            src={raniGirl}
            alt="Rani"
            className="w-20 h-20 object-contain animate-float"
            style={{ animationDelay: '1s' }}
          />
        </motion.div>

        {/* Name input for new players */}
        {showNameInput && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-sm bg-card p-6 rounded-3xl shadow-card border-4 border-primary/20 mb-6"
          >
            <label className="block text-center text-xl font-bold text-foreground mb-4">
              Siapa namamu? 😊
            </label>
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Ketik namamu..."
              className="w-full px-6 py-4 text-xl text-center font-semibold rounded-2xl border-4 border-primary/30 focus:border-primary focus:outline-none bg-background"
              maxLength={20}
            />
            <KidButton
              variant="primary"
              size="lg"
              className="w-full mt-4"
              onClick={handleStart}
              disabled={!nameValue.trim()}
            >
              Mulai Petualangan! 🚀
            </KidButton>
          </motion.div>
        )}

        {/* Welcome dialogue */}
        {showWelcome && (
          <div className="w-full max-w-sm mb-6">
            <CharacterDialogue
              character="bimo"
              message={`Halo ${playerName}! Selamat datang di dunia Sahabat Bumi! Ayo kita jaga alam bersama! 🌳`}
              onComplete={handleContinue}
            />
          </div>
        )}

        {/* Continue button for returning players */}
        {!showNameInput && !showWelcome && playerName && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-xl font-semibold text-foreground mb-4">
              Selamat datang kembali, <span className="text-primary">{playerName}</span>! 👋
            </p>
            <KidButton variant="primary" size="xl" onClick={handleContinue}>
              Lanjutkan! 🎮
            </KidButton>
          </motion.div>
        )}
      </div>

      {/* Decorative ground */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/30 to-transparent" />
      
      {/* Decorative trees */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-0 left-4 text-6xl"
      >
        🌲
      </motion.div>
      <motion.div
        animate={{ rotate: [2, -2, 2] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-0 right-4 text-6xl"
      >
        🌳
      </motion.div>
    </div>
  );
}

export default HomePage;
