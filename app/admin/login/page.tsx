// // app/admin/login/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function AdminLoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const search = useSearchParams();
//   const next = search.get("next") || "/admin";

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });
//       if (!res.ok) {
//         const { error } = await res.json().catch(() => ({ error: "Login failed" }));
//         throw new Error(error || "Login failed");
//       }
//       router.replace(next);
//       router.refresh();
//     } catch (err: any) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border p-6 rounded-2xl shadow">
//         <h1 className="text-2xl font-semibold">Admin Login</h1>

//         <div className="space-y-1">
//           <label className="block text-sm">Username</label>
//           <input
//             className="w-full border rounded-lg p-2"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//             autoComplete="username"
//             required
//           />
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm">Password</label>
//           <input
//             className="w-full border rounded-lg p-2"
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             autoComplete="current-password"
//             required
//           />
//         </div>

//         {error && <p className="text-sm text-red-600">{error}</p>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-2xl p-2 border disabled:opacity-60"
//         >
//           {loading ? "Signing in..." : "Sign in"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User2, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // const router = useRouter();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const search = useSearchParams();
  const next = "/admin/products";

  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   setError(null);

  //   if (!username.trim() || !password) {
  //     setError("Username and password are required.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const res = await fetch("/api/admin/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ username: username.trim(), password }),
  //     });
  //     if (!res.ok) {
  //       const msg = await res.text();
  //       throw new Error(msg || `HTTP ${res.status}`);
  //     }
  //     // success => cookie set by server; redirect
  //     router.replace("/admin/transportations");
  //   } catch (err: any) {
  //     setError(err?.message || "Login failed.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log({
      "email": username,
      "password": password
    })

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Login failed" }));
        throw new Error(JSON.parse(error).message || "Login failed");
      }
      router.replace(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      {/* subtle grid like hero, very faint */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center justify-center gap-3">
          <Image src="/logoCar.png" alt="logo" width={56} height={56} className="h-14 w-14 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-sm text-white/60">Restricted area • Authorized personnel only</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          {/* Username */}
          <label className="mb-2 block text-sm font-medium">Username</label>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2">
            <User2 className="h-4 w-4 text-white/60" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <label className="mb-2 block text-sm font-medium">Password</label>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2">
            <Lock className="h-4 w-4 text-white/60" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="text-xs text-white/60 hover:text-white"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign in"}
            <motion.span
              initial={{ left: "-120%" }}
              whileHover={{ left: "130%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-[40%] skew-x-12 bg-white/20 mix-blend-overlay"
            />
          </button>

          <p className="mt-3 text-center text-xs text-white/50">
            Forgot credentials? Contact your site administrator.
          </p>
        </form>
      </motion.div>
    </div>
  );
}