"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("accessToken");
    if (!stored) {
      router.push("/login");
      return;
    }
    setToken(stored);
  }, [router]);

  function logout() {
    localStorage.removeItem("accessToken");
    fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function authFetch(url: string, options: RequestInit = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Access token istekao — probaj refresh
    if (res.status === 401) {
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        localStorage.setItem("accessToken", accessToken);
        setToken(accessToken);

        // Ponovi originalni request sa novim tokenom
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        logout();
      }
    }

    return res;
  }

  return { token, logout, authFetch };
}
