import { GAME_CONFIG } from "@/lib/constants/gameConfig";

export function calculateHpAfterComplete(currentHp: number): number {
  return Math.min(
    currentHp + GAME_CONFIG.hp.regenOnComplete,
    GAME_CONFIG.hp.max,
  );
}

export function calculateHpAfterMissedDeadline(currentHp: number): number {
  return Math.max(currentHp - GAME_CONFIG.hp.decayOnMissedDeadline, 0);
}

export function calculateHpAfterInactiveDay(currentHp: number): number {
  return Math.max(currentHp - GAME_CONFIG.hp.decayOnInactiveDay, 0);
}
