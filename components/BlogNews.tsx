"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Newspaper, ArrowRight, Tag } from "lucide-react";
import { useT } from "@/lib/i18n";

// Blog / Car Culture News Section
// Theme: black background, white text, red accents
// Layout: one featured article + secondary grid; animated entrances

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  href: string;
  tag?: string;
  date?: string; // ISO or formatted
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const defaultPosts: Post[] = [
  {
    id: "b1",
    title: "Track-Day Setup: 7 Must‑Have Upgrades",
    excerpt: "From aero tweaks to brake cooling — build a setup that shaves seconds and stays safe.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
    href: "/blog/track-day-setup",
    tag: "Performance",
    date: "2025-08-20",
  },
  {
    id: "b2",
    title: "LED vs. Laser Headlights: What’s Best?",
    excerpt: "We tested brightness, cutoff, and install time so you don’t have to.",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
    href: "/blog/led-vs-laser",
    tag: "Lighting",
    date: "2025-07-28",
  },
  {
    id: "b3",
    title: "Beginner’s Guide to Coilovers",
    excerpt: "Comfort vs. control and how to choose spring rates for street use.",
    imageUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200",
    href: "/blog/coilover-guide",
    tag: "Suspension",
    date: "2025-06-02",
  },
  {
    id: "b4",
    title: "Interior Mods that Actually Add Value",
    excerpt: "Steering wheels, shift knobs, and trims that elevate daily driving.",
    imageUrl: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=1200",
    href: "/blog/interior-mods",
    tag: "Interior",
    date: "2025-05-12",
  },
  
];

function Card({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <motion.article
      variants={item}
      className={[
        "group relative overflow-hidden col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur",
        featured ? "md:row-span-2 " : "",
      ].join(" ")}
    >
      <a href={post.href} className="block h-full">
        {/* Image */}
        <div className={[
          "relative w-full overflow-hidden",
          featured ? "aspect-[16/9]" : "aspect-[4/3]",
        ].join(" ")}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Tag */}
          {post.tag && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold text-white shadow">
              <Tag className="h-3.5 w-3.5" /> {post.tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className={["font-bold", featured ? "text-xl" : "text-base"].join(" ")}>{post.title}</h3>
          <p className="mt-2 text-sm text-white/70 line-clamp-3">{post.excerpt}</p>

          <div className="mt-4 flex items-center justify-between text-xs text-white/60">
            <span>{post.date ? new Date(post.date).toLocaleDateString() : ""}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>

        {/* Glow accent */}
        <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rotate-45 bg-red-600/20 blur-2xl" />
      </a>
    </motion.article>
  );
}

export default function BlogNews({
  posts = defaultPosts,
  headline = "blogHeadline",
  kicker = "blogKicker",
  ctaHref = "/blog",
}: {
  posts?: Post[];
  headline?: string;
  kicker?: string;
  ctaHref?: string;
}) {
  const { t } = useT();
  const [first, ...rest] = posts;

  return (
    <section className="relative w-full bg-black py-20 text-white">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55 }}
          className="mb-10 flex items-end justify-between gap-6"
        >
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <Newspaper className="h-3.5 w-3.5 text-red-500" /> {t(kicker as any)}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t(headline as any)}</h2>
          </div>

          <a
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
          >
            {t('viewAll')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Grid: Featured + list */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-5"
        >
          {/* Featured */}
          {/* {first && (
            <div className="md:col-span-3">
              <Card post={first} featured />
            </div>
          )} */}

          {/* Secondary list */}
          <div className="grid grid-cols-4 gap-6 md:col-span-5">
            {defaultPosts.map((p) => (
              <Card key={p.id} post={p} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


// how to use 
{/*
  <BlogNews
  headline="RPM Journal"
  kicker="Guides • Reviews • Culture"
  ctaHref="/journal"
  posts={[
    {
      id: "1",
      title: "Ultimate Brake Upgrade Guide",
      excerpt: "Pads, rotors, lines—what actually makes a difference on the street?",
      imageUrl: "/images/posts/brakes.jpg",
      href: "/blog/brake-upgrade-guide",
      tag: "Brakes",
      date: "2025-08-12",
    },
    // more...
  ]}
/> 
*/}