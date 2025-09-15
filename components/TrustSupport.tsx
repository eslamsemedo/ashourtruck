"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Headset,
  RefreshCcw,
  BadgeCheck,
  Lock
} from "lucide-react";
import { useT } from "@/lib/i18n";

// Trust & Support Section
// Theme: Black background, white text, red accents
// Matches the existing Hero / Categories / Best Sellers style

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const card: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

export default function TrustSupport({
  headline = "trustHeadline",
  kicker = "trustKicker",
}: {
  headline?: string;
  kicker?: string;
}) {
  const { t } = useT();
  return (
    <section className="relative w-full bg-black py-20 text-white">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <Pill>
              <BadgeCheck className="h-3.5 w-3.5 text-red-500" /> {t(kicker as any)}
            </Pill>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{t(headline as any)}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">{t('over200kHappy')}</span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">{t('averageRating')}</span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">{t('priceMatchGuarantee')}</span>
          </div>
        </motion.div>

        {/* Trust cards */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <motion.li variants={card} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60">
                <ShieldCheck className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t('warranty2Year')}</h3>
                <p className="mt-1 text-sm text-white/70">{t('warrantyDesc')}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-45 bg-red-600/20 blur-2xl" />
          </motion.li>

          <motion.li variants={card} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60">
                <Truck className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t('fastFreeShipping')}</h3>
                <p className="mt-1 text-sm text-white/70">{t('shippingDesc')}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-45 bg-red-600/20 blur-2xl" />
          </motion.li>

          <motion.li variants={card} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60">
                <CreditCard className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t('securePayments')}</h3>
                <p className="mt-1 text-sm text-white/70">{t('paymentsDesc')}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-45 bg-red-600/20 blur-2xl" />
          </motion.li>

          <motion.li variants={card} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60">
                <Headset className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t('expertSupport')}</h3>
                <p className="mt-1 text-sm text-white/70">{t('supportDesc')}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-45 bg-red-600/20 blur-2xl" />
          </motion.li>

          <motion.li variants={card} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60">
                <RefreshCcw className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t('easyReturnsTitle')}</h3>
                <p className="mt-1 text-sm text-white/70">{t('returnsDesc')}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-45 bg-red-600/20 blur-2xl" />
          </motion.li>

          <motion.li variants={card} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60">
                <Lock className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t('priceMatchTitle')}</h3>
                <p className="mt-1 text-sm text-white/70">{t('priceMatchDesc')}</p>
              </div>
            </div>
            <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rotate-45 bg-red-600/20 blur-2xl" />
          </motion.li>
        </motion.ul>

        {/* Bottom CTA ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55 }}
          className="mt-10 overflow-hidden rounded-xl border border-white/10"
        >
          <div className="flex flex-col items-center justify-between gap-3 bg-white/5 px-4 py-4 text-sm text-white/80 backdrop-blur md:flex-row">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red-500" />
              <span>
                {t('driveWithConfidence')} <b className="text-white">{t('warrantyText')}</b>, <b className="text-white">{t('secureCheckoutText')}</b>, and <b className="text-white">{t('expertSupport2')}</b> {t('onEveryOrder')}
              </span>
            </div>
            <a
              href="#support"
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
            >
              {t('getHelpNow')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}