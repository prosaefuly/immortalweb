'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getArtWorks, getMusicTracks, ArtWork, MusicTrack } from '@/lib/db';
import { Image as ImageIcon, Music, Play, Eye, ExternalLink, X, Apple, Disc, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryPage() {
  const { playTrack, currentTrack, isPlaying } = useApp();
  const [activeTab, setActiveTab] = useState<'art' | 'music'>('art');
  
  const [artWorks, setArtWorks] = useState<ArtWork[]>([]);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  
  // Lightbox Modal state for Art
  const [selectedArt, setSelectedArt] = useState<ArtWork | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const artData = await getArtWorks();
      const tracksData = await getMusicTracks();
      setArtWorks(artData);
      setTracks(tracksData);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-grid min-h-screen pt-12 pb-24">
      {/* Glow Spheres */}
      <div className="pointer-events-none absolute top-10 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-primary">Creative Showcase</span>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl text-center md:text-left">
              ART & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">MUSIC</span>
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex rounded-xl bg-neutral-900 border border-white/5 p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('art')}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'art'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon size={14} />
              <span>Digital Art / Merch</span>
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'music'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Music size={14} />
              <span>Audio Releases</span>
            </button>
          </div>
        </div>

        {/* --- TAB CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          {activeTab === 'art' ? (
            
            /* ARTWORK TAB - MASONRY GRID */
            <motion.div
              key="art-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6"
            >
              {artWorks.map((art, idx) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArt(art)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[#09090b] p-1 break-inside-avoid transition duration-300 hover:border-primary/30"
                >
                  <img
                    src={art.image_url}
                    alt={art.title}
                    className="w-full rounded-xl object-cover"
                  />
                  
                  {/* Hover Overlay info */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/35 to-transparent p-6 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                      {art.category}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-muted">by {art.artist_name}</p>
                    
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary border-t border-white/5 pt-3">
                      <Eye size={12} />
                      <span>View Showcase Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            
            /* MUSIC TAB - AUDIOS & EMBEDS */
            <motion.div
              key="music-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
              {/* Music List and Direct Player Triggers (Col Span 7) */}
              <div className="space-y-6 lg:col-span-7">
                <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white">Evolu Originals Playlist</h2>
                    <p className="text-xs text-muted mt-1">Klik play untuk mendengarkan langsung di player web atau buka platform streaming digital.</p>
                  </div>

                  <div className="space-y-3">
                    {tracks.map((track) => {
                      const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
                      return (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between gap-4 rounded-2xl border border-white/5 p-4 transition ${
                            currentTrack?.id === track.id ? 'bg-primary/5 border-primary/20' : 'bg-black/40 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={track.cover_image}
                              alt={track.title}
                              className="h-12 w-12 rounded-lg object-cover border border-white/10"
                            />
                            <div>
                              <h4 className={`text-sm font-bold ${currentTrack?.id === track.id ? 'text-primary' : 'text-white'}`}>
                                {track.title}
                              </h4>
                              <p className="text-xs text-muted">{track.artist} — {track.album}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="hidden font-mono text-[10px] text-muted sm:inline">{track.duration}</span>
                            
                            {/* Play trigger button */}
                            <button
                              onClick={() => playTrack(track)}
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition hover:scale-105 active:scale-95"
                            >
                              <Play size={14} fill="white" className="translate-x-0.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Streaming Embeds (Col Span 5) */}
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white">Spotify & Apple Music Embeds</h2>
                    <p className="text-xs text-muted mt-1">Mainkan rilis penuh melalui integrasi media external Spotify di bawah.</p>
                  </div>
                  
                  {/* Dynamic Spotify embed loop */}
                  <div className="space-y-4">
                    {tracks.map((track) => (
                      <div key={`embed-${track.id}`} className="rounded-2xl overflow-hidden border border-white/5 p-1 bg-black/40">
                        {/* Spotify Embed Content */}
                        <div 
                          dangerouslySetInnerHTML={{ __html: track.spotify_embed }} 
                          className="w-full h-[152px]"
                        />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- LIGHTBOX MODAL FOR ARTWORK --- */}
        <AnimatePresence>
          {selectedArt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedArt(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              {/* Lightbox box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-primary/20 bg-[#0c0c0e] p-4 shadow-2xl glass-red flex flex-col md:flex-row gap-6"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedArt(null)}
                  className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-1.5 text-muted transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>

                {/* Left: Artwork view */}
                <div className="flex-1 max-h-[40vh] md:max-h-[75vh] flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden">
                  <img
                    src={selectedArt.image_url}
                    alt={selectedArt.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Right: Info details */}
                <div className="md:w-80 flex flex-col justify-between py-4 pr-4">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {selectedArt.category}
                      </span>
                      <h2 className="text-2xl font-black text-white leading-snug">
                        {selectedArt.title}
                      </h2>
                      <p className="text-xs text-muted mt-1">Created by {selectedArt.artist_name}</p>
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {selectedArt.description}
                    </p>
                  </div>

                  {/* Merchandise option link */}
                  {selectedArt.merch_link && (
                    <div className="mt-8 pt-4 border-t border-white/5">
                      <a
                        href={selectedArt.merch_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-primary-hover shadow-lg shadow-primary/25"
                      >
                        <Disc size={14} className="animate-spin" />
                        <span>Beli Merchandise</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
