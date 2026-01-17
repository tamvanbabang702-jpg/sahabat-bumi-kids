import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KidButton } from '@/components/ui/kid-button';
import { useGameStore } from '@/stores/gameStore';
import { ArrowLeft, Lock, Check, TreePine, Waves, Home, Building2, Fish } from 'lucide-react';

export function ParentModePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const { 
    parentModeUnlocked, 
    unlockParentMode, 
    areas, 
    badges, 
    stars, 
    level,
    playerName,
  } = useGameStore();

  const handleUnlock = () => {
    const success = unlockParentMode(code);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const areaInfo = [
    { id: 'forest', name: 'Hutan', icon: TreePine, color: 'text-primary' },
    { id: 'river', name: 'Sungai', icon: Waves, color: 'text-secondary' },
    { id: 'village', name: 'Desa', icon: Home, color: 'text-village' },
    { id: 'city', name: 'Kota', icon: Building2, color: 'text-city' },
    { id: 'ocean', name: 'Laut', icon: Fish, color: 'text-ocean' },
  ] as const;

  const topicsLearned = [
    { topic: 'Pentingnya menjaga hutan', learned: areas.forest.explored },
    { topic: 'Akibat penebangan liar', learned: areas.forest.choicesMade.length > 0 },
    { topic: 'Menanam pohon', learned: areas.forest.treesPlanted > 0 },
    { topic: 'Kebersihan sungai', learned: areas.river.explored },
    { topic: 'Daur ulang sampah', learned: areas.city.explored },
  ];

  if (!parentModeUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted to-background flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center">
          <KidButton variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6" />
          </KidButton>
        </div>

        {/* Lock screen */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-card p-8 rounded-3xl shadow-card text-center"
          >
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="text-6xl mb-4"
            >
              🔒
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Mode Orang Tua
            </h2>
            <p className="text-muted-foreground mb-6">
              Masukkan kode untuk melihat kemajuan anak
            </p>

            <div className="space-y-4">
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Masukkan kode..."
                className={`w-full px-6 py-4 text-xl text-center font-semibold rounded-2xl border-4 focus:outline-none bg-background transition-colors ${
                  error 
                    ? 'border-destructive text-destructive' 
                    : 'border-muted focus:border-primary'
                }`}
                maxLength={10}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive font-semibold"
                >
                  Kode salah!
                </motion.p>
              )}

              <KidButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleUnlock}
              >
                <Lock className="w-5 h-5 mr-2" />
                Buka
              </KidButton>

              <p className="text-xs text-muted-foreground">
                Petunjuk: Kode adalah 1234
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <KidButton variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6" />
          </KidButton>
          
          <h1 className="text-xl font-bold text-foreground">Mode Orang Tua</h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Player Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-3xl shadow-card"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span>👤</span> Profil Pemain
          </h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-primary">{playerName || '-'}</div>
              <div className="text-sm text-muted-foreground">Nama</div>
            </div>
            <div className="bg-accent/20 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-accent-foreground">{stars}</div>
              <div className="text-sm text-muted-foreground">Bintang</div>
            </div>
            <div className="bg-secondary/20 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-secondary">Level {level}</div>
              <div className="text-sm text-muted-foreground">Tingkat</div>
            </div>
          </div>
        </motion.section>

        {/* Areas Explored */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-3xl shadow-card"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span>🗺️</span> Area Dijelajahi
          </h2>
          
          <div className="space-y-3">
            {areaInfo.map(({ id, name, icon: Icon, color }) => {
              const area = areas[id];
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 bg-muted rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${color}`} />
                    <span className="font-semibold">{name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Kesehatan: {area.health}%
                    </div>
                    {area.explored ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Choices Made */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-6 rounded-3xl shadow-card"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span>🎯</span> Pilihan Dibuat
          </h2>
          
          {Object.entries(areas).map(([areaId, area]) => {
            if (area.choicesMade.length === 0) return null;
            
            const info = areaInfo.find(a => a.id === areaId);
            
            return (
              <div key={areaId} className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">{info?.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {area.choicesMade.map((choice, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        choice === 'protect' || choice === 'clean'
                          ? 'bg-success/20 text-success'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {choice === 'protect' ? 'Melindungi' : 'Menebang'}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          
          {Object.values(areas).every(a => a.choicesMade.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              Belum ada pilihan yang dibuat
            </p>
          )}
        </motion.section>

        {/* Topics Learned */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-6 rounded-3xl shadow-card"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span>📚</span> Topik Dipelajari
          </h2>
          
          <div className="space-y-2">
            {topicsLearned.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  item.learned ? 'bg-success/10' : 'bg-muted'
                }`}
              >
                <span className={item.learned ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.topic}
                </span>
                {item.learned && <Check className="w-5 h-5 text-success" />}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Badges */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card p-6 rounded-3xl shadow-card"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span>🏆</span> Lencana ({badges.length})
          </h2>
          
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl"
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {badge.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Belum ada lencana yang diperoleh
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
}

export default ParentModePage;
