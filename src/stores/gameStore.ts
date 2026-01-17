import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AreaId = 'forest' | 'river' | 'village' | 'city' | 'ocean';

export interface AreaProgress {
  explored: boolean;
  completed: boolean;
  health: number; // 0-100
  choicesMade: string[];
  treesPlanted: number;
  trashCleaned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

export interface GameState {
  // Player info
  playerName: string;
  setPlayerName: (name: string) => void;

  // Progress
  stars: number;
  addStars: (amount: number) => void;
  
  level: number;
  experience: number;
  addExperience: (amount: number) => void;

  // Areas
  areas: Record<AreaId, AreaProgress>;
  updateAreaHealth: (area: AreaId, health: number) => void;
  markAreaExplored: (area: AreaId) => void;
  markAreaCompleted: (area: AreaId) => void;
  addChoice: (area: AreaId, choice: string) => void;
  plantTree: (area: AreaId) => void;
  cleanTrash: (area: AreaId) => void;

  // Badges
  badges: Badge[];
  earnBadge: (badge: Badge) => void;

  // Settings
  soundEnabled: boolean;
  toggleSound: () => void;

  // Parent mode
  parentModeUnlocked: boolean;
  unlockParentMode: (code: string) => boolean;

  // Reset
  resetGame: () => void;
}

const initialAreas: Record<AreaId, AreaProgress> = {
  forest: { explored: false, completed: false, health: 50, choicesMade: [], treesPlanted: 0, trashCleaned: 0 },
  river: { explored: false, completed: false, health: 50, choicesMade: [], treesPlanted: 0, trashCleaned: 0 },
  village: { explored: false, completed: false, health: 50, choicesMade: [], treesPlanted: 0, trashCleaned: 0 },
  city: { explored: false, completed: false, health: 50, choicesMade: [], treesPlanted: 0, trashCleaned: 0 },
  ocean: { explored: false, completed: false, health: 50, choicesMade: [], treesPlanted: 0, trashCleaned: 0 },
};

// Area unlock order
export const areaOrder: AreaId[] = ['forest', 'river', 'village', 'city', 'ocean'];

export function isAreaUnlocked(areas: Record<AreaId, AreaProgress>, areaId: AreaId): boolean {
  const index = areaOrder.indexOf(areaId);
  if (index === 0) return true; // Forest is always unlocked
  const previousArea = areaOrder[index - 1];
  return areas[previousArea].completed;
}

const PARENT_CODE = '1234';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerName: '',
      setPlayerName: (name) => set({ playerName: name }),

      stars: 0,
      addStars: (amount) => set((state) => ({ stars: state.stars + amount })),

      level: 1,
      experience: 0,
      addExperience: (amount) => {
        const state = get();
        const newExp = state.experience + amount;
        const expNeeded = state.level * 100;
        
        if (newExp >= expNeeded) {
          set({ 
            experience: newExp - expNeeded, 
            level: state.level + 1 
          });
        } else {
          set({ experience: newExp });
        }
      },

      areas: initialAreas,
      updateAreaHealth: (area, health) => set((state) => ({
        areas: {
          ...state.areas,
          [area]: { ...state.areas[area], health: Math.max(0, Math.min(100, health)) }
        }
      })),
      markAreaExplored: (area) => set((state) => ({
        areas: {
          ...state.areas,
          [area]: { ...state.areas[area], explored: true }
        }
      })),
      markAreaCompleted: (area) => set((state) => ({
        areas: {
          ...state.areas,
          [area]: { ...state.areas[area], completed: true }
        }
      })),
      addChoice: (area, choice) => set((state) => ({
        areas: {
          ...state.areas,
          [area]: { 
            ...state.areas[area], 
            choicesMade: [...state.areas[area].choicesMade, choice] 
          }
        }
      })),
      plantTree: (area) => set((state) => ({
        areas: {
          ...state.areas,
          [area]: { 
            ...state.areas[area], 
            treesPlanted: state.areas[area].treesPlanted + 1,
            health: Math.min(100, state.areas[area].health + 5)
          }
        }
      })),
      cleanTrash: (area) => set((state) => ({
        areas: {
          ...state.areas,
          [area]: { 
            ...state.areas[area], 
            trashCleaned: state.areas[area].trashCleaned + 1,
            health: Math.min(100, state.areas[area].health + 3)
          }
        }
      })),

      badges: [],
      earnBadge: (badge) => set((state) => {
        if (state.badges.some(b => b.id === badge.id)) return state;
        return { badges: [...state.badges, { ...badge, earnedAt: new Date() }] };
      }),

      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      parentModeUnlocked: false,
      unlockParentMode: (code) => {
        if (code === PARENT_CODE) {
          set({ parentModeUnlocked: true });
          return true;
        }
        return false;
      },

      resetGame: () => set({
        playerName: '',
        stars: 0,
        level: 1,
        experience: 0,
        areas: initialAreas,
        badges: [],
        parentModeUnlocked: false,
      }),
    }),
    {
      name: 'sahabat-bumi-game',
    }
  )
);
