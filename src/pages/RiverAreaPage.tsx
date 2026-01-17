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

import riverHealthy from '@/assets/scenes/river-healthy.png';
import riverPolluted from '@/assets/scenes/river-polluted.png';

type GamePhase = 'intro' | 'choice' | 'result' | 'minigame-intro' | 'minigame';

export function RiverAreaPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [lastChoice, setLastChoice] = useState<'clean' | 'pollute' | null>(null);
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

  const riverHealth = areas.river.health;
  const isHealthy = riverHealth >= 50;
  const name = playerName || 'Sahabat';

  const handleIntroComplete = () => {
    markAreaExplored('river');
    earnBadge({
      id: 'river-friend',
      name: 'Sahabat Sungai',
      description: 'Menjelajahi sungai',
      icon: '🐟',
    });
    setPhase('choice');
  };

  const handleChoice = (choice: 'clean' | 'pollute') => {
    setLastChoice(choice);
    addChoice('river', choice);
    
    if (choice === 'clean') {
      addStars(3);
      addExperience(30);
      updateAreaHealth('river', riverHealth + 15);
    } else {
      updateAreaHealth('river', riverHealth - 20);
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
        onComplete={() => {
          markAreaCompleted('river');
          navigate('/world');
        }}
        onBack={() => setPhase('minigame-intro')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <KidButton variant="ghost" size="icon" onClick={() => navigate('/world')}>
            <ArrowLeft className="w-6 h-6" />
          </KidButton>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>🌊</span> Sungai
            </h1>
          </div>

          <StarCounter showLevel={false} />
        </div>
      </div>

      {/* Scene Background */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <motion.img
          key={isHealthy ? 'healthy' : 'polluted'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={isHealthy ? riverHealthy : riverPolluted}
          alt="Sungai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-card/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-card"
        >
          <span className="text-lg">{isHealthy ? '💙' : '💔'}</span>
          <span className="font-bold text-sm">Kesehatan: {riverHealth}%</span>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {phase === 'intro' && (
          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <CharacterDialogue
              character="lila"
              message={`Hai ${name}! Aku Lila si Ikan! Senang bertemu denganmu! Ini sungaiku yang indah. Ayo bantu aku menjaga sungai tetap bersih supaya aku dan teman-temanku bisa berenang dengan senang! 💙`}
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
                message={`${name}, gawat! Ada orang yang mau membuang sampah ke sungai. Apa yang harus kita lakukan?`}
                onComplete={() => {}}
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <ChoiceCard
                icon="🧹"
                title="Jaga Kebersihan"
                isPositive={true}
                onClick={() => handleChoice('clean')}
                delay={0.2}
              />
              <ChoiceCard
                icon="🗑️"
                title="Buang Sampah"
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
              className="text-center bg-card p-8 rounded-3xl shadow-card border-4 border-secondary/20 max-w-sm"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Mini Game!</h2>
              <p className="text-muted-foreground mb-6">
                Ayo bersihkan sampah di sungai untuk membantu Lila dan teman-temannya!
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
        isPositive={lastChoice === 'clean'}
        message={
          lastChoice === 'clean'
            ? 'Sungai bersih → ikan sehat → nelayan senang → makanan melimpah 😊'
            : 'Sungai kotor → ikan sakit → nelayan sedih → makanan berkurang 😢'
        }
        isVisible={showResult}
        onContinue={handleResultContinue}
      />
    </div>
  );
}

export default RiverAreaPage;
