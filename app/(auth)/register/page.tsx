"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelButton } from "@/components/ui/FlowButton";
import { PixelInput } from "@/components/ui/FlowInput";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
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
    <div className="min-h-screen bg-pq-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm border-2 border-pq-light p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="font-pixel text-pq-gold text-lg">⚔️ Flow Quest</h1>
          <p className="font-pixel text-pq-light text-xs">Create your hero</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <PixelInput
            label="EMAIL"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hero@quest.com"
          />
          <PixelInput
            label="PASSWORD"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
          />
        </div>

        {error && (
          <p className="font-pixel text-xs text-pq-red text-center">{error}</p>
        )}

        <PixelButton onClick={handleRegister} disabled={loading}>
          {loading ? "LOADING..." : "⚔️ CREATE HERO"}
        </PixelButton>

        <p className="font-pixel text-xs text-pq-light text-center">
          Already a hero?{" "}
          <Link href="/login" className="text-pq-gold hover:underline">
            LOGIN
          </Link>
        </p>
      </div>
    </div>
  );
}
