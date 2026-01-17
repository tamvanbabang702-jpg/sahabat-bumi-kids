import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import bimoBear from '@/assets/characters/bimo-bear.png';
import lilaFish from '@/assets/characters/lila-fish.png';
import raniGirl from '@/assets/characters/rani-girl.png';

export type CharacterType = 'bimo' | 'lila' | 'rani';

interface CharacterDialogueProps {
  character: CharacterType;
  message: string;
  isVisible?: boolean;
  onComplete?: () => void;
  position?: 'left' | 'right' | 'center';
  emotion?: 'happy' | 'sad' | 'neutral';
}

const characterData = {
  bimo: {
    name: 'Bimo',
    image: bimoBear,
    color: 'bg-primary/20 border-primary',
  },
  lila: {
    name: 'Lila',
    image: lilaFish,
    color: 'bg-secondary/20 border-secondary',
  },
  rani: {
    name: 'Rani',
    image: raniGirl,
    color: 'bg-destructive/20 border-destructive',
  },
};

export function CharacterDialogue({
  character,
  message,
  isVisible = true,
  onComplete,
  position = 'center',
  emotion = 'happy',
}: CharacterDialogueProps) {
  const data = characterData[character];

  const positionClasses = {
    left: 'items-start',
    right: 'items-end',
    center: 'items-center',
  };

  const emotionAnimation = {
    happy: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } },
    sad: { rotate: [-2, 2, -2], transition: { repeat: Infinity, duration: 1.5 } },
    neutral: {},
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={cn('flex flex-col gap-4', positionClasses[position])}
        >
          {/* Character Image */}
          <motion.div
            animate={emotionAnimation[emotion]}
            className="relative"
          >
            <motion.img
              src={data.image}
              alt={data.name}
              className="w-32 h-32 object-contain drop-shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            />
            {emotion === 'happy' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 -right-2 text-3xl"
              >
                ✨
              </motion.div>
            )}
          </motion.div>

          {/* Dialogue Bubble */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            onClick={onComplete}
            className={cn(
              'relative max-w-xs p-4 rounded-3xl border-4 shadow-card cursor-pointer',
              data.color
            )}
          >
            {/* Character Name */}
            <div className="font-bold text-foreground mb-1">{data.name}</div>
            
            {/* Message */}
            <p className="text-lg font-semibold text-foreground leading-relaxed">
              {message}
            </p>

            {/* Tap indicator */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-right text-sm text-muted-foreground mt-2"
            >
              Ketuk untuk lanjut ▶
            </motion.div>

            {/* Speech bubble pointer */}
            <div
              className={cn(
                'absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0',
                'border-l-[12px] border-l-transparent',
                'border-r-[12px] border-r-transparent',
                'border-b-[12px]',
                character === 'bimo' && 'border-b-primary',
                character === 'lila' && 'border-b-secondary',
                character === 'rani' && 'border-b-destructive'
              )}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
