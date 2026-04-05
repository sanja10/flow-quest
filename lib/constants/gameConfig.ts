export const GAME_CONFIG = {
  xp: {
    base: {
      EASY: 25,
      MEDIUM: 50,
      HARD: 100,
    },
    deadlineBonus: 0.2, // +20% if completed before deadline
    deadlinePenalty: 0.5, // -50% if completed after deadline
    streakBonus: 5, // XP per streak day
    maxStreakBonus: 50,
  },
  hp: {
    max: 100,
    decayOnMissedDeadline: 10,
    decayOnInactiveDay: 5,
    regenOnComplete: 10,
  },
  level: {
    // formula: level * level * 100
    xpForLevel: (level: number) => level * level * 100,
  },
} as const;
