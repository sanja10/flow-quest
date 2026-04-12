"use client";

import { useEffect, useState } from "react";
import { Quest } from "@prisma/client";
import { useAuth } from "@/hooks/useAuth";
import { HeroStats } from "@/components/hero/HeroStats";
import { QuestCard } from "@/components/quests/QuestCard";
import { FlowButton } from "@/components/ui/FlowButton";

interface HeroData {
  xp: number;
  hp: number;
  maxHp: number;
  level: number;
  streak: number;
  nextLevelXp: number;
}

export default function DashboardPage() {
  const { authFetch, logout, token } = useAuth();
  const [hero, setHero] = useState<HeroData | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  async function fetchData() {
    setLoading(true);
    try {
      const [heroRes, questsRes] = await Promise.all([
        authFetch("/api/hero"),
        authFetch("/api/quests"),
      ]);
      const { heroStats } = await heroRes.json();
      const { quests } = await questsRes.json();
      setHero(heroStats);
      setQuests(quests ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(id: string) {
    const res = await authFetch(`/api/quests/${id}/complete`, {
      method: "PATCH",
    });
    const data = await res.json();
    if (res.ok) {
      setHero(data.heroStats);
      setQuests((prev) => prev.map((q) => (q.id === id ? data.quest : q)));
      if (data.leveledUp) setLeveledUp(true);
    }
  }

  async function handleDelete(id: string) {
    const res = await authFetch(`/api/quests/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQuests((prev) => prev.filter((q) => q.id !== id));
    }
  }

  const activeQuests = quests.filter((q) => q.status !== "DONE");
  const completedQuests = quests.filter((q) => q.status === "DONE");

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-label uppercase tracking-widest text-primary-soft animate-pulse">
          Loading quest data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b-4 border-primary px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-xl text-primary">Flow Quest</span>
        <div className="flex items-center gap-6">
          <span className="text-label uppercase tracking-widest text-primary-soft">
            {hero?.level ? `Level ${hero.level} Hero` : ""}
          </span>
          <FlowButton
            variant="secondary"
            onClick={logout}
            className="text-xs py-2"
          >
            Logout
          </FlowButton>
        </div>
      </header>

      {/* Level Up Banner */}
      {leveledUp && (
        <div className="bg-primary text-surface px-8 py-4 flex items-center justify-between">
          <span className="font-bold uppercase tracking-widest">
            ⬆ Level Up! You reached Level {hero?.level}
          </span>
          <button
            onClick={() => setLeveledUp(false)}
            className="text-label uppercase tracking-widest hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-8 py-section grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Hero Stats */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div>
            <span className="text-label uppercase tracking-widest text-primary-soft">
              Hero Status
            </span>
            <h2 className="text-2xl font-bold text-primary border-b-4 border-primary pb-3 mt-1">
              Your Stats
            </h2>
          </div>

          {hero && <HeroStats {...hero} />}
        </div>

        {/* Right — Quests */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-end justify-between border-b-4 border-primary pb-3">
            <div>
              <span className="text-label uppercase tracking-widest text-primary-soft">
                Active
              </span>
              <h2 className="text-2xl font-bold text-primary mt-1">
                Quests ({activeQuests.length})
              </h2>
            </div>
            <FlowButton variant="primary" className="text-xs py-2">
              + New Quest
            </FlowButton>
          </div>

          {/* Active Quests */}
          {activeQuests.length === 0 ? (
            <div className="border-4 border-primary-dark p-8 text-center">
              <p className="text-primary-soft text-sm">
                No active quests. Create one to begin your journey.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Completed Quests */}
          {completedQuests.length > 0 && (
            <>
              <div className="border-b-4 border-primary-dark pb-3 mt-4">
                <span className="text-label uppercase tracking-widest text-primary-soft">
                  Completed ({completedQuests.length})
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {completedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
