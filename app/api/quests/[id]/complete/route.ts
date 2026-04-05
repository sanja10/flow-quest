import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import {
  calculateXpReward,
  calculateLevelFromXp,
} from "@/lib/services/xpService";
import { calculateHpAfterComplete } from "@/lib/services/hpService";
import { calculateStreak } from "@/lib/services/streakService";

function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  return verifyAccessToken(token);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = getUserFromRequest(req);

    const quest = await prisma.quest.findUnique({ where: { id: params.id } });

    if (!quest || quest.userId !== userId) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Quest not found" } },
        { status: 404 },
      );
    }

    // Idempotentnost — ne može se kompletirati dva puta
    if (quest.status === "DONE") {
      return NextResponse.json(
        {
          error: {
            code: "ALREADY_COMPLETED",
            message: "Quest already completed",
          },
        },
        { status: 409 },
      );
    }

    const heroStats = await prisma.heroStats.findUnique({ where: { userId } });
    if (!heroStats) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Hero not found" } },
        { status: 404 },
      );
    }

    const completedAt = new Date();

    // Kalkulacije
    const { xp: xpGained, reason } = calculateXpReward(
      quest.difficulty,
      quest.deadline,
      completedAt,
      heroStats.streak,
    );

    const newXp = heroStats.xp + xpGained;
    const newHp = calculateHpAfterComplete(heroStats.hp);
    const newStreak = calculateStreak(heroStats.lastActive, heroStats.streak);
    const newLevel = calculateLevelFromXp(newXp);
    const leveledUp = newLevel > heroStats.level;

    // Transakcija — sve ili ništa
    const [updatedQuest, updatedHero] = await prisma.$transaction([
      prisma.quest.update({
        where: { id: params.id },
        data: { status: "DONE", completedAt },
      }),
      prisma.heroStats.update({
        where: { userId },
        data: {
          xp: newXp,
          hp: newHp,
          level: newLevel,
          streak: newStreak,
          lastActive: completedAt,
        },
      }),
      prisma.xpLog.create({
        data: { userId, questId: quest.id, xpGained, reason },
      }),
    ]);

    return NextResponse.json({
      quest: updatedQuest,
      heroStats: updatedHero,
      xpGained,
      leveledUp,
      reason,
    });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 },
    );
  }
}
