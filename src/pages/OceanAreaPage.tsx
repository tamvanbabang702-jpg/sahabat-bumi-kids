import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KidButton } from '@/components/ui/kid-button';
import { CharacterDialogue } from '@/components/CharacterDialogue';
import { ChoiceCard } from '@/components/ChoiceCard';
import { ResultAnimation } from '@/components/ResultAnimation';
import { TrashCleaningGame } from '@/components/TrashCleaningGame';
import { StarCounter } from '@/components/StarCounter';
import { useGameStore } from '@/stores/gameStore';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

import oceanBeautiful from '@/assets/scenes/ocean-beautiful.png';

type GamePhase = 'intro' | 'choice' | 'result' | 'minigame-intro' | 'minigame' | 'complete';

export function OceanAreaPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [lastChoice, setLastChoice] = useState<'protect' | 'pollute' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const { 
    markAreaExplored, 
    markAreaCompleted,
    addChoice, 
    addStars, 
    addExperience,
    updateAreaHealth,
    areas,
    earnBadge,
    playerName,
  } = useGameStore();

  const oceanHealth = areas.ocean.health;
  const name = playerName || 'Sahabat';

  const handleIntroComplete = () => {
    markAreaExplored('ocean');
    earnBadge({
      id: 'ocean-friend',
      name: 'Sahabat Laut',
      description: 'Menjelajahi laut',
      icon: '🐢',
    });
    setPhase('choice');
  };

  const handleChoice = (choice: 'protect' | 'pollute') => {
    setLastChoice(choice);
    addChoice('ocean', choice);
    
    if (choice === 'protect') {
      addStars(3);
      addExperience(30);
      updateAreaHealth('ocean', oceanHealth + 15);
    } else {
      updateAreaHealth('ocean', oceanHealth - 20);
      addExperience(10);
    }
    
    setShowResult(true);
  };

  const handleResultContinue = () => {
    setShowResult(false);
    setPhase('minigame-intro');
  };

  if (phase === 'minigame') {
    return (
      <TrashCleaningGame
        areaType="ocean"
        onComplete={() => {
          markAreaCompleted('ocean');
          earnBadge({
            id: 'earth-guardian',
            name: 'Penjaga Bumi',
            description: 'Menyelesaikan semua area',
            icon: '🌍',
          });
          setPhase('complete');
        }}
        onBack={() => setPhase('minigame-intro')}
      />
    );
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ocean/30 to-primary/20 p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-9xl mb-6"
            >
              🌍
            </motion.div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Selamat, {name}! 🎉
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              Kamu sudah menjadi Sahabat Bumi yang hebat! Kamu sudah menjelajahi semua tempat dan belajar cara menjaga alam!
            </p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-4xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>

          <KidButton
            variant="primary"
            size="xl"
            onClick={() => navigate('/world')}
          >
            Kembali ke Peta 🗺️
          </KidButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <KidButton variant="ghost" size="icon" onClick={() => navigate('/world')}>
            <ArrowLeft className="w-6 h-6" />
          </KidButton>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>🌊</span> Laut
            </h1>
          </div>

          <StarCounter showLevel={false} />
        </div>
      </div>

      <div className="relative h-48 md:h-64 overflow-hidden">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={oceanBeautiful}
          alt="Laut"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-card/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-card"
        >
          <span className="text-lg">{oceanHealth >= 50 ? '💙' : '💔'}</span>
          <span className="font-bold text-sm">Kesehatan: {oceanHealth}%</span>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col">
        {phase === 'intro' && (
          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <CharacterDialogue
              character="lila"
              message={`${name}, akhirnya kita sampai di laut yang luas! Di sini ada banyak teman-temanku: penyu, lumba-lumba, dan terumbu karang yang indah! Ayo kita jaga laut bersama! 🐢`}
              onComplete={handleIntroComplete}
            />
          </div>
        )}

        {phase === 'choice' && (
          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <CharacterDialogue
                character="lila"
                message={`${name}, lihat! Ada penyu yang terjerat plastik. Apa yang harus kita lakukan?`}
                onComplete={() => {}}
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <ChoiceCard
                icon="🐢"
                title="Selamatkan Penyu"
                isPositive={true}
                onClick={() => handleChoice('protect')}
                delay={0.2}
              />
              <ChoiceCard
                icon="🤷"
                title="Biarkan Saja"
                isPositive={false}
                onClick={() => handleChoice('pollute')}
                delay={0.3}
              />
            </div>
          </div>
        )}

        {phase === 'minigame-intro' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center bg-card p-8 rounded-3xl shadow-card border-4 border-ocean/20 max-w-sm"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Mini Game Terakhir!</h2>
              <p className="text-muted-foreground mb-6">
                Ayo bersihkan sampah plastik di laut untuk menyelamatkan hewan laut!
              </p>
              <KidButton
                variant="secondary"
                size="lg"
                onClick={() => setPhase('minigame')}
                className="w-full mb-3"
              >
                <Gamepad2 className="w-6 h-6 mr-2" />
                Mulai Bersihkan!
              </KidButton>
            </motion.div>
          </div>
        )}
      </div>

      <ResultAnimation
        isPositive={lastChoice === 'protect'}
        message={
          lastChoice === 'protect'
            ? 'Penyu selamat → laut bersih → terumbu karang indah → semua bahagia 😊'
            : 'Sampah di laut → hewan laut menderita → laut rusak → semua sedih 😢'
        }
        isVisible={showResult}
        onContinue={handleResultContinue}
      />
    </div>
  );
}

export default OceanAreaPage;
