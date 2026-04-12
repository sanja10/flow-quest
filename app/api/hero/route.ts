import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { calculateLevelFromXp, xpForNextLevel } from "@/lib/services/xpService";

function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  return verifyAccessToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getUserFromRequest(req);

    const heroStats = await prisma.heroStats.findUnique({ where: { userId } });

    if (!heroStats) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Hero not found" } },
        { status: 404 },
      );
    }

    const level = calculateLevelFromXp(heroStats.xp);
    const nextLevelXp = xpForNextLevel(level);

    return NextResponse.json({
      heroStats: {
        ...heroStats,
        level,
        nextLevelXp,
      },
    });
  } catch {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 },
    );
  }
}
