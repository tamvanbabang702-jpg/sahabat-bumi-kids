import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGameStore, AreaId } from '@/stores/gameStore';
import { TreePine, Waves, Home, Building2, Fish, Lock } from 'lucide-react';

interface AreaCardProps {
  areaId: AreaId;
  name: string;
  description: string;
  isLocked?: boolean;
  onClick: () => void;
}

const areaIcons: Record<AreaId, React.ReactNode> = {
  forest: <TreePine className="w-10 h-10" />,
  river: <Waves className="w-10 h-10" />,
  village: <Home className="w-10 h-10" />,
  city: <Building2 className="w-10 h-10" />,
  ocean: <Fish className="w-10 h-10" />,
};

const areaColors: Record<AreaId, string> = {
  forest: 'from-primary to-primary/80 border-primary',
  river: 'from-secondary to-secondary/80 border-secondary',
  village: 'from-village to-village/80 border-village',
  city: 'from-city to-city/80 border-city',
  ocean: 'from-ocean to-ocean/80 border-ocean',
};

const areaBgColors: Record<AreaId, string> = {
  forest: 'bg-primary/10',
  river: 'bg-secondary/10',
  village: 'bg-village/10',
  city: 'bg-city/10',
  ocean: 'bg-ocean/10',
};

export function AreaCard({ areaId, name, description, isLocked = false, onClick }: AreaCardProps) {
  const area = useGameStore((s) => s.areas[areaId]);
  const healthPercent = area.health;

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      className={cn(
        'relative overflow-hidden rounded-3xl p-5 text-left w-full',
        'border-4 shadow-card transition-all',
        'focus:outline-none focus:ring-4 focus:ring-accent',
        isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        areaBgColors[areaId],
        areaColors[areaId].split(' ')[1]
      )}
    >
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
          <Lock className="w-12 h-12 text-foreground" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-0">
        {/* Icon */}
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-3',
          'bg-gradient-to-br shadow-lg',
          areaColors[areaId].split(' ')[0],
          areaColors[areaId].split(' ')[1],
          'text-white'
        )}>
          {areaIcons[areaId]}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-3">{description}</p>

        {/* Health Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Kesehatan</span>
            <span>{healthPercent}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full',
                healthPercent >= 70 ? 'bg-success' : healthPercent >= 40 ? 'bg-warning' : 'bg-destructive'
              )}
            />
          </div>
        </div>

        {/* Explored indicator */}
        {area.explored && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 text-2xl"
          >
            ✅
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
