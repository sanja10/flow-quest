import { Difficulty } from "@prisma/client";
import { GAME_CONFIG } from "@/lib/constants/gameConfig";

export function calculateXpReward(
  difficulty: Difficulty,
  deadline: Date | null,
  completedAt: Date,
  streak: number,
): { xp: number; reason: string } {
  const base = GAME_CONFIG.xp.base[difficulty];

  let multiplier = 1;
  let reason = `${difficulty} quest completed`;

  if (deadline) {
    if (completedAt < deadline) {
      multiplier += GAME_CONFIG.xp.deadlineBonus;
      reason += " (early bonus +20%)";
    } else if (completedAt > deadline) {
      multiplier -= GAME_CONFIG.xp.deadlinePenalty;
      reason += " (late penalty -50%)";
    }
  }

  const streakBonus = Math.min(
    streak * GAME_CONFIG.xp.streakBonus,
    GAME_CONFIG.xp.maxStreakBonus,
  );

  const xp = Math.max(Math.floor(base * multiplier) + streakBonus, 1);

  if (streakBonus > 0) {
    reason += ` (streak bonus +${streakBonus})`;
  }

  return { xp, reason };
}

export function calculateLevelFromXp(totalXp: number): number {
  let level = 1;
  while (totalXp >= GAME_CONFIG.level.xpForLevel(level)) {
    level++;
  }
  return level - 1 || 1;
}

export function xpForNextLevel(currentLevel: number): number {
  return GAME_CONFIG.level.xpForLevel(currentLevel + 1);
}
