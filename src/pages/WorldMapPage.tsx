import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KidButton } from '@/components/ui/kid-button';
import { AreaCard } from '@/components/AreaCard';
import { StarCounter } from '@/components/StarCounter';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

import worldMapBg from '@/assets/world-map.png';

export function WorldMapPage() {
  const navigate = useNavigate();
  const { playerName } = useGameStore();

  const areas = [
    { id: 'forest' as const, name: 'Hutan', description: 'Rumah Bimo si Beruang 🐻', locked: false },
    { id: 'river' as const, name: 'Sungai', description: 'Tempat Lila si Ikan bermain 🐟', locked: true },
    { id: 'village' as const, name: 'Desa', description: 'Desa tempat Rani tinggal 👧', locked: true },
    { id: 'city' as const, name: 'Kota', description: 'Kota yang sibuk 🏢', locked: true },
    { id: 'ocean' as const, name: 'Laut', description: 'Laut yang luas dan indah 🌊', locked: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <KidButton variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6" />
          </KidButton>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Peta Dunia</h1>
            <p className="text-sm text-muted-foreground">Halo, {playerName}!</p>
          </div>

          <StarCounter showLevel={true} />
        </div>
      </div>

      {/* World Map Background */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-48 md:h-64 overflow-hidden"
        >
          <img
            src={worldMapBg}
            alt="Peta Dunia Sahabat Bumi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </motion.div>

        {/* Title overlay */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground drop-shadow-lg">
            Jelajahi Dunia Sahabat Bumi 🌍
          </h2>
        </motion.div>
      </div>

      {/* Areas Grid */}
      <div className="p-4 pb-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {areas.map((area, index) => (
            <motion.div
              key={area.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <AreaCard
                areaId={area.id}
                name={area.name}
                description={area.description}
                isLocked={area.locked}
                onClick={() => {
                  if (!area.locked) {
                    navigate(`/area/${area.id}`);
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Coming soon notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-accent/20 px-6 py-3 rounded-full">
            <span className="text-2xl">🚧</span>
            <span className="font-semibold text-accent-foreground">
              Area lain akan segera dibuka!
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WorldMapPage;
