import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { KidButton } from './ui/kid-button';

interface ResultAnimationProps {
  isPositive: boolean;
  message: string;
  isVisible: boolean;
  onContinue: () => void;
}

export function ResultAnimation({ isPositive, message, isVisible, onContinue }: ResultAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={cn(
              'relative max-w-sm w-full p-8 rounded-3xl text-center shadow-card',
              isPositive ? 'bg-success/95' : 'bg-destructive/95'
            )}
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-8xl mb-4"
            >
              {isPositive ? '😊' : '😢'}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-4"
            >
              {isPositive ? 'Bagus Sekali!' : 'Hmm...'}
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/90 mb-6 leading-relaxed"
            >
              {message}
            </motion.p>

            {/* Stars reward (only for positive) */}
            {isPositive && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-2 mb-6"
              >
                {[1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, rotate: -180 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-4xl animate-pulse-grow"
                  >
                    ⭐
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <KidButton
                variant={isPositive ? 'accent' : 'outline'}
                size="lg"
                onClick={onContinue}
                className={isPositive ? '' : 'border-white text-white hover:bg-white/20'}
              >
                Lanjut
              </KidButton>
            </motion.div>

            {/* Decorative elements */}
            {isPositive && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (i % 2 === 0 ? 1 : -1) * 50],
                      y: [0, -100 - i * 20],
                    }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1.5 }}
                    className="absolute text-3xl pointer-events-none"
                    style={{ left: `${20 + i * 12}%`, top: '50%' }}
                  >
                    ✨
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
