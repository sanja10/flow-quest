import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const oldRefreshToken = req.cookies.get("refreshToken")?.value;

    if (!oldRefreshToken) {
      return NextResponse.json(
        { error: { code: "MISSING_TOKEN", message: "No refresh token" } },
        { status: 401 },
      );
    }

    // Proveri da li token postoji u bazi
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: { code: "INVALID_TOKEN", message: "Invalid or expired token" },
        },
        { status: 401 },
      );
    }

    // Verifikuj JWT
    const payload = verifyRefreshToken(oldRefreshToken);

    // Rotacija — obrisi stari, napravi novi
    await prisma.refreshToken.delete({ where: { token: oldRefreshToken } });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
    });

    await prisma.refreshToken.create({
      data: {
        userId: payload.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    });

    const response = NextResponse.json({ accessToken });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_TOKEN", message: "Invalid token" } },
      { status: 401 },
    );
  }
}
