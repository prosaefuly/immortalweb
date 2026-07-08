'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { subscribeNewsletter } from '@/lib/db';
import { Send, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const success = await subscribeNewsletter(email);
    setLoading(false);
    if (success) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full border-t border-white/5 bg-black/90 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-primary font-black text-sm text-white">
                E
              </span>
              <span className="font-sans text-xl font-black uppercase tracking-wider text-white">
                Evolu<span className="text-primary">Media</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm text-muted">
              Mewadahi ekosistem musik independen, sub-kultur urban, dan seni digital. EvoluMedia mengonsolidasikan karya, program audio-visual, berita, jurnalisme musik, dan interaksi komunitas.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 text-neutral-400 transition hover:bg-primary hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 text-neutral-400 transition hover:bg-primary hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 text-neutral-400 transition hover:bg-primary hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Navigation</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <Link href="/programs" className="transition hover:text-primary">YouTube Programs</Link>
              </li>
              <li>
                <Link href="/gallery" className="transition hover:text-primary">Art & Music Showcase</Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-primary">Blog & News</Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-primary">Upcoming Events</Link>
              </li>
              <li>
                <Link href="/partnership" className="transition hover:text-primary">B2B Partnerships</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Newsletter</h4>
            <p className="mt-4 text-sm text-muted">
              Dapatkan kurasi berita musik independen dan info merchandise eksklusif langsung di inbox kamu.
            </p>
            
            <form onSubmit={handleSubscribe} className="mt-4">
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Subscribed successfully!</span>
                </div>
              ) : (
                <div className="flex overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  <input
                    type="email"
                    required
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex cursor-pointer items-center justify-center bg-primary px-3 text-white transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
                  >
                    <Send size={12} />
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} EvoluMedia Portal. All Rights Reserved. Built with Next.js & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};
