'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBlogPosts, BlogPost } from '@/lib/db';
import { Search, Filter, Newspaper, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogListingPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Editor Picks', 'Gear Reviews', 'Culture'];

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await getBlogPosts();
      setAllPosts(posts);
      setFilteredPosts(posts);
    };
    loadPosts();
  }, []);

  // Handle live search and category chips filtering
  useEffect(() => {
    let result = allPosts;

    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(result);
  }, [selectedCategory, searchQuery, allPosts]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-grid min-h-screen pt-12 pb-24">
      {/* Glow Spheres */}
      <div className="pointer-events-none absolute top-10 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary"
          >
            <Newspaper size={12} />
            <span>Music & Culture Journal</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl"
          >
            IMMORTAL <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">JOURNAL</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted md:mx-0"
          >
            Jurnalisme musik mendalam, ulasan perangkat audio, liputan festival indie, dan esai budaya urban terkurasi.
          </motion.p>
        </div>

        {/* Filter Controls Panel */}
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/5 bg-[#08080a] p-6 md:flex-row md:items-center md:justify-between">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative md:w-80">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Cari artikel news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Articles Feed List */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#08080a] transition duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
                >
                  {/* Banner Photo */}
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[1.75] overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    
                    {/* Category */}
                    <span className="absolute top-4 left-4 rounded bg-primary py-0.5 px-2 text-[9px] font-black uppercase tracking-wider text-white">
                      {post.category}
                    </span>
                  </Link>

                  {/* Body Text */}
                  <div className="flex flex-1 flex-col p-6 space-y-4">
                    <div className="space-y-2">
                      <Link href={`/blog/${post.slug}`} className="block text-xl font-bold tracking-tight text-white transition hover:text-primary leading-snug">
                        {post.title}
                      </Link>
                      <p className="text-sm text-neutral-400 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer Author Stamp */}
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.full_name}
                          className="h-8 w-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">{post.author.full_name}</p>
                          <p className="text-[10px] text-muted">{formatDate(post.published_at)}</p>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="group/btn flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-neutral-300 transition hover:bg-primary hover:text-white"
                      >
                        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[35vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-[#08080a] p-8 text-center"
            >
              <BookOpen size={40} className="text-muted mb-3" />
              <h3 className="text-lg font-bold text-white">Tidak ada artikel ditemukan</h3>
              <p className="text-sm text-neutral-500 mt-1">Coba gunakan filter category lain atau cari dengan kata kunci berbeda.</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
