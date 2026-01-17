import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { KidButton } from './ui/kid-button';
import { ArrowLeft } from 'lucide-react';

import riverHealthy from '@/assets/scenes/river-healthy.png';

interface TrashCleaningGameProps {
  onComplete: () => void;
  onBack: () => void;
  areaType?: 'river' | 'ocean';
}

interface TrashItem {
  id: number;
  x: number;
  y: number;
  type: 'bottle' | 'can' | 'bag' | 'paper' | 'plastic';
  collected: boolean;
}

const trashEmojis: Record<TrashItem['type'], string> = {
  bottle: '🍶',
  can: '🥫',
  bag: '🛍️',
  paper: '📄',
  plastic: '🧴',
};

export function TrashCleaningGame({ onComplete, onBack, areaType = 'river' }: TrashCleaningGameProps) {
  const [trash, setTrash] = useState<TrashItem[]>(() => {
    const types: TrashItem['type'][] = ['bottle', 'can', 'bag', 'paper', 'plastic'];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + (i % 4) * 22,
      y: 25 + Math.floor(i / 4) * 30,
      type: types[i % types.length],
      collected: false,
    }));
  });
  const [showComplete, setShowComplete] = useState(false);
  const { cleanTrash, addStars, addExperience, playerName } = useGameStore();

  const collectedCount = trash.filter((t) => t.collected).length;
  const targetCount = trash.length;

  const handleCollect = useCallback((id: number) => {
    setTrash((prev) => {
      const newTrash = prev.map((t) =>
        t.id === id ? { ...t, collected: true } : t
      );
      const newCollected = newTrash.filter((t) => t.collected).length;
      
      if (newCollected >= targetCount) {
        setTimeout(() => setShowComplete(true), 500);
      }
      
      return newTrash;
    });
    
    cleanTrash(areaType);
    addStars(1);
    addExperience(10);
  }, [cleanTrash, addStars, addExperience, targetCount, areaType]);

  const handleComplete = () => {
    addStars(5);
    addExperience(50);
    onComplete();
  };

  const isOcean = areaType === 'ocean';

  return (
    <div className={`relative min-h-screen overflow-hidden ${isOcean ? 'bg-gradient-to-b from-ocean/40 to-secondary/30' : 'bg-gradient-to-b from-secondary/40 to-ocean/30'}`}>
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <KidButton variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </KidButton>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">
            {isOcean ? 'Bersihkan Laut 🌊' : 'Bersihkan Sungai 🧹'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {collectedCount} / {targetCount} sampah
          </p>
        </div>

        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-background/60">
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(collectedCount / targetCount) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-success rounded-full"
          />
        </div>
      </div>

      {/* Game Area */}
      <div className="relative mx-4 mt-4 rounded-3xl overflow-hidden bg-secondary/40" style={{ height: 'calc(100vh - 180px)', minHeight: '350px' }}>
        {/* Background image */}
        <img
          src={riverHealthy}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        {/* Water overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-ocean/40 to-secondary/60" />

        {/* Animated waves */}
        <motion.div
          animate={{ x: [-30, 30, -30] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-16 left-0 right-0 h-6 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{ x: [30, -30, 30] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute top-28 left-0 right-0 h-4 bg-white/15 rounded-full"
        />

        {/* Trash items - Grid layout for better visibility */}
        <div className="absolute inset-0 p-4">
          <div className="grid grid-cols-4 gap-4 h-full place-items-center pt-12">
            {trash.map((item) => (
              <AnimatePresence key={item.id}>
                {!item.collected && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      y: [0, -8, 0],
                    }}
                    exit={{ scale: 0, opacity: 0, y: -50 }}
                    transition={{ 
                      scale: { type: 'spring', stiffness: 300 },
                      y: { repeat: Infinity, duration: 2, delay: item.id * 0.2 },
                    }}
                    onClick={() => handleCollect(item.id)}
                    className="text-5xl md:text-6xl cursor-pointer hover:scale-125 active:scale-90 transition-transform focus:outline-none focus:ring-4 focus:ring-accent rounded-full p-2 bg-white/30 backdrop-blur-sm shadow-lg"
                  >
                    {trashEmojis[item.type]}
                  </motion.button>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>

        {/* Instruction overlay */}
        {collectedCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block"
            >
              <div className="text-5xl mb-2">👆</div>
              <p className="text-lg font-bold text-foreground bg-card/90 px-6 py-3 rounded-full shadow-lg inline-block">
                Ketuk sampah untuk membersihkan!
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Progress encouragement */}
        {collectedCount > 0 && collectedCount < targetCount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <p className="text-lg font-bold text-foreground bg-success/90 px-6 py-3 rounded-full shadow-lg inline-block">
              Bagus {playerName || 'Sahabat'}! Terus bersihkan! 💪
            </p>
          </motion.div>
        )}
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`max-w-sm w-full p-8 rounded-3xl text-center shadow-card ${isOcean ? 'bg-ocean' : 'bg-secondary'}`}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-4"
              >
                {isOcean ? '🐢' : '🐟'}
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {isOcean ? 'Laut Bersih!' : 'Sungai Bersih!'}
              </h2>

              <p className="text-white/90 text-lg mb-4">
                Hebat {playerName || 'Sahabat'}! Kamu membersihkan {targetCount} sampah! {isOcean ? 'Penyu dan ikan senang sekali!' : 'Ikan-ikan senang sekali!'} 💙
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.15, type: 'spring' }}
                    className="text-3xl"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <KidButton variant="accent" size="lg" onClick={handleComplete}>
                Selesai! 🎉
              </KidButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
