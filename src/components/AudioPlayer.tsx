'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Play, Pause, Volume2, Music, AlignLeft, ExternalLink, X, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AudioPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    seekTrack, 
    volume, 
    setVolume,
    lyricsOpen,
    setLyricsOpen
  } = useApp();

  if (!currentTrack) return null;

  // Format time (seconds to mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seekTrack(time);
  };

  return (
    <>
      {/* Floating Bottom Audio Player Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed bottom-0 right-0 left-0 z-40 border-t border-primary/20 bg-black/90 px-4 py-3 shadow-2xl backdrop-blur-lg"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          
          {/* Track Info */}
          <div className="flex items-center gap-3 md:w-1/4">
            <img
              src={currentTrack.cover_image}
              alt={currentTrack.title}
              className="h-12 w-12 rounded-lg object-cover border border-primary/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-bold text-white">{currentTrack.title}</h4>
              <p className="truncate text-xs text-muted">{currentTrack.artist}</p>
            </div>
            
            {/* Quick Spotify Badge for mobile/small view */}
            <div className="flex items-center gap-1.5 md:hidden">
              <a
                href={currentTrack.apple_music_link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#fa243c] p-1.5 text-white transition hover:scale-105"
              >
                <Apple size={12} />
              </a>
            </div>
          </div>

          {/* Controls & Scrubber */}
          <div className="flex flex-1 flex-col items-center gap-1">
            <div className="flex items-center gap-4">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition hover:scale-105 active:scale-95 shadow-md shadow-primary/30"
              >
                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} className="translate-x-0.5" fill="white" />}
              </button>
            </div>

            {/* Scrubber timeline */}
            <div className="flex w-full items-center gap-2">
              <span className="text-[10px] font-mono text-muted">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-primary focus:outline-none"
              />
              <span className="text-[10px] font-mono text-muted">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Tools (Volume, Lyrics, Streaming Links) */}
          <div className="flex items-center justify-between gap-4 md:w-1/4 md:justify-end">
            
            {/* Lyrics Toggle */}
            <button
              onClick={() => setLyricsOpen(!lyricsOpen)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                lyricsOpen 
                  ? 'bg-primary text-white' 
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <AlignLeft size={14} />
              <span className="hidden sm:inline">Lyrics</span>
            </button>

            {/* Volume Control */}
            <div className="hidden items-center gap-2 lg:flex">
              <Volume2 size={16} className="text-muted" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-primary focus:outline-none"
              />
            </div>

            {/* Streaming Links Badges */}
            <div className="flex items-center gap-2">
              {/* Spotify Link */}
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-[#1DB954] py-1 px-3 text-[10px] font-bold uppercase tracking-wider text-black transition hover:scale-[1.03] active:scale-[0.97]"
              >
                <span>Spotify</span>
                <ExternalLink size={10} />
              </a>

              {/* Apple Music Link */}
              <a
                href={currentTrack.apple_music_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-[#fa243c] py-1 px-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:scale-[1.03] active:scale-[0.97]"
              >
                <Apple size={10} />
                <span>Music</span>
              </a>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Persistent Lyrics Drawer (Slide up / Fade in) */}
      <AnimatePresence>
        {lyricsOpen && (
          <div className="fixed inset-0 z-30 flex items-end justify-center p-4 md:items-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLyricsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Lyrics Content Container */}
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="relative bottom-16 z-10 w-full max-w-xl rounded-2xl border border-primary/20 bg-black/90 p-6 md:p-8 glass-red shadow-2xl max-h-[70vh] flex flex-col"
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Music className="text-primary animate-pulse" size={20} />
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentTrack.title}</h3>
                    <p className="text-xs text-muted">{currentTrack.artist}</p>
                  </div>
                </div>
                <button
                  onClick={() => setLyricsOpen(false)}
                  className="rounded-full bg-white/5 p-1.5 text-muted transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrolling Lyrics */}
              <div className="flex-1 overflow-y-auto pr-2 text-center font-sans text-base leading-relaxed text-neutral-300 whitespace-pre-line py-4 select-none">
                {currentTrack.lyrics || 'No lyrics available for this track.'}
              </div>

              {/* Footer */}
              <div className="mt-4 text-center text-[10px] text-muted tracking-wider uppercase border-t border-white/5 pt-3">
                Lyrics provided by Immortal Division Music.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
