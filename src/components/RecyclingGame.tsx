import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { KidButton } from './ui/kid-button';
import { ArrowLeft } from 'lucide-react';

interface RecyclingGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface TrashItem {
  id: number;
  type: 'organic' | 'plastic' | 'paper';
  emoji: string;
  sorted: boolean;
}

const trashItems: { type: TrashItem['type']; emoji: string }[] = [
  { type: 'organic', emoji: '🍌' },
  { type: 'organic', emoji: '🍎' },
  { type: 'plastic', emoji: '🍶' },
  { type: 'plastic', emoji: '🥤' },
  { type: 'paper', emoji: '📰' },
  { type: 'paper', emoji: '📦' },
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
    trashItems.map((item, i) => ({
      id: i,
      ...item,
      sorted: false,
    }))
  );
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);
  const [score, setScore] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const { addStars, addExperience, cleanTrash } = useGameStore();

  const unsortedItems = items.filter((i) => !i.sorted);
  const targetScore = items.length;

  const handleBinClick = useCallback((binType: TrashItem['type']) => {
    if (!selectedItem) return;

    if (selectedItem.type === binType) {
      setItems((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? { ...i, sorted: true } : i))
      );
      setScore((s) => s + 1);
      addStars(1);
      addExperience(15);
      cleanTrash('city');

      if (score + 1 >= targetScore) {
        setTimeout(() => setShowComplete(true), 500);
      }
    }

    setSelectedItem(null);
  }, [selectedItem, score, targetScore, addStars, addExperience, cleanTrash]);

  const handleComplete = () => {
    addStars(5);
    addExperience(50);
    onComplete();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-city/20 to-muted overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <KidButton variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </KidButton>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Pilah Sampah ♻️</h2>
          <p className="text-sm text-muted-foreground">
            {score} / {targetScore} benar
          </p>
        </div>

        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / targetScore) * 100}%` }}
            className="h-full bg-success rounded-full"
          />
        </div>
      </div>

      {/* Game Area */}
      <div className="px-4 pb-8">
        {/* Unsorted items */}
        <div className="bg-card p-4 rounded-3xl shadow-card mb-6">
          <p className="text-center font-semibold text-muted-foreground mb-3">
            Pilih sampah, lalu ketuk tempat sampah yang benar!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {unsortedItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedItem(item)}
                className={`text-5xl p-2 rounded-2xl transition-all ${
                  selectedItem?.id === item.id
                    ? 'bg-accent ring-4 ring-accent/50 scale-110'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {item.emoji}
              </motion.button>
            ))}
            {unsortedItems.length === 0 && (
              <p className="text-success font-bold text-lg">Semua sudah dipilah! ✅</p>
            )}
          </div>
        </div>

        {/* Bins */}
        <div className="grid grid-cols-3 gap-4">
          {(['organic', 'plastic', 'paper'] as const).map((binType) => (
            <motion.button
              key={binType}
              whileHover={{ scale: selectedItem ? 1.05 : 1 }}
              whileTap={{ scale: selectedItem ? 0.95 : 1 }}
              onClick={() => handleBinClick(binType)}
              disabled={!selectedItem}
              className={`p-6 rounded-3xl text-center transition-all shadow-card ${
                binColors[binType]
              } ${selectedItem ? 'cursor-pointer ring-4 ring-white/30' : 'opacity-80'}`}
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
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-card/80 px-4 py-2 rounded-full text-sm">
            <span>🌱 Organik = sisa makanan</span>
            <span>♻️ Plastik = botol, gelas</span>
            <span>📄 Kertas = koran, kardus</span>
          </div>
        </motion.div>
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
                Kamu berhasil memilah semua sampah! Kota jadi bersih! 🏙️
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
