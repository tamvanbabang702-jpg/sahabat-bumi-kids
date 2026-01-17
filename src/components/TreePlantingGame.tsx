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

// Fixed planting spots for consistent gameplay
const plantingSpots = [
  { x: 15, y: 55 },
  { x: 35, y: 50 },
  { x: 55, y: 55 },
  { x: 75, y: 50 },
  { x: 25, y: 70 },
  { x: 50, y: 75 },
  { x: 70, y: 70 },
];

export function TreePlantingGame({ onComplete, onBack }: TreePlantingGameProps) {
  const [currentSpot, setCurrentSpot] = useState(0);
  const [trees, setTrees] = useState<PlantedTree[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const { plantTree, addStars, addExperience, playerName } = useGameStore();

  const targetTrees = plantingSpots.length;

  const handlePlant = useCallback(() => {
    if (currentSpot >= targetTrees) return;

    const spot = plantingSpots[currentSpot];
    const newTree: PlantedTree = {
      id: Date.now(),
      x: spot.x,
      y: spot.y,
    };

    setTrees((prev) => [...prev, newTree]);
    plantTree('forest');
    addStars(1);
    addExperience(10);
    
    const nextSpot = currentSpot + 1;
    setCurrentSpot(nextSpot);

    if (nextSpot >= targetTrees) {
      setTimeout(() => setShowComplete(true), 800);
    }
  }, [currentSpot, plantTree, addStars, addExperience, targetTrees]);

  const handleComplete = () => {
    addStars(5);
    addExperience(50);
    onComplete();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-secondary/30 to-primary/20 overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <KidButton variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </KidButton>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Menanam Pohon 🌳</h2>
          <p className="text-sm text-muted-foreground">
            {trees.length} / {targetTrees} pohon
          </p>
        </div>

        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-background/60">
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
        className="relative mx-4 mt-4 rounded-3xl overflow-hidden"
        style={{ height: 'calc(100vh - 180px)', minHeight: '350px' }}
      >
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-secondary/30" />

        {/* Sun */}
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-6 right-8 w-16 h-16 bg-accent rounded-full shadow-glow"
        />

        {/* Clouds */}
        <motion.div
          animate={{ x: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute top-8 left-12 w-24 h-10 bg-white/70 rounded-full"
        />
        <motion.div
          animate={{ x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="absolute top-16 left-1/2 w-20 h-8 bg-white/60 rounded-full"
        />

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-village/80 via-village/60 to-primary/30 rounded-b-3xl" />

        {/* Grass */}
        <div className="absolute bottom-[40%] left-0 right-0 flex justify-around">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
              className="w-3 h-6 bg-primary/70 rounded-t-full"
            />
          ))}
        </div>

        {/* Planted Trees */}
        <AnimatePresence>
          {trees.map((tree) => (
            <motion.div
              key={tree.id}
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute"
              style={{ left: `${tree.x}%`, top: `${tree.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{ transformOrigin: 'bottom' }}
                className="relative"
              >
                {/* Trunk */}
                <div className="w-4 h-10 bg-village mx-auto rounded" />
                {/* Leaves */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-14 h-14 bg-primary rounded-full shadow-lg" />
                  <div className="absolute -top-3 left-1 w-10 h-10 bg-primary/90 rounded-full" />
                  <div className="absolute -top-1 right-0 w-8 h-8 bg-primary/80 rounded-full" />
                </div>
              </motion.div>

              {/* Sparkle */}
              <motion.div
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.8 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl"
              >
                ✨
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current planting spot indicator */}
        {currentSpot < targetTrees && (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute"
            style={{ 
              left: `${plantingSpots[currentSpot].x}%`, 
              top: `${plantingSpots[currentSpot].y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-16 h-16 border-4 border-dashed border-accent rounded-full bg-accent/20" />
          </motion.div>
        )}

        {/* Plant button */}
        {currentSpot < targetTrees && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-0 right-0 flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-4xl mb-3"
            >
              🌱
            </motion.div>
            <KidButton
              variant="primary"
              size="lg"
              onClick={handlePlant}
              className="shadow-lg"
            >
              Tanam Pohon! 🌳
            </KidButton>
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
                Hebat {playerName || 'Sahabat'}! Kamu menanam {targetTrees} pohon! Hutan jadi lebih hijau! 🌿
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
