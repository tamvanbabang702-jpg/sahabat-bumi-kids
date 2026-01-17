import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { KidButton } from './ui/kid-button';
import { ArrowLeft } from 'lucide-react';

interface TreePlantingGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface PlantedTree {
  id: number;
  x: number;
  y: number;
}

export function TreePlantingGame({ onComplete, onBack }: TreePlantingGameProps) {
  const [trees, setTrees] = useState<PlantedTree[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const { plantTree, addStars, addExperience } = useGameStore();

  const targetTrees = 5;

  const handlePlant = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (trees.length >= targetTrees) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Keep trees in the planting area
    if (y < 30 || y > 85) return;

    const newTree: PlantedTree = {
      id: Date.now(),
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(35, Math.min(80, y)),
    };

    setTrees((prev) => [...prev, newTree]);
    plantTree('forest');
    addStars(1);
    addExperience(10);

    if (trees.length + 1 >= targetTrees) {
      setTimeout(() => setShowComplete(true), 500);
    }
  }, [trees.length, plantTree, addStars, addExperience]);

  const handleComplete = () => {
    addStars(5); // Bonus stars
    addExperience(50);
    onComplete();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-secondary/30 to-primary/20 overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <KidButton variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </KidButton>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Menanam Pohon 🌳</h2>
          <p className="text-sm text-muted-foreground">
            {trees.length} / {targetTrees} pohon
          </p>
        </div>

        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(trees.length / targetTrees) * 100}%` }}
            className="h-full bg-success rounded-full"
          />
        </div>
      </div>

      {/* Planting Area */}
      <div
        onClick={handlePlant}
        className="relative mx-4 rounded-3xl overflow-hidden cursor-pointer"
        style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
      >
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-secondary/20" />

        {/* Sun */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-8 right-8 w-20 h-20 bg-accent rounded-full shadow-glow"
        />

        {/* Ground */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-village/80 to-village/40 rounded-b-3xl"
        />

        {/* Grass details */}
        <div className="absolute bottom-[33%] left-0 right-0 h-8 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
              className="absolute bottom-0 w-4 h-8 bg-primary/60 rounded-t-full"
              style={{ left: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Planted Trees */}
        <AnimatePresence>
          {trees.map((tree, index) => (
            <motion.div
              key={tree.id}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute"
              style={{ left: `${tree.x}%`, top: `${tree.y}%` }}
            >
              {/* Tree */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{ transformOrigin: 'bottom' }}
                className="relative -translate-x-1/2"
              >
                {/* Trunk */}
                <div className="w-4 h-12 bg-village mx-auto rounded" />
                {/* Leaves */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 bg-primary rounded-full" />
                  <div className="absolute -top-4 left-2 w-12 h-12 bg-primary/80 rounded-full" />
                  <div className="absolute -top-2 right-0 w-10 h-10 bg-primary/90 rounded-full" />
                </div>
              </motion.div>

              {/* Sparkle */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [1, 0], scale: [0, 1.5] }}
                transition={{ duration: 0.5 }}
                className="absolute -top-4 left-0 text-3xl"
              >
                ✨
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Tap instruction */}
        {trees.length < targetTrees && (
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center"
          >
            <div className="text-5xl mb-2">👆</div>
            <p className="text-lg font-bold text-foreground bg-card/80 px-4 py-2 rounded-full">
              Ketuk untuk menanam!
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
              className="max-w-sm w-full bg-success p-8 rounded-3xl text-center shadow-card"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-4"
              >
                🌳
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Luar Biasa!
              </h2>

              <p className="text-white/90 text-lg mb-4">
                Kamu menanam {targetTrees} pohon! Hutan jadi lebih hijau! 🌿
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
