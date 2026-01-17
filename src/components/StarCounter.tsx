import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

interface StarCounterProps {
  showLevel?: boolean;
}

export function StarCounter({ showLevel = true }: StarCounterProps) {
  const { stars, level, experience } = useGameStore();
  const expNeeded = level * 100;
  const expPercent = (experience / expNeeded) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Stars */}
      <motion.div
        className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full border-2 border-accent"
        whileHover={{ scale: 1.05 }}
      >
        <Star className="w-6 h-6 text-accent fill-accent" />
        <motion.span
          key={stars}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="font-bold text-lg text-accent-foreground"
        >
          {stars}
        </motion.span>
      </motion.div>

      {/* Level */}
      {showLevel && (
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground">Level</span>
            <motion.div
              key={level}
              initial={{ scale: 1.3, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-button"
            >
              {level}
            </motion.div>
          </div>
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expPercent}%` }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
