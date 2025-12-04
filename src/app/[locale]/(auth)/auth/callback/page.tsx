"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:4002/api/auth/profile", {
      credentials: "include", // 👈 IMPORTANTE: envía la cookie HttpOnly
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((user) => {
        console.log("Usuario autenticado:", user);
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">Validando autenticación…</h2>
    </div>
  );
}
