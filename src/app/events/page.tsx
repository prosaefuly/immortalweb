'use client';

import React, { useState, useEffect } from 'react';
import { getEvents, EventItem } from '@/lib/db';
import { Calendar, MapPin, Ticket, Award, CheckCircle2, ChevronRight, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  // RSVP Form Modal state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  // Categorize based on current mock date (2026-07-08)
  const currentDate = new Date('2026-07-08T17:50:37+07:00');

  const getEventStatus = (event: EventItem): 'upcoming' | 'ongoing' | 'past' => {
    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : null;
    
    if (end && currentDate >= start && currentDate <= end) {
      return 'ongoing';
    }
    if (currentDate > (end || start)) {
      return 'past';
    }
    return 'upcoming';
  };

  // Filter events list
  const filteredEvents = events.filter(event => {
    const status = getEventStatus(event);
    if (activeFilter === 'upcoming') {
      return status === 'upcoming' || status === 'ongoing';
    }
    if (activeFilter === 'past') {
      return status === 'past';
    }
    return true; // All
  });

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;

    // Generate random booking code
    const ref = `EVO-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketRef(ref);
    setRsvpSuccess(true);
  };

  const closeRSVPModal = () => {
    setSelectedEvent(null);
    setRsvpName('');
    setRsvpEmail('');
    setRsvpSuccess(false);
    setTicketRef('');
  };

  // Format dates
  const formatEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-grid min-h-screen pt-12 pb-24">
      {/* Glow Spheres */}
      <div className="pointer-events-none absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary"
          >
            <Calendar size={12} />
            <span>Community Gatherings</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl"
          >
            IMMORTAL <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">EVENTS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted md:mx-0"
          >
            Jadwal festival musik, workshop sound synthesis offline, gig studio intimate, dan webinar interaktif kami.
          </motion.p>
        </div>

        {/* Filters Row */}
        <div className="mb-10 flex border-b border-white/5 pb-4">
          <div className="flex gap-4">
            {(['all', 'upcoming', 'past'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative pb-4 text-xs font-bold uppercase tracking-wider transition ${
                  activeFilter === filter ? 'text-primary' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{filter === 'all' ? 'Semua Event' : filter === 'upcoming' ? 'Mendatang' : 'Arsip Event'}</span>
                {activeFilter === filter && (
                  <motion.span
                    layoutId="activeFilterBorder"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Events Layout Timeline/Grid */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => {
              const status = getEventStatus(event);
              const isPast = status === 'past';
              const isFree = event.price_info.toLowerCase().includes('free');

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-[#08080a] transition duration-300 md:flex-row ${
                    isPast 
                      ? 'border-white/5 opacity-65' 
                      : 'border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5'
                  }`}
                >
                  
                  {/* Left: Banner Image */}
                  <div className="relative aspect-video w-full overflow-hidden md:w-80 md:aspect-auto md:shrink-0">
                    <img
                      src={event.cover_image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden md:block" />
                    
                    {/* Status Badge */}
                    <span className={`absolute top-4 left-4 rounded py-0.5 px-2 text-[9px] font-black uppercase tracking-wider text-white ${
                      status === 'upcoming' ? 'bg-primary' : status === 'ongoing' ? 'bg-emerald-600' : 'bg-neutral-700'
                    }`}>
                      {status}
                    </span>
                  </div>

                  {/* Right: Info Contents */}
                  <div className="flex flex-1 flex-col justify-between p-6 md:p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-primary font-bold">
                          <Ticket size={14} />
                          <span>{event.price_info}</span>
                        </span>
                        <span className="text-xs text-muted">•</span>
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <MapPin size={14} className="text-primary" />
                          <span>{event.location} {event.is_online && '(Online)'}</span>
                        </span>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition leading-snug md:text-2xl">
                        {event.title}
                      </h3>
                      
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-muted pt-2">
                        <Clock size={12} className="text-primary" />
                        <span>Jadwal: {formatEventDate(event.start_date)}</span>
                      </div>
                    </div>

                    {/* Booking Action */}
                    <div className="border-t border-white/5 pt-4">
                      {isPast ? (
                        <span className="inline-flex rounded-lg bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Event Has Ended
                        </span>
                      ) : isFree ? (
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 py-2.5 px-5 text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-primary hover:text-white"
                        >
                          <span>Register RSVP Free</span>
                          <ChevronRight size={14} />
                        </button>
                      ) : (
                        <a
                          href={event.ticket_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-primary py-2.5 px-5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-primary-hover shadow-md shadow-primary/15"
                        >
                          <Ticket size={14} />
                          <span>Buy Ticket Partner</span>
                          <ChevronRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-20 text-center text-sm text-neutral-600">
              Tidak ada event di kategori ini.
            </div>
          )}
        </div>

        {/* --- RSVP MOCK MODAL --- */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeRSVPModal}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-[#0c0c0e]/90 p-8 shadow-2xl glass-red"
              >
                {/* Close Button */}
                <button
                  onClick={closeRSVPModal}
                  className="absolute top-4 right-4 rounded-full p-1 text-muted transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>

                {!rsvpSuccess ? (
                  /* Form RSVP Entry */
                  <form onSubmit={handleRSVPSubmit} className="space-y-5">
                    <div className="text-center">
                      <span className="rounded bg-primary/15 border border-primary/25 py-0.5 px-2 text-[9px] font-black uppercase tracking-wider text-primary">
                        FREE RSVP REGISTRATION
                      </span>
                      <h3 className="text-xl font-black uppercase text-white mt-2 leading-snug">
                        {selectedEvent.title}
                      </h3>
                      <p className="text-xs text-muted mt-1">Registrasi tiket gratis Anda untuk berpartisipasi online/offline.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Joko Prabowo"
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Alamat Email</label>
                        <input
                          type="email"
                          required
                          placeholder="joko@gmail.com"
                          value={rsvpEmail}
                          onChange={(e) => setRsvpEmail(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full cursor-pointer rounded-xl bg-primary py-3 font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover active:scale-95"
                    >
                      Konfirmasi Reservasi
                    </button>
                  </form>
                ) : (
                  /* Success Booking Screen */
                  <div className="text-center py-6 space-y-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 size={32} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase tracking-wider text-white">RESERVASI BERHASIL!</h3>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        Tiket akses gratis Anda telah diterbitkan. Silakan simpan kode referensi booking di bawah untuk verifikasi masuk.
                      </p>
                    </div>

                    {/* Ticket Reference Block */}
                    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 text-center font-mono glass-red">
                      <p className="text-[10px] text-muted uppercase tracking-widest">TICKET BOOKING REF</p>
                      <p className="text-2xl font-black text-white mt-1 tracking-wider">{ticketRef}</p>
                    </div>

                    <button
                      onClick={closeRSVPModal}
                      className="w-full rounded-xl bg-white/5 border border-white/10 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                    >
                      Tutup Window
                    </button>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
