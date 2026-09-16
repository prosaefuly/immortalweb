'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  getEventById, 
  getEvents, 
  getComments, 
  addComment, 
  deleteComment, 
  extractYouTubeId, 
  EventItem, 
  Comment 
} from '@/lib/db';
import { 
  Calendar, MapPin, Ticket, Clock, ArrowLeft, 
  MessageSquare, Send, Trash2, ExternalLink, 
  Globe, Play, Image as ImageIcon, Sparkles, Share2, Check, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const { user, setShowAuthModal } = useApp();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [otherEvents, setOtherEvents] = useState<EventItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // RSVP Modal
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!eventId) return;
      const found = await getEventById(eventId);
      if (found) {
        setEvent(found);
        const comms = await getComments({ eventId: found.id });
        setComments(comms);
      }
      const all = await getEvents();
      setOtherEvents(all.filter(e => e.id !== eventId).slice(0, 3));
    };
    loadData();
  }, [eventId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.isLoggedIn || !newCommentText.trim() || !event) return;

    setSubmittingComment(true);
    try {
      const added = await addComment({
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        eventId: event.id,
        content: newCommentText.trim()
      });
      if (added) {
        setComments(prev => [...prev, added]);
        setNewCommentText('');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Hapus komentar ini?')) return;
    await deleteComment(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;
    const ref = `EVO-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketRef(ref);
    setRsvpSuccess(true);
  };

  if (!event) {
    return (
      <div className="bg-grid min-h-screen pt-24 pb-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Event Tidak Ditemukan</h2>
          <p className="text-xs text-muted">Event mungkin telah dibatalkan atau tautan tidak valid.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-primary-hover transition"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Jadwal Events</span>
          </Link>
        </div>
      </div>
    );
  }

  // Format date & times
  const startDateObj = new Date(event.start_date);
  const formattedFullDate = startDateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const startTimeStr = startDateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = event.end_date 
    ? new Date(event.end_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : null;

  const isFree = event.price_info.toLowerCase().includes('free');
  const isPast = new Date() > (event.end_date ? new Date(event.end_date) : startDateObj);

  return (
    <div className="bg-grid min-h-screen pt-12 pb-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-10 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-white transition"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Semua Event</span>
          </Link>

          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition"
          >
            {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
            <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan Event'}</span>
          </button>
        </div>

        {/* Hero Cover Banner */}
        <div className="relative aspect-[21/9] w-full min-h-[300px] max-h-[500px] overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-2xl">
          <img
            src={event.cover_image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className={`rounded-lg py-1 px-3 text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${
              isPast ? 'bg-neutral-800' : 'bg-primary'
            }`}>
              {isPast ? 'Past Event' : 'Upcoming Event'}
            </span>
            {event.is_online ? (
              <span className="rounded-lg bg-blue-600/90 py-1 px-3 text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1">
                <Globe size={12} />
                <span>Online Event</span>
              </span>
            ) : (
              <span className="rounded-lg bg-neutral-900/80 border border-white/10 py-1 px-3 text-[10px] font-black uppercase tracking-wider text-neutral-300 flex items-center gap-1">
                <MapPin size={12} className="text-primary" />
                <span>On-Site Venue</span>
              </span>
            )}
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Ticket size={14} />
              <span>{event.price_info}</span>
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Event Details & Discussions (Col Span 8) */}
          <div className="space-y-8 lg:col-span-8">
            
            {/* Quick Meta Stats Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl border border-white/5 bg-[#08080a] p-6">
              {/* Date & Time */}
              <div className="flex items-start gap-3.5">
                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 text-primary shrink-0">
                  <Calendar size={20} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Tanggal & Jam</span>
                  <p className="text-xs font-bold text-white">{formattedFullDate}</p>
                  <p className="text-xs text-neutral-400 font-mono">
                    {startTimeStr} {endTimeStr ? `- ${endTimeStr} WIB` : 'WIB - Selesai'}
                  </p>
                </div>
              </div>

              {/* Venue & Maps */}
              <div className="flex items-start gap-3.5">
                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 text-primary shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Lokasi Acara</span>
                  <p className="text-xs font-bold text-white">{event.location}</p>
                  {event.maps_url && (
                    <a
                      href={event.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                    >
                      <span>Buka di Google Maps</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* WYSIWYG Description Card */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-primary border-b border-white/5 pb-3">
                TENTANG EVENT INI
              </h2>
              <div 
                className="space-y-4 text-neutral-300 text-sm leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>

            {/* Gallery Media Section (Videos & Images) */}
            {event.gallery_media && event.gallery_media.length > 0 && (
              <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary border-b border-white/5 pb-3">
                  <ImageIcon size={14} />
                  <span>DOKUMENTASI & MEDIA EVENT ({event.gallery_media.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.gallery_media.map((med, idx) => {
                    if (med.type === 'video') {
                      const ytId = extractYouTubeId(med.url);
                      return (
                        <div key={idx} className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
                          {ytId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
                              title={`Video Dokumentasi ${idx + 1}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="h-full w-full border-none"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted">
                              <a href={med.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                Tonton Video di Browser &rarr;
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                        <img
                          src={med.url}
                          alt={`Dokumentasi ${idx + 1}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Discussions & Comments Section */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-white border-b border-white/5 pb-4">
                <MessageSquare size={18} className="text-primary" />
                <span>DISKUSI EVENT ({comments.length})</span>
              </h3>

              {/* Form Input Komentar */}
              {user.isLoggedIn ? (
                <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-10 w-10 rounded-full object-cover border border-primary/20 shrink-0"
                  />
                  <div className="flex-1 space-y-3">
                    <textarea
                      placeholder="Tuliskan pertanyaan, tanggapan, atau antusiasme Anda mengenai event ini..."
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
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary-hover disabled:opacity-50"
                      >
                        <Send size={12} />
                        <span>{submittingComment ? 'Mengirim...' : 'Kirim Komentar'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-black/40 p-6 text-center space-y-2">
                  <p className="text-xs text-muted">
                    Hanya member Immortal Division yang dapat berpartisipasi dalam diskusi event.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                  >
                    Masuk / Daftar Member untuk Berkomentar &rarr;
                  </button>
                </div>
              )}

              {/* Daftar Komentar */}
              <div className="space-y-4 pt-2">
                {comments.length > 0 ? (
                  comments.map((comm) => (
                    <div key={comm.id} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-b-0">
                      <img
                        src={comm.avatar_url}
                        alt={comm.username}
                        className="h-10 w-10 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">@{comm.username}</span>
                            <span className="text-[10px] text-muted font-mono">
                              {new Date(comm.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {(user.isAdmin || user.id === comm.user_id) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comm.id)}
                              title="Hapus Komentar"
                              className="text-neutral-500 hover:text-rose-400 transition p-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-neutral-300 text-xs leading-relaxed whitespace-pre-line">{comm.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-neutral-600">
                    Belum ada komentar di event ini. Jadilah yang pertama berkomentar!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Ticket / RSVP Action & Other Events (Col Span 4) */}
          <div className="space-y-6 lg:col-span-4">
            
            {/* Ticket / Action Card */}
            <div className="rounded-3xl border border-primary/20 bg-[#08080a] p-6 space-y-6 sticky top-24">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Akses Event</span>
                <h3 className="text-2xl font-black text-white">{event.price_info}</h3>
              </div>

              <div className="space-y-3 pt-2">
                {isPast ? (
                  <div className="rounded-xl bg-white/5 p-4 text-center text-xs font-bold uppercase text-neutral-500">
                    Event Ini Telah Selesai
                  </div>
                ) : isFree ? (
                  <button
                    onClick={() => setRsvpModalOpen(true)}
                    className="w-full flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover active:scale-98"
                  >
                    <Ticket size={16} />
                    <span>Daftar RSVP Gratis</span>
                  </button>
                ) : (
                  <a
                    href={event.ticket_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover active:scale-98"
                  >
                    <Ticket size={16} />
                    <span>Beli Tiket di Partner</span>
                    <ExternalLink size={14} />
                  </a>
                )}

                {event.maps_url && (
                  <a
                    href={event.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
                  >
                    <MapPin size={14} className="text-primary" />
                    <span>Petunjuk Arah Google Maps</span>
                  </a>
                )}
              </div>

              {/* Event Perks */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-primary" />
                  <span>Akses live showcase audio analog</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-primary" />
                  <span>Ruang diskusi interaktif sesama member</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-primary" />
                  <span>Merchandise exclusive pop-up booth</span>
                </div>
              </div>
            </div>

            {/* Other Events Card */}
            {otherEvents.length > 0 && (
              <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-3">
                  EVENT LAINNYA
                </h3>
                <div className="space-y-3">
                  {otherEvents.map(other => (
                    <Link
                      key={other.id}
                      href={`/events/${other.id}`}
                      className="group flex gap-3 items-center rounded-xl p-2 hover:bg-white/5 transition"
                    >
                      <img
                        src={other.cover_image}
                        alt={other.title}
                        className="h-12 w-16 rounded-lg object-cover shrink-0 border border-white/5"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-primary transition truncate">
                          {other.title}
                        </h4>
                        <p className="text-[10px] text-muted">
                          {new Date(other.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-neutral-500 group-hover:text-white transition" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* RSVP Free Modal */}
      <AnimatePresence>
        {rsvpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setRsvpModalOpen(false);
                setRsvpSuccess(false);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-primary/20 bg-[#0a0a0c] p-8 shadow-2xl glass-red"
            >
              {!rsvpSuccess ? (
                <form onSubmit={handleRSVPSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">Konfirmasi RSVP</span>
                    <h3 className="text-xl font-black uppercase text-white">{event.title}</h3>
                    <p className="text-xs text-muted">Silakan masukkan identitas untuk pendaftaran kursi Anda.</p>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Budi Darmawan"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Email Konfirmasi</label>
                    <input
                      type="email"
                      required
                      placeholder="budi@example.com"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                    >
                      Daftar Sekarang
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpModalOpen(false)}
                      className="px-4 rounded-xl bg-white/5 text-xs font-bold uppercase text-neutral-400 hover:text-white transition"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white">RSVP Berhasil Terdaftar!</h3>
                  <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted">Kode Tiket / Booking Ref</span>
                    <p className="text-lg font-mono font-black text-primary">{ticketRef}</p>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Tunjukkan kode tiket ini saat kedatangan di lokasi acara ({event.location}).
                  </p>
                  <button
                    onClick={() => {
                      setRsvpModalOpen(false);
                      setRsvpSuccess(false);
                    }}
                    className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-bold uppercase text-white hover:bg-white/20 transition"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
