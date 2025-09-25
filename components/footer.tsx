"use client";

import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Car, Share2, MessageCircle, LinkIcon, Globe, Send, Feather } from "lucide-react";
import { useT } from "@/lib/i18n";
import Link from "next/link";

// Footer for car accessories e-commerce website
// Theme: black background, white text, red accents

export default function Footer() {
  const { t } = useT();
  const links = [
    {
      title: 'Features',
      href: '#',
    },
    {
      title: 'Solution',
      href: '#',
    },
    {
      title: 'Customers',
      href: '#',
    },
    {
      title: 'Pricing',
      href: '#',
    },
    {
      title: 'Help',
      href: '#',
    },
    {
      title: 'About',
      href: '#',
    },
  ]
  return (
    <footer className="relative w-full bg-black text-white ">
      <div className="mx-auto max-w-5xl px-6 ">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto block size-fit">
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150">
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {/* Using generic icons for social links */}
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Social Link 1" // Generic label
            className="text-muted-foreground hover:text-primary block">
            <Share2 className="size-6 text-red-700" /> {/* Generic "Share" icon */}
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Social Link 2"
            className="text-muted-foreground hover:text-primary block">
            <MessageCircle className="size-6 text-red-700" /> {/* Generic "Message" icon */}
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Social Link 3"
            className="text-muted-foreground hover:text-primary block">
            <LinkIcon className="size-6 text-red-700" /> {/* Generic "Link" icon */}
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Social Link 4"
            className="text-muted-foreground hover:text-primary block">
            <Globe className="size-6 text-red-700" /> {/* Generic "Globe" (website/world) icon */}
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Social Link 5"
            className="text-muted-foreground hover:text-primary block">
            <Send className="size-6 text-red-700" /> {/* Generic "Send" icon */}
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Social Link 6"
            className="text-muted-foreground hover:text-primary block">
            <Feather className="size-6 text-red-700" /> {/* Generic "Feather" (post/write) icon */}
          </Link>
        </div>
        {/* <span className="text-muted-foreground block text-center text-sm"> © {new Date().getFullYear()} Tailark, All rights reserved</span> */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/10 bg-black/80"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-white/50 md:flex-row">
            <span>© {new Date().getFullYear()} {t('brand')}. {t('allRightsReserved')}</span>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-white">{t('privacyPolicy')}</a>
              <a href="/terms" className="hover:text-white">{t('termsOfService')}</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>

  );
}

// {/* <footer className="relative w-full bg-black text-white">
//       {/* Top section */}
//       <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
//         <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
//           {/* Brand */}
//           <div>
//             <div className="flex items-center gap-2">
//               <Car className="h-6 w-6 text-red-500" />
//               <span className="text-xl font-bold">{t('brand')}</span>
//             </div>
//             <p className="mt-4 max-w-xs text-sm text-white/70">
//               {t('brandDescription')}
//             </p>
//           </div>

//           {/* Shop */}
//           <div>
//             <h3 className="text-sm font-semibold text-white/90">{t('shopSection')}</h3>
//             <ul className="mt-4 space-y-2 text-sm text-white/70">
//               <li><a href="/category/lighting" className="hover:text-white">{t('lighting')}</a></li>
//               <li><a href="/category/performance" className="hover:text-white">{t('performance')}</a></li>
//               <li><a href="/category/interior" className="hover:text-white">{t('interior')}</a></li>
//               <li><a href="/category/wheels" className="hover:text-white">{t('wheelsRims')}</a></li>
//               <li><a href="/category/exterior" className="hover:text-white">{t('exterior')}</a></li>
//               <li><a href="/category/tech" className="hover:text-white">{t('techAudio')}</a></li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="text-sm font-semibold text-white/90">{t('supportSection')}</h3>
//             <ul className="mt-4 space-y-2 text-sm text-white/70">
//               <li><a href="/support/warranty" className="hover:text-white">{t('warranty2y')}</a></li>
//               <li><a href="/support/shipping" className="hover:text-white">{t('freeFastShipping')}</a></li>
//               <li><a href="/support/returns" className="hover:text-white">{t('easyReturns')}</a></li>
//               <li><a href="/support/contact" className="hover:text-white">{t('contactUs')}</a></li>
//               <li><a href="/support/faq" className="hover:text-white">{t('faq')}</a></li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="text-sm font-semibold text-white/90">{t('contactSection')}</h3>
//             <ul className="mt-4 space-y-3 text-sm text-white/70">
//               <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-500" /> support@rpm-autogear.com</li>
//               <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-500" /> +1 (800) 123-4567</li>
//               <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> 123 Auto Street, Motor City, USA</li>
//             </ul>
//             <div className="mt-4 flex gap-3">
//               <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Facebook className="h-4 w-4" /></a>
//               <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Instagram className="h-4 w-4" /></a>
//               <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Twitter className="h-4 w-4" /></a>
//               <a href="#" className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:border-white/20"><Youtube className="h-4 w-4" /></a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.5 }}
//         transition={{ duration: 0.6 }}
//         className="border-t border-white/10 bg-black/80"
//       >
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-white/50 md:flex-row">
//           <span>© {new Date().getFullYear()} {t('brand')}. {t('allRightsReserved')}</span>
//           <div className="flex gap-4">
//             <a href="/privacy" className="hover:text-white">{t('privacyPolicy')}</a>
//             <a href="/terms" className="hover:text-white">{t('termsOfService')}</a>
//           </div>
//         </div>
//       </motion.div>
//     </footer> */}