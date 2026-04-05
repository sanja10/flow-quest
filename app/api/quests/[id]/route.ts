import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { Difficulty, Status } from "@prisma/client";

const updateQuestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  deadline: z.string().datetime().optional().nullable(),
  status: z.nativeEnum(Status).optional(),
});

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
    const body = await req.json();
    const data = updateQuestSchema.parse(body);

    const quest = await prisma.quest.findUnique({ where: { id: params.id } });

    if (!quest || quest.userId !== userId) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Quest not found" } },
        { status: 404 },
      );
    }

    const updated = await prisma.quest.update({
      where: { id: params.id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    });

    return NextResponse.json({ quest: updated });
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

export async function DELETE(
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

    await prisma.quest.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 },
    );
  }
}
