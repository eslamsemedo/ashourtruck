"use client";

import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Car } from "lucide-react";

// Footer for car accessories e-commerce website
// Theme: black background, white text, red accents

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-white">
      {/* Top section */}
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">RPM AutoGear</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Premium car accessories engineered for performance, style, and reliability.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-white/90">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="/category/lighting" className="hover:text-white">Lighting</a></li>
              <li><a href="/category/performance" className="hover:text-white">Performance</a></li>
              <li><a href="/category/interior" className="hover:text-white">Interior</a></li>
              <li><a href="/category/wheels" className="hover:text-white">Wheels & Rims</a></li>
              <li><a href="/category/exterior" className="hover:text-white">Exterior</a></li>
              <li><a href="/category/tech" className="hover:text-white">Tech & Audio</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white/90">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="/support/warranty" className="hover:text-white">Warranty</a></li>
              <li><a href="/support/shipping" className="hover:text-white">Shipping</a></li>
              <li><a href="/support/returns" className="hover:text-white">Returns</a></li>
              <li><a href="/support/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/support/faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white/90">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-500" /> support@rpm-autogear.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-500" /> +1 (800) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> 123 Auto Street, Motor City, USA</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="border-t border-white/10 bg-black/80"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-white/50 md:flex-row">
          <span>© {new Date().getFullYear()} RPM AutoGear. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}