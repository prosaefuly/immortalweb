'use client';

import React, { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  getProgramBySlug, 
  getEpisodes, 
  getComments, 
  addComment, 
  Program, 
  Episode, 
  Comment 
} from '@/lib/db';
import { Lock, Play, Send, MessageSquare, ChevronRight, CornerDownRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProgramDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const searchParams = useSearchParams();
  const epQueryId = searchParams.get('ep');
  const router = useRouter();

  const { user, setShowAuthModal } = useApp();
  
  const [program, setProgram] = useState<Program | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasons, setSeasons] = useState<number[]>([]);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Load Program & Episodes
  useEffect(() => {
    const loadProgramData = async () => {
      const progData = await getProgramBySlug(slug);
      if (!progData) return;
      setProgram(progData);

      const epsData = await getEpisodes(progData.id);
      setEpisodes(epsData);

      // Extract unique seasons
      const uniqueSeasons = Array.from(new Set(epsData.map(e => e.season))).sort((a, b) => a - b);
      setSeasons(uniqueSeasons);

      // Determine active episode
      let active = epsData[0] || null;
      if (epQueryId) {
        const queryEp = epsData.find(e => e.id === epQueryId);
        if (queryEp) active = queryEp;
      }
      setActiveEpisode(active);
      if (active) {
        setSelectedSeason(active.season);
      }
    };

    loadProgramData();
  }, [slug, epQueryId]);

  // Load Comments for Active Episode
  useEffect(() => {
    if (!activeEpisode) return;
    
    const loadEpisodeComments = async () => {
      const comms = await getComments({ episodeId: activeEpisode.id });
      setComments(comms);
    };

    loadEpisodeComments();
  }, [activeEpisode]);

  // Handle Comment Submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.isLoggedIn || !newCommentText.trim() || !activeEpisode) return;

    setSubmittingComment(true);
    const added = await addComment({
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      episodeId: activeEpisode.id,
      content: newCommentText.trim()
    });
    setSubmittingComment(false);

    if (added) {
      setComments(prev => [...prev, added]);
      setNewCommentText('');
    }
  };

  // Switch Active Episode
  const selectEpisode = (ep: Episode) => {
    setActiveEpisode(ep);
    router.push(`/programs/${slug}?ep=${ep.id}`);
  };

  if (!program) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white">Loading Program...</h2>
      </div>
    );
  }

  // Filter episodes for the current active season
  const filteredEpisodes = episodes.filter(e => e.season === selectedSeason);

  // Check if player is gated (exclusive video and user not logged in)
  const isGated = activeEpisode?.is_exclusive && !user.isLoggedIn;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <Link 
        href="/programs" 
        className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-muted transition hover:text-white"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Catalog</span>
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Video Player, Info, Comments (Col Span 8) */}
        <div className="space-y-6 lg:col-span-8">
          
          {/* Main Video Screen */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/5 bg-neutral-950 shadow-2xl">
            {activeEpisode ? (
              isGated ? (
                /* Member Gated Screen */
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center glass-red">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/40 mb-4 animate-bounce">
                    <Lock size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-wider text-white">
                    MEMBER EXCLUSIVE VIDEO
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-neutral-400">
                    Episode &quot;{activeEpisode.title}&quot; merupakan konten eksklusif. Bergabunglah dengan klub member Immortal Division untuk menonton program ini secara penuh.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="mt-6 cursor-pointer rounded-lg bg-primary py-2.5 px-6 font-bold uppercase tracking-wider text-white hover:scale-105 active:scale-95 transition"
                  >
                    Join Member Sekarang
                  </button>
                </div>
              ) : (
                /* Embed Player */
                <iframe
                  src={`https://www.youtube.com/embed/${activeEpisode.youtube_id}?autoplay=0&rel=0`}
                  title={activeEpisode.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-none"
                />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted">No episode selected</p>
              </div>
            )}
          </div>

          {/* Episode Info */}
          {activeEpisode && (
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded bg-primary/10 border border-primary/20 py-0.5 px-2 text-[10px] font-black uppercase tracking-widest text-primary">
                  Season {activeEpisode.season}
                </span>
                <span className="text-xs text-muted">
                  Duration: {activeEpisode.duration}
                </span>
                <span className="text-xs text-muted">•</span>
                <span className="text-xs text-muted">
                  Released: {new Date(activeEpisode.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white md:text-3xl leading-snug">
                {activeEpisode.title}
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
                {activeEpisode.description}
              </p>
            </div>
          )}

          {/* Discussion comments area */}
          <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-white border-b border-white/5 pb-4">
              <MessageSquare size={18} className="text-primary" />
              <span>DISCUSSIONS ({comments.length})</span>
            </h3>

            {/* Post Comments form (Authenticated check) */}
            {user.isLoggedIn ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-10 w-10 rounded-full object-cover border border-primary/20"
                />
                <div className="flex-1 space-y-3">
                  <textarea
                    placeholder="Bagikan opini atau tanyakan seputar episode ini..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-primary/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary py-2 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Send size={12} />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-black/40 p-6 text-center">
                <p className="text-sm text-muted">
                  Hanya member Immortal Division yang dapat berpartisipasi dalam diskusi.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  Sign In / Register &rarr;
                </button>
              </div>
            )}

            {/* Comment Timeline Feed */}
            <div className="space-y-4 pt-2">
              {comments.length > 0 ? (
                comments.map((comm) => (
                  <div key={comm.id} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-b-0">
                    <img
                      src={comm.avatar_url}
                      alt={comm.username}
                      className="h-10 w-10 rounded-full object-cover border border-white/5"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">@{comm.username}</span>
                        <span className="text-[10px] text-muted">
                          {new Date(comm.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-sm">{comm.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-neutral-600">
                  Belum ada komentar. Jadilah yang pertama berkomentar!
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Seasons & Playlist Switcher (Col Span 4) */}
        <div className="space-y-6 lg:col-span-4">
          
          {/* Program Quick Profile */}
          <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-3">
            <h3 className="text-lg font-black uppercase text-white">{program.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{program.description}</p>
          </div>

          {/* Episode List Box */}
          <div className="rounded-3xl border border-white/5 bg-[#08080a] overflow-hidden">
            
            {/* Season Selector Tabs */}
            <div className="bg-black/40 border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">EPISODES</span>
              
              {/* Season Selection */}
              <div className="flex gap-2">
                {seasons.map((seasonNum) => (
                  <button
                    key={seasonNum}
                    onClick={() => setSelectedSeason(seasonNum)}
                    className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                      selectedSeason === seasonNum
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-muted hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    S{seasonNum}
                  </button>
                ))}
              </div>
            </div>

            {/* List timeline */}
            <div className="max-h-[500px] overflow-y-auto divide-y divide-white/5">
              {filteredEpisodes.length > 0 ? (
                filteredEpisodes.map((ep) => {
                  const isActive = activeEpisode?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => selectEpisode(ep)}
                      className={`w-full text-left p-5 flex items-start gap-4 transition hover:bg-white/5 ${
                        isActive ? 'bg-primary/10 border-l-2 border-primary' : ''
                      }`}
                    >
                      {/* Visual marker status */}
                      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-white/5">
                        <img
                          src={`https://img.youtube.com/vi/${ep.youtube_id}/default.jpg`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = program.cover_image;
                          }}
                          alt={ep.title}
                          className="h-full w-full object-cover"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-primary">
                            <Play size={16} fill="currentColor" />
                          </div>
                        )}
                        {ep.is_exclusive && !isActive && (
                          <div className="absolute top-1 right-1 bg-primary rounded p-0.5 text-white">
                            <Lock size={8} />
                          </div>
                        )}
                      </div>

                      {/* Episode Meta */}
                      <div className="min-w-0 space-y-1">
                        <span className="text-[9px] font-black tracking-widest text-primary uppercase">
                          {new Date(ep.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <h4 className={`text-xs font-bold leading-snug truncate ${isActive ? 'text-primary' : 'text-white'}`}>
                          {ep.title}
                        </h4>
                        <span className="text-[10px] text-muted block font-mono">
                          Duration: {ep.duration}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-sm text-neutral-600">
                  Tidak ada episode di season ini.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
