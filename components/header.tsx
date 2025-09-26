"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/state/store"; // <- adjust if your store path differs
import { motion } from "framer-motion";
import { Car, Menu, X, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleLanguage } from "@/app/state/lang/langSlice";
import { useT } from "@/lib/i18n";
import Image from "next/image";

// Header / Navbar with animated Shop button + Cart badge
// Theme: black background, white text, red accents

const nav = [
  { href: "/#featured-categories", key: "featured" },
  { href: "/#best-sellers", key: "bestSellers" },
  { href: "/#trust-support", key: "trustSupport" },
  { href: "/#blog-news", key: "blogNews" },
  { href: "/#newsletter-signup", key: "newsletterSignup" },
] as const;

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle hash links
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/', '');
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`text-sm ${active ? "text-white" : "text-white/70 hover:text-white"}`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = React.useState(false);
  // pull count from Redux (update selector according to your slice)
  const itemCount = useSelector((s: RootState) => s.cart.items.length)
  const dispatch = useDispatch();
  const { t, code } = useT();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur overflow-hidden ">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <Image
            src={"/logoCar.png"}  // Your logo path
            alt="logo"
            height={40}
            width={40}
            className="w-auto "  // Adjusted logo size
          />
          <span className="text-lg font-bold text-white">{t('brand')}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <NavLink key={n.href} href={n.href}>
              {t(n.key as any)}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Shop CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
            >
              <span>{t('shop')}</span>
              <ShoppingCart className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <motion.span
                initial={{ left: "-120%" }}
                whileHover={{ left: "120%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-0 left-0 w-[40%] skew-x-12 bg-white/20 mix-blend-overlay"
              />
            </Link>
          </motion.div>

          {/* Cart Button */}
          <Link
            href="/shop/cart"
            className="relative inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/25 hover:bg-white/10"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{t('cart')}</span>
            {itemCount > 0 && (
              <span
                aria-label={`${itemCount} items in cart`}
                className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold leading-none"
              >
                {itemCount}
              </span>
            )}
          </Link>
          {/* Language toggle */}
          <button
            onClick={() => dispatch(toggleLanguage())}
            className="inline-flex items-center rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-white/25 hover:bg-white/10"
            aria-label="Toggle language"
          >
            {code === 'en' ? 'AR' : 'EN'}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center rounded-lg p-2 text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <motion.nav
          id="mobile-nav"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-2 border-t border-white/10 bg-black px-6 py-4 md:hidden"
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block text-sm text-white/70 hover:text-white"
              onClick={(e) => {
                if (n.href.startsWith('/#')) {
                  e.preventDefault();
                  const targetId = n.href.replace('/', '');
                  const element = document.querySelector(targetId);
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }
                setOpen(false);
              }}
            >
              {t(n.key as any)}
            </Link>
          ))}
          <div className="mt-3 flex gap-2">
            <Link
              href="/shop"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
              onClick={() => setOpen(false)}
            >
              {t('shop')} <ShoppingCart className="h-4 w-4" />
            </Link>
            <Link
              href="shop/cart"
              className="relative inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white hover:border-white/25 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold leading-none">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => dispatch(toggleLanguage())}
              className="inline-flex items-center rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-white/25 hover:bg-white/10"
              aria-label="Toggle language"
            >
              {code === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </motion.nav>
      )}
    </header>
  );
}
