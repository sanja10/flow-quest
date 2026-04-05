export function calculateStreak(
  lastActive: Date,
  currentStreak: number,
): number {
  const now = new Date();
  const lastActiveDate = new Date(lastActive);

  const diffInDays = Math.floor(
    (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  //   same day, streak stays the same
  if (diffInDays === 0) return currentStreak;
  //   next day, streak increases
  if (diffInDays === 1) return currentStreak + 1;
  //   missed a day, streak drops to 0
  return 0;
}
