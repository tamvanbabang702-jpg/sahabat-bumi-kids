import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KidButton } from '@/components/ui/kid-button';
import { CharacterDialogue } from '@/components/CharacterDialogue';
import { ChoiceCard } from '@/components/ChoiceCard';
import { ResultAnimation } from '@/components/ResultAnimation';
import { RecyclingGame } from '@/components/RecyclingGame';
import { StarCounter } from '@/components/StarCounter';
import { useGameStore } from '@/stores/gameStore';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

import cityClean from '@/assets/scenes/city-clean.png';

type GamePhase = 'intro' | 'choice' | 'result' | 'minigame-intro' | 'minigame';

export function CityAreaPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [lastChoice, setLastChoice] = useState<'green' | 'pollute' | null>(null);
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

  const cityHealth = areas.city.health;

  const handleIntroComplete = () => {
    markAreaExplored('city');
    earnBadge({
      id: 'city-friend',
      name: 'Sahabat Kota',
      description: 'Menjelajahi kota',
      icon: '🏙️',
    });
    setPhase('choice');
  };

  const handleChoice = (choice: 'green' | 'pollute') => {
    setLastChoice(choice);
    addChoice('city', choice);
    
    if (choice === 'green') {
      addStars(3);
      addExperience(30);
      updateAreaHealth('city', cityHealth + 15);
    } else {
      updateAreaHealth('city', cityHealth - 20);
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
      <RecyclingGame
        onComplete={() => {
          markAreaCompleted('city');
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
              <span>🏙️</span> Kota
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
          src={cityClean}
          alt="Kota"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-card/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-card"
        >
          <span className="text-lg">{cityHealth >= 50 ? '💜' : '💔'}</span>
          <span className="font-bold text-sm">Kesehatan: {cityHealth}%</span>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col">
        {phase === 'intro' && (
          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <CharacterDialogue
              character="bimo"
              message="Wah, ini kota yang ramai! Di sini banyak kendaraan dan gedung. Ayo kita bantu membuat kota lebih hijau dan bersih! 🌳"
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
                character="bimo"
                message="Bagaimana cara pergi ke sekolah yang baik untuk lingkungan?"
                onComplete={() => {}}
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <ChoiceCard
                icon="🚲"
                title="Naik Sepeda"
                isPositive={true}
                onClick={() => handleChoice('green')}
                delay={0.2}
              />
              <ChoiceCard
                icon="🚗"
                title="Naik Mobil"
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
              className="text-center bg-card p-8 rounded-3xl shadow-card border-4 border-city/20 max-w-sm"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Mini Game!</h2>
              <p className="text-muted-foreground mb-6">
                Ayo pilah sampah dengan benar supaya bisa didaur ulang!
              </p>
              <KidButton
                variant="primary"
                size="lg"
                onClick={() => setPhase('minigame')}
                className="w-full mb-3"
              >
                <Gamepad2 className="w-6 h-6 mr-2" />
                Mulai Pilah Sampah!
              </KidButton>
            </motion.div>
          </div>
        )}
      </div>

      <ResultAnimation
        isPositive={lastChoice === 'green'}
        message={
          lastChoice === 'green'
            ? 'Naik sepeda → udara bersih → tubuh sehat → kota nyaman 😊'
            : 'Naik mobil terus → udara kotor → macet → semua lelah 😢'
        }
        isVisible={showResult}
        onContinue={handleResultContinue}
      />
    </div>
  );
}

export default CityAreaPage;
