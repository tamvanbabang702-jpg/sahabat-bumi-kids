import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { KidButton } from './ui/kid-button';
import { ArrowLeft } from 'lucide-react';

interface TrashCleaningGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface TrashItem {
  id: number;
  x: number;
  y: number;
  type: 'bottle' | 'can' | 'bag' | 'paper';
  collected: boolean;
}

const trashEmojis = {
  bottle: '🍶',
  can: '🥫',
  bag: '🛍️',
  paper: '📄',
};

export function TrashCleaningGame({ onComplete, onBack }: TrashCleaningGameProps) {
  const [trash, setTrash] = useState<TrashItem[]>(() => {
    const types: TrashItem['type'][] = ['bottle', 'can', 'bag', 'paper'];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 40 + Math.random() * 40,
      type: types[Math.floor(Math.random() * types.length)],
      collected: false,
    }));
  });
  const [showComplete, setShowComplete] = useState(false);
  const { cleanTrash, addStars, addExperience } = useGameStore();

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
    
    cleanTrash('river');
    addStars(1);
    addExperience(10);
  }, [cleanTrash, addStars, addExperience, targetCount]);

  const handleComplete = () => {
    addStars(5);
    addExperience(50);
    onComplete();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-secondary/40 to-ocean/30 overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <KidButton variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </KidButton>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Bersihkan Sungai 🧹</h2>
          <p className="text-sm text-muted-foreground">
            {collectedCount} / {targetCount} sampah
          </p>
        </div>

        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(collectedCount / targetCount) * 100}%` }}
            className="h-full bg-success rounded-full"
          />
        </div>
      </div>

      {/* Game Area */}
      <div
        className="relative mx-4 rounded-3xl overflow-hidden"
        style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
      >
        {/* Water background */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-ocean/60" />

        {/* Animated waves */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute top-20 left-0 right-0 h-8 bg-secondary/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ x: [20, -20, 20] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-32 left-0 right-0 h-6 bg-ocean/20 rounded-full blur-sm"
        />

        {/* River banks */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-village/50 to-transparent rounded-b-3xl" />

        {/* Trash items */}
        <AnimatePresence>
          {trash.map((item) => !item.collected && (
            <motion.button
              key={item.id}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                y: [0, -5, 0],
                rotate: [-5, 5, -5],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                scale: { type: 'spring' },
                y: { repeat: Infinity, duration: 2 + Math.random() },
                rotate: { repeat: Infinity, duration: 3 + Math.random() },
              }}
              onClick={() => handleCollect(item.id)}
              className="absolute text-4xl cursor-pointer hover:scale-125 transition-transform focus:outline-none"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {trashEmojis[item.type]}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Instruction */}
        {collectedCount < targetCount && (
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center"
          >
            <div className="text-5xl mb-2">👆</div>
            <p className="text-lg font-bold text-foreground bg-card/80 px-4 py-2 rounded-full">
              Ketuk sampah untuk membersihkan!
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="max-w-sm w-full bg-secondary p-8 rounded-3xl text-center shadow-card"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-4"
              >
                🐟
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Sungai Bersih!
              </h2>

              <p className="text-white/90 text-lg mb-4">
                Kamu membersihkan {targetCount} sampah! Ikan-ikan senang sekali! 💙
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
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
