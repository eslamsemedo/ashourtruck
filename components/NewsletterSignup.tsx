"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, Gift, BellRing } from "lucide-react";

// Newsletter Signup (with perks)
// Theme: pure black background, white text, red accents
// Includes: perk bullets, email capture, success state, lightweight validation

type Props = {
  headline?: string;
  tagline?: string;
  onSubmitEmail?: (email: string) => Promise<void> | void; // hook into your API
};

export default function NewsletterSignup({
  headline = "Join the RPM Club",
  tagline = "Get 10% off your first order + exclusive deals",
  onSubmitEmail,
}: Props) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = React.useState<string>("");

  const validate = (val: string) =>
    /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(val.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      setStatus("loading");
      await onSubmitEmail?.(email.trim());
      // fallback demo delay
      if (!onSubmitEmail) await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="relative w-full bg-black py-20 text-white">
      {/* subtle red glow accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-red-600/10 blur-[60px]" />
        <div className="absolute bottom-0 right-10 h-32 w-32 rotate-45 bg-red-600/20 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <BellRing className="h-3.5 w-3.5 text-red-500" /> Stay in the loop
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{headline}</h2>
          <p className="mt-2 text-white/70">{tagline}</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 items-center gap-4 sm:grid-cols-5">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="sm:col-span-3">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/15 bg-black/60 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-red-500/60"
                  />
                </div>
                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Subscribing…
                    </span>
                  ) : (
                    <>
                      <span>Get my 10% off</span>
                    </>
                  )}
                </button>
              </div>

              {/* perks */}
              <div className="sm:col-span-5">
                <ul className="mt-2 grid grid-cols-1 gap-2 text-xs text-white/70 sm:grid-cols-3">
                  <li className="inline-flex items-center gap-2"><Gift className="h-4 w-4 text-red-500" /> Exclusive deals & early access</li>
                  <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-red-500" /> Tips from pro tuners</li>
                  <li className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-red-500" /> No spam — unsubscribe anytime</li>
                </ul>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <ShieldCheck className="h-3.5 w-3.5 text-red-500" /> You're in
              </div>
              <h3 className="text-xl font-bold">Welcome to the RPM Club</h3>
              <p className="max-w-xl text-sm text-white/70">
                Check your inbox for a confirmation email. Your one‑time 10% code will arrive shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/25 hover:bg-white/10"
              >
                Subscribe another email
              </button>
            </div>
          )}
        </motion.div>

        {/* compliance note */}
        <p className="mx-auto mt-4 max-w-4xl text-center text-[11px] leading-relaxed text-white/50">
          By subscribing, you agree to receive marketing emails from us. You can unsubscribe anytime. We respect your privacy and never share your data.
        </p>
      </div>
    </section>
  );
}