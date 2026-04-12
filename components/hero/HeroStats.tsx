"use client";

interface HeroStatsProps {
  xp: number;
  hp: number;
  maxHp: number;
  level: number;
  streak: number;
  nextLevelXp: number;
}

export function HeroStats({
  xp,
  hp,
  maxHp,
  level,
  streak,
  nextLevelXp,
}: HeroStatsProps) {
  const hpPercent = Math.round((hp / maxHp) * 100);
  const xpPercent = Math.round((xp / nextLevelXp) * 100);

  return (
    <div className="border-4 border-primary p-6 flex flex-col gap-6 translate-x-[-4px] translate-y-[-4px] shadow-[4px_4px_0px_#466739]">
      {/* Level i Streak */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-label uppercase tracking-widest text-primary-soft">
            Level
          </span>
          <p className="text-5xl font-bold text-primary">{level}</p>
        </div>
        <div className="text-right">
          <span className="text-label uppercase tracking-widest text-primary-soft">
            Streak
          </span>
          <p className="text-5xl font-bold text-primary">{streak}d</p>
        </div>
      </div>

      {/* HP Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-label uppercase tracking-widest text-primary-soft">
            HP
          </span>
          <span className="text-label text-primary">
            {hp} / {maxHp}
          </span>
        </div>
        <div className="w-full h-4 bg-surface-low border-4 border-primary-dark">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* XP Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-label uppercase tracking-widest text-primary-soft">
            XP
          </span>
          <span className="text-label text-primary">
            {xp} / {nextLevelXp}
          </span>
        </div>
        <div className="w-full h-4 bg-surface-low border-4 border-primary-dark">
          <div
            className="h-full bg-primary-soft transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
