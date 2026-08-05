'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPrograms, getEpisodes, Program, Episode } from '@/lib/db';
import { Tv, Play, ChevronRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [epCountMap, setEpCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const progs = await getPrograms();
      setPrograms(progs);

      // Count episodes for each program
      const counts: Record<string, number> = {};
      for (const p of progs) {
        const eps = await getEpisodes(p.id);
        counts[p.id] = eps.length;
      }
      setEpCountMap(counts);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-grid min-h-screen pt-12 pb-24">
      {/* Glow Spheres */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-16 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary"
          >
            <Tv size={12} />
            <span>YouTube Original Series</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl"
          >
            OUR <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">PROGRAMS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted md:mx-0"
          >
            Temukan katalog acara video original buatan tim Immortal Division. Diatur secara rapi berdasarkan program, season, dan indeks episode.
          </motion.p>
        </div>

        {/* Programs Catalog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((prog, idx) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#08080a] transition duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
            >
              
              {/* Cover Image Area */}
              <Link href={`/programs/${prog.slug}`} className="relative block aspect-video overflow-hidden">
                <img
                  src={prog.cover_image}
                  alt={prog.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                
                {/* Episode count badge */}
                <span className="absolute bottom-4 left-4 rounded-lg bg-black/80 px-3 py-1 text-xs font-bold text-white border border-white/5 backdrop-blur-sm">
                  {epCountMap[prog.id] || 0} Episodes
                </span>

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100 bg-black/40">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                    <Play size={24} fill="white" className="translate-x-0.5" />
                  </span>
                </div>
              </Link>

              {/* Card Details */}
              <div className="flex flex-1 flex-col p-6 space-y-4">
                <div className="space-y-2">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {prog.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded bg-white/5 py-0.5 px-2 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                        <Tag size={8} className="text-primary" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                  
                  {/* Title */}
                  <Link href={`/programs/${prog.slug}`} className="block text-xl font-bold text-white transition hover:text-primary leading-snug">
                    {prog.title}
                  </Link>
                  
                  {/* Description */}
                  <p className="text-sm text-neutral-400 line-clamp-3">
                    {prog.description}
                  </p>
                </div>

                {/* Action button */}
                <div className="mt-auto pt-4 border-t border-white/5">
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-primary"
                  >
                    <span>View Episode Library</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
