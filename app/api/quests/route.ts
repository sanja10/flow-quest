import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { Difficulty } from "@prisma/client";

const createQuestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty).default("MEDIUM"),
  deadline: z.string().datetime().optional().nullable(),
  xpReward: z.number().optional(),
});

function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  return verifyAccessToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getUserFromRequest(req);

    const quests = await prisma.quest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quests });
  } catch {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getUserFromRequest(req);
    const body = await req.json();
    const data = createQuestSchema.parse(body);

    const quest = await prisma.quest.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        deadline: data.deadline ? new Date(data.deadline) : null,
        xpReward: data.xpReward ?? 50,
      },
    });

    return NextResponse.json({ quest }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: error.message } },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 },
    );
  }
}
