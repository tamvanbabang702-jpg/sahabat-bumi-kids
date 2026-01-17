import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { KidButton } from './ui/kid-button';
import { ArrowLeft } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface RecyclingGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface TrashItem {
  id: number;
  type: 'organic' | 'plastic' | 'paper';
  emoji: string;
  name: string;
  sorted: boolean;
}

const allTrashItems: Omit<TrashItem, 'id' | 'sorted'>[] = [
  { type: 'organic', emoji: '🍌', name: 'Kulit Pisang' },
  { type: 'organic', emoji: '🍎', name: 'Apel Busuk' },
  { type: 'plastic', emoji: '🍶', name: 'Botol Plastik' },
  { type: 'plastic', emoji: '🥤', name: 'Gelas Plastik' },
  { type: 'paper', emoji: '📰', name: 'Koran Bekas' },
  { type: 'paper', emoji: '📦', name: 'Kardus' },
];

const binColors = {
  organic: 'bg-primary',
  plastic: 'bg-accent',
  paper: 'bg-secondary',
};

const binEmojis = {
  organic: '🌱',
  plastic: '♻️',
  paper: '📄',
};

const binLabels = {
  organic: 'Organik',
  plastic: 'Plastik',
  paper: 'Kertas',
};

export function RecyclingGame({ onComplete, onBack }: RecyclingGameProps) {
  const [items, setItems] = useState<TrashItem[]>(() =>
    allTrashItems.map((item, i) => ({
      id: i,
      ...item,
      sorted: false,
    }))
  );
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const { addStars, addExperience, cleanTrash, playerName } = useGameStore();
  const { playCollect, playError, playGameComplete, playStarReward } = useSoundEffects();

  const sortedCount = items.filter((i) => i.sorted).length;
  const targetCount = items.length;

  const handleBinClick = useCallback((binType: TrashItem['type']) => {
    if (!selectedItem) return;

    if (selectedItem.type === binType) {
      // Correct!
      setItems((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? { ...i, sorted: true } : i))
      );
      addStars(1);
      addExperience(15);
      cleanTrash('city');
      setSelectedItem(null);
      playCollect(); // Play correct sound

      if (sortedCount + 1 >= targetCount) {
        setTimeout(() => {
          setShowComplete(true);
          playGameComplete();
        }, 500);
      }
    } else {
      // Wrong - show feedback
      setWrongAttempt(true);
      playError(); // Play error sound
      setTimeout(() => setWrongAttempt(false), 800);
    }
  }, [selectedItem, sortedCount, targetCount, addStars, addExperience, cleanTrash, playCollect, playError, playGameComplete]);

  const handleComplete = () => {
    addStars(5);
    addExperience(50);
    playStarReward(); // Play star reward sound
    onComplete();
  };

  const unsortedItems = items.filter((i) => !i.sorted);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-city/20 to-muted overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <KidButton variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </KidButton>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Pilah Sampah ♻️</h2>
          <p className="text-sm text-muted-foreground">
            {sortedCount} / {targetCount} dipilah
          </p>
        </div>

        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 bg-background/60">
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(sortedCount / targetCount) * 100}%` }}
            className="h-full bg-success rounded-full"
          />
        </div>
      </div>

      {/* Game Area */}
      <div className="px-4 py-6 space-y-6">
        {/* Instructions */}
        <div className="bg-card p-4 rounded-2xl shadow-card text-center">
          <p className="font-bold text-foreground">
            {selectedItem 
              ? `Pilih tempat sampah untuk ${selectedItem.name}!` 
              : 'Ketuk sampah, lalu masukkan ke tempat yang benar!'}
          </p>
        </div>

        {/* Unsorted items */}
        <div className="bg-card p-6 rounded-3xl shadow-card">
          <h3 className="text-center font-bold text-muted-foreground mb-4">Sampah yang perlu dipilah:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {unsortedItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedItem(item)}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                  selectedItem?.id === item.id
                    ? 'bg-accent ring-4 ring-accent/50 scale-110'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span className="text-5xl">{item.emoji}</span>
                <span className="text-xs font-semibold mt-1 text-foreground">{item.name}</span>
              </motion.button>
            ))}
            {unsortedItems.length === 0 && (
              <p className="text-success font-bold text-lg py-4">Semua sudah dipilah! ✅</p>
            )}
          </div>
        </div>

        {/* Bins */}
        <div className="grid grid-cols-3 gap-3">
          {(['organic', 'plastic', 'paper'] as const).map((binType) => (
            <motion.button
              key={binType}
              whileHover={{ scale: selectedItem ? 1.05 : 1 }}
              whileTap={{ scale: selectedItem ? 0.95 : 1 }}
              animate={wrongAttempt && selectedItem ? { x: [-5, 5, -5, 5, 0] } : {}}
              onClick={() => handleBinClick(binType)}
              disabled={!selectedItem}
              className={`p-5 rounded-3xl text-center transition-all shadow-card ${
                binColors[binType]
              } ${selectedItem ? 'cursor-pointer ring-4 ring-white/40' : 'opacity-70'}`}
            >
              <div className="text-5xl mb-2">{binEmojis[binType]}</div>
              <div className="text-white font-bold text-sm">{binLabels[binType]}</div>
            </motion.button>
          ))}
        </div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-accent/20 p-4 rounded-2xl"
        >
          <p className="text-center text-sm font-semibold text-accent-foreground">
            💡 <span className="font-bold">Tips:</span> Organik = sisa makanan • Plastik = botol & gelas • Kertas = koran & kardus
          </p>
        </motion.div>

        {/* Wrong attempt feedback */}
        <AnimatePresence>
          {wrongAttempt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-20 left-0 right-0 flex justify-center"
            >
              <div className="bg-destructive text-white px-6 py-3 rounded-full font-bold shadow-lg">
                Coba lagi! Itu bukan tempatnya 🤔
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="max-w-sm w-full bg-city p-8 rounded-3xl text-center shadow-card"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-4"
              >
                ♻️
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Hebat!
              </h2>

              <p className="text-white/90 text-lg mb-4">
                Bagus sekali {playerName || 'Sahabat'}! Kamu berhasil memilah semua sampah! Kota jadi bersih! 🏙️
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
