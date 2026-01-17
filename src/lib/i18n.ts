// Internationalization structure for future multi-language support
// Currently only Bahasa Indonesia is active

export type Language = 'id' | 'en';

export const defaultLanguage: Language = 'id';

export const translations = {
  id: {
    // App
    appName: 'Sahabat Bumi',
    tagline: 'Ayo jadi sahabat alam! 🌍',
    
    // Common
    play: 'Main',
    start: 'Mulai',
    back: 'Kembali',
    next: 'Lanjut',
    close: 'Tutup',
    yes: 'Ya',
    no: 'Tidak',
    loading: 'Memuat...',
    
    // Home
    welcomeBack: 'Selamat datang kembali',
    newPlayer: 'Pemain Baru',
    continueGame: 'Lanjutkan',
    startAdventure: 'Mulai Petualangan',
    enterName: 'Siapa namamu?',
    namePlaceholder: 'Ketik namamu...',
    
    // World Map
    worldMap: 'Peta Dunia',
    exploreWorld: 'Jelajahi Dunia Sahabat Bumi',
    
    // Areas
    forest: 'Hutan',
    river: 'Sungai',
    village: 'Desa',
    city: 'Kota',
    ocean: 'Laut',
    
    forestDesc: 'Rumah Bimo si Beruang',
    riverDesc: 'Tempat Lila si Ikan bermain',
    villageDesc: 'Desa tempat Rani tinggal',
    cityDesc: 'Kota yang sibuk',
    oceanDesc: 'Laut yang luas dan indah',
    
    // Characters
    bimo: 'Bimo',
    lila: 'Lila',
    rani: 'Rani',
    
    bimoGreeting: 'Halo! Aku Bimo si Beruang! 🐻',
    lilaGreeting: 'Hai! Aku Lila si Ikan! 🐟',
    raniGreeting: 'Halo teman! Aku Rani! 👧',
    
    // Forest interactions
    forestWelcome: 'Selamat datang di hutan! Ayo kita jaga hutan bersama!',
    chooseWisely: 'Pilih dengan bijak ya!',
    
    protectTrees: 'Lindungi Pohon',
    cutTrees: 'Tebang Pohon',
    
    protectTreesResult: 'Hutan sehat → wisata datang → orang bekerja → desa jadi bahagia 😊',
    cutTreesResult: 'Hutan rusak → banjir terjadi → hewan sedih → semua susah 😢',
    
    // Mini games
    plantingGame: 'Menanam Pohon',
    plantingGameDesc: 'Ayo tanam pohon untuk hutan!',
    tapToPlant: 'Ketuk untuk menanam! 🌱',
    treesPlanted: 'Pohon ditanam',
    greatJob: 'Bagus sekali!',
    keepPlanting: 'Ayo tanam lagi!',
    
    // Progress
    stars: 'Bintang',
    level: 'Level',
    badges: 'Lencana',
    progress: 'Kemajuan',
    
    // Badges
    firstTreeBadge: 'Penanam Pertama',
    firstTreeBadgeDesc: 'Menanam pohon pertama',
    forestFriendBadge: 'Sahabat Hutan',
    forestFriendBadgeDesc: 'Menjelajahi hutan',
    
    // Parent mode
    parentMode: 'Mode Orang Tua',
    enterParentCode: 'Masukkan kode orang tua',
    parentCodeHint: 'Kode: 1234',
    unlock: 'Buka',
    wrongCode: 'Kode salah',
    
    areasExplored: 'Area Dijelajahi',
    choicesMade: 'Pilihan Dibuat',
    topicsLearned: 'Topik Dipelajari',
    
    // Settings
    settings: 'Pengaturan',
    sound: 'Suara',
    soundOn: 'Nyala',
    soundOff: 'Mati',
    
    // Emotions
    happy: 'Senang 😊',
    sad: 'Sedih 😢',
    proud: 'Bangga 🌟',
    
    // Encouragements
    awesome: 'Luar biasa!',
    wellDone: 'Bagus sekali!',
    keepGoing: 'Ayo terus!',
    youDidIt: 'Kamu berhasil!',
    tryAgain: 'Coba lagi ya!',
  },
  en: {
    // English translations for future use
    appName: 'Earth Friend',
    tagline: "Let's be nature's friend! 🌍",
    play: 'Play',
    start: 'Start',
    back: 'Back',
    // ... rest would be added when multi-language is needed
  }
} as const;

export type TranslationKey = keyof typeof translations.id;

export function t(key: TranslationKey, lang: Language = 'id'): string {
  return translations[lang]?.[key] || translations.id[key] || key;
}

// Hook-like function for use in components
export function useTranslation(lang: Language = 'id') {
  return {
    t: (key: TranslationKey) => t(key, lang),
    lang,
  };
}
