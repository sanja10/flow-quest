"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelButton } from "@/components/ui/FlowButton";
import { PixelInput } from "@/components/ui/FlowInput";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error.message);
        return;
      }
      localStorage.setItem("accessToken", data.accessToken);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left — dekorativni monolith */}
      <div className="hidden lg:flex w-1/2 border-r-4 border-primary flex-col justify-between p-section">
        <span className="text-label uppercase tracking-widest text-primary-soft">
          PixelQuest / v1.0
        </span>
        <div>
          <h1 className="text-display font-bold text-primary leading-none">
            TURN
            <br />
            TASKS
            <br />
            INTO
            <br />
            QUESTS.
          </h1>
        </div>
        <span className="text-label uppercase tracking-widest text-primary-soft">
          AI-Powered Gamified Productivity
        </span>
      </div>

      {/* Right — forma */}
      <div className="w-full lg:w-1/2 flex items-center justify-start p-12 lg:p-20">
        <div className="w-full max-w-sm flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-label uppercase tracking-widest text-primary-soft">
              Welcome back
            </span>
            <h2 className="text-4xl font-bold text-primary border-b-4 border-primary pb-4">
              Login
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <PixelInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@quest.com"
            />
            <PixelInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-label uppercase tracking-widest text-red-400">
              ⚠ {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <PixelButton
              onClick={handleLogin}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Start Quest →"}
            </PixelButton>

            <p className="text-sm text-primary-soft">
              New hero?{" "}
              <Link
                href="/register"
                className="text-primary font-bold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
