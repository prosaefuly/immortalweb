'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  getPrograms,
  getEpisodes,
  getBlogPosts,
  getEvents,
  getMusicTracks,
  getProducts,
  Program,
  Episode,
  BlogPost,
  EventItem,
  MusicTrack,
  Product
} from '@/lib/db';
import { Play, Calendar, MapPin, ArrowRight, Video, Flame, Sparkles, Music, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { playTrack, setShowAuthModal, user } = useApp();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredTrack, setFeaturedTrack] = useState<MusicTrack | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const progsData = await getPrograms();
      const epsData = await getEpisodes();
      const postsData = await getBlogPosts();
      const eventsData = await getEvents();
      const tracksData = await getMusicTracks();
      const prodsData = await getProducts();

      setPrograms(progsData);
      setEpisodes(epsData.slice(0, 4)); // Show top 4 latest episodes
      setPosts(postsData.slice(0, 3)); // Show top 3 trending posts
      setEvents(eventsData.slice(0, 3)); // Show top 3 upcoming events
      setProducts(prodsData.slice(0, 4)); // Show top 4 products
      if (tracksData.length > 0) {
        setFeaturedTrack(tracksData[0]); // Feature first track
      }
    };
    fetchData();
  }, []);

  // Format date helper (e.g. 25 Jul 2026)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-grid min-h-screen pb-16">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

            {/* Hero Left Text */}
            <div className="space-y-6 lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/15 py-1 px-4 text-xs font-semibold uppercase tracking-widest text-primary"
              >
                <Sparkles size={12} className="animate-spin" />
                <span>Immortal Division</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-sans text-5xl font-black uppercase tracking-tight text-white sm:text-7xl"
              >
                IMMORTAL<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">DIVISION</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-xl text-lg text-neutral-400"
              >
                Immortal Division adalah sebuah wadah yang akan membahas, musik seni budaya dan olahraga-olahraga extreme yang ada di seluruh jagat raya.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  href="/programs"
                  className="flex items-center gap-2 rounded-lg bg-primary py-3.5 px-6 font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:scale-105 active:scale-95"
                >
                  <Video size={18} />
                  <span>Watch Programs</span>
                </Link>

                {featuredTrack && (
                  <button
                    onClick={() => playTrack(featuredTrack)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3.5 px-6 font-bold uppercase tracking-wider text-white transition hover:bg-white/10 hover:border-primary/50"
                  >
                    <Music size={18} className="text-primary" />
                    <span>Listen Feature Track</span>
                  </button>
                )}
              </motion.div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="relative lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl border border-primary/20 bg-neutral-900 p-2 shadow-2xl glass-red shadow-primary/10"
              >
                <img
                  src="/banner.jpg"
                  alt="Vision Dominate Banner"
                  className="h-[300px] w-full rounded-2xl object-contain bg-black sm:h-[400px]"
                />

                {/* Floating overlays */}
                <div className="absolute right-6 bottom-6 flex items-center gap-2 rounded-xl bg-black/80 px-4 py-2 text-xs font-bold text-white border border-white/5 backdrop-blur-md">
                  <Flame size={12} className="text-primary animate-pulse" />
                  <span>Now Broadcasting Live</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LATEST YOUTUBE EPISODES SECTION */}
      <section className="py-20 border-t border-white/5 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Youtube Channel</span>
              <h2 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
                LATEST EPISODES
              </h2>
            </div>
            <Link
              href="/programs"
              className="group flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary transition hover:text-white"
            >
              <span>See All Programs</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Episode Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {episodes.map((ep, idx) => {
              const program = programs.find(p => p.id === ep.program_id);
              return (
                <motion.div
                  key={ep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#09090b] transition duration-300 hover:border-primary/30"
                >
                  {/* Thumbnail area */}
                  <Link href={`/programs/${program?.slug || ''}?ep=${ep.id}`} className="relative block aspect-video overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${ep.youtube_id}/maxresdefault.jpg`}
                      onError={(e) => {
                        // Fallback image if youtube maxres doesn't exist
                        (e.target as HTMLImageElement).src = program?.cover_image || '';
                      }}
                      alt={ep.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Duration badge */}
                    <span className="absolute right-3 bottom-3 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white">
                      {ep.duration}
                    </span>

                    {/* Member exclusive badge */}
                    {ep.is_exclusive && (
                      <span className="absolute top-3 left-3 rounded-md bg-gradient-to-r from-primary to-accent py-0.5 px-2 text-[9px] font-black uppercase tracking-wider text-white">
                        MEMBER EXCLUSIVE
                      </span>
                    )}

                    {/* Play Icon Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100 bg-black/40">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                        <Play size={20} fill="white" className="translate-x-0.5" />
                      </span>
                    </div>
                  </Link>

                  {/* Details card */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      {program?.title || 'Program'}
                    </span>
                    <Link href={`/programs/${program?.slug || ''}?ep=${ep.id}`} className="mt-1 text-sm font-bold text-white transition hover:text-primary line-clamp-2">
                      {ep.title}
                    </Link>
                    <span className="mt-auto pt-3 text-[10px] text-muted">
                      {formatDate(ep.published_at)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. TRENDING BLOGS & NEWS */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Trending Articles</span>
              <h2 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
                MUSIC & CULTURE NEWS
              </h2>
            </div>
            <Link
              href="/blog"
              className="group flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary transition hover:text-white"
            >
              <span>Read More Articles</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Blog grid (Asymmetric 1 large + 2 side cards) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {posts.map((post, idx) => {
              const isLarge = idx === 0;
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#09090b] transition duration-300 hover:border-primary/20 ${isLarge ? 'lg:col-span-7' : 'lg:col-span-5'
                    }`}
                >
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[1.85] w-full overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                    {/* Category tag */}
                    <span className="absolute top-4 left-4 rounded bg-primary py-0.5 px-2 text-[9px] font-black uppercase tracking-wider text-white">
                      {post.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <Link href={`/blog/${post.slug}`} className="text-xl font-bold tracking-tight text-white transition hover:text-primary leading-snug">
                      {post.title}
                    </Link>
                    <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Author block */}
                    <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/5">
                      <img
                        src={post.author.avatar_url}
                        alt={post.author.full_name}
                        className="h-8 w-8 rounded-full object-cover border border-primary/20"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">{post.author.full_name}</p>
                        <p className="text-[10px] text-muted">{formatDate(post.published_at)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. MEMBERSHIP PROMO BANNER */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-primary/20 bg-gradient-to-r from-red-950/20 via-black to-neutral-900/50 p-8 md:p-12 glass-red shadow-xl text-center relative overflow-hidden"
          >
            <div className="pointer-events-none absolute top-0 left-0 h-[200px] w-[200px] rounded-full bg-primary/10 blur-[80px]" />

            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Member Area</span>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white md:text-5xl">
                JOIN THE EXCLUSIVE NETWORK
              </h2>
              <p className="text-base text-neutral-300">
                Dapatkan akses langsung ke konten video eksklusif member, diskusikan rilisan musik di kolom diskusi, bagikan karya senimu, dan terima newsletter mingguan khusus.
              </p>

              {!user.isLoggedIn ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary py-3.5 px-8 font-bold uppercase tracking-wider text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                >
                  <span>Daftar Member Gratis</span>
                </button>
              ) : (
                <Link
                  href="/member"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-3.5 px-8 font-bold uppercase tracking-wider text-white transition hover:bg-primary/20 hover:scale-105"
                >
                  <span>Buka Member Zone</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. MERCHANDISE STORE PREVIEW HIGHLIGHT */}
      <section className="py-20 border-t border-white/5 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Official Store</span>
              <h2 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
                OFFICIAL MERCHANDISE
              </h2>
            </div>
            <Link
              href="/store"
              className="group flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary transition hover:text-white"
            >
              <span>Explore Full Store</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Product grid list */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#08080a] p-3 transition duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
              >
                <Link href="/store">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-900">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-103"
                    />

                    {/* Category tag */}
                    <span className="absolute top-3 left-3 rounded bg-black/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-primary border border-primary/20">
                      {prod.category}
                    </span>
                  </div>

                  <div className="p-3 space-y-1 mt-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition truncate">
                      {prod.name}
                    </h3>
                    <div className="flex justify-between items-center pt-1">
                      <p className="text-sm font-black text-white font-mono">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(prod.price)}
                      </p>
                      <span className="text-[10px] text-muted flex items-center gap-1">
                        <ShoppingCart size={10} className="text-primary" />
                        <span>Buy Now</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. EVENTS TIMELINE PREVIEW */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">Upcoming Schedule</span>
              <h2 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
                UPCOMING EVENTS & WORKSHOPS
              </h2>
            </div>
            <Link
              href="/events"
              className="group flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary transition hover:text-white"
            >
              <span>See Full Calendar</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Event items vertical stack */}
          <div className="space-y-4">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#08080a] p-6 transition duration-300 hover:border-primary/20 md:flex-row md:items-center"
              >
                {/* Date stamp */}
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-primary text-white p-2 text-center md:h-24 md:w-24">
                  <span className="text-2xl font-black md:text-3xl">
                    {new Date(event.start_date).getDate()}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider md:text-xs">
                    {new Date(event.start_date).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 px-2 py-0.5 rounded">
                      {event.price_info}
                    </span>
                    <span className="text-[10px] font-semibold text-muted flex items-center gap-1">
                      <MapPin size={10} className="text-primary" />
                      <span>{event.location}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-neutral-400 line-clamp-1">
                    {event.description}
                  </p>
                </div>

                {/* Action button */}
                <div className="pt-2 md:pt-0">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10 hover:border-primary/40"
                  >
                    <Calendar size={14} className="text-primary" />
                    <span>Detail Info</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
