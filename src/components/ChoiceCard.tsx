import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChoiceCardProps {
  icon: string;
  title: string;
  isPositive: boolean;
  onClick: () => void;
  delay?: number;
}

export function ChoiceCard({ icon, title, isPositive, onClick, delay = 0 }: ChoiceCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center p-6 rounded-3xl border-4 shadow-card',
        'transition-all cursor-pointer focus:outline-none focus:ring-4',
        isPositive
          ? 'bg-success/10 border-success hover:border-success/80 focus:ring-success/50'
          : 'bg-destructive/10 border-destructive hover:border-destructive/80 focus:ring-destructive/50'
      )}
    >
      {/* Icon */}
      <motion.div
        className="text-6xl mb-3"
        animate={{ 
          rotate: isPositive ? [0, -5, 5, 0] : [0, 5, -5, 0],
        }}
        transition={{ repeat: Infinity, duration: 2, delay: delay + 0.5 }}
      >
        {icon}
      </motion.div>

      {/* Title */}
      <span className="font-bold text-lg text-center text-foreground">
        {title}
      </span>

      {/* Glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className={cn(
          'absolute inset-0 rounded-3xl -z-10',
          isPositive ? 'shadow-[0_0_30px_hsl(142,70%,50%,0.3)]' : 'shadow-[0_0_30px_hsl(10,70%,55%,0.3)]'
        )}
      />
    </motion.button>
  );
}
