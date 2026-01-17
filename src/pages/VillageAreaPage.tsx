import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KidButton } from '@/components/ui/kid-button';
import { CharacterDialogue } from '@/components/CharacterDialogue';
import { ChoiceCard } from '@/components/ChoiceCard';
import { ResultAnimation } from '@/components/ResultAnimation';
import { TreePlantingGame } from '@/components/TreePlantingGame';
import { StarCounter } from '@/components/StarCounter';
import { useGameStore } from '@/stores/gameStore';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

import villageHappy from '@/assets/scenes/village-happy.png';

type GamePhase = 'intro' | 'choice' | 'result' | 'minigame-intro' | 'minigame';

export function VillageAreaPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [lastChoice, setLastChoice] = useState<'eco' | 'waste' | null>(null);
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
  } = useGameStore();

  const villageHealth = areas.village.health;

  const handleIntroComplete = () => {
    markAreaExplored('village');
    earnBadge({
      id: 'village-friend',
      name: 'Sahabat Desa',
      description: 'Menjelajahi desa',
      icon: '🏡',
    });
    setPhase('choice');
  };

  const handleChoice = (choice: 'eco' | 'waste') => {
    setLastChoice(choice);
    addChoice('village', choice);
    
    if (choice === 'eco') {
      addStars(3);
      addExperience(30);
      updateAreaHealth('village', villageHealth + 15);
    } else {
      updateAreaHealth('village', villageHealth - 20);
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
      <TreePlantingGame
        onComplete={() => {
          markAreaCompleted('village');
          navigate('/world');
        }}
        onBack={() => setPhase('minigame-intro')}
      />
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
              <span>🏡</span> Desa
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
          src={villageHappy}
          alt="Desa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-card/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-card"
        >
          <span className="text-lg">{villageHealth >= 50 ? '🧡' : '💔'}</span>
          <span className="font-bold text-sm">Kesehatan: {villageHealth}%</span>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col">
        {phase === 'intro' && (
          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <CharacterDialogue
              character="rani"
              message="Halo! Aku Rani, aku tinggal di desa ini! Ayo bantu kami menjaga desa tetap asri dan indah dengan menanam pohon dan sayuran! 🌱"
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
                character="rani"
                message="Ada lahan kosong di desa. Mau dipakai untuk apa?"
                onComplete={() => {}}
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <ChoiceCard
                icon="🌱"
                title="Kebun Sayur"
                isPositive={true}
                onClick={() => handleChoice('eco')}
                delay={0.2}
              />
              <ChoiceCard
                icon="🏭"
                title="Pabrik"
                isPositive={false}
                onClick={() => handleChoice('waste')}
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
              className="text-center bg-card p-8 rounded-3xl shadow-card border-4 border-village/20 max-w-sm"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Mini Game!</h2>
              <p className="text-muted-foreground mb-6">
                Ayo tanam pohon dan sayuran untuk membuat desa lebih hijau!
              </p>
              <KidButton
                variant="primary"
                size="lg"
                onClick={() => setPhase('minigame')}
                className="w-full mb-3"
              >
                <Gamepad2 className="w-6 h-6 mr-2" />
                Mulai Menanam!
              </KidButton>
            </motion.div>
          </div>
        )}
      </div>

      <ResultAnimation
        isPositive={lastChoice === 'eco'}
        message={
          lastChoice === 'eco'
            ? 'Kebun sayur → makanan sehat → warga kuat → desa makmur 😊'
            : 'Pabrik → udara kotor → warga sakit → desa tidak nyaman 😢'
        }
        isVisible={showResult}
        onContinue={handleResultContinue}
      />
    </div>
  );
}

export default VillageAreaPage;
