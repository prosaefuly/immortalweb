'use client';

import React, { useState } from 'react';
import { submitInquiry } from '@/lib/db';
import { Briefcase, Download, Send, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PartnershipPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Sponsorship');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const partners = [
    { name: 'MUTE Records', logo: 'MR' },
    { name: 'RetroSynth Labs', logo: 'RL' },
    { name: 'Kopi & Beats', logo: 'KB' },
    { name: 'Blok M Vinyl', logo: 'BMV' },
    { name: 'Giga Stage Indo', logo: 'GSI' },
    { name: 'Beatmakers ID', logo: 'BID' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    const ok = await submitInquiry({
      name,
      company,
      email,
      subject,
      message
    });
    setSubmitting(false);

    if (ok) {
      setSuccess(true);
      // Clear forms
      setName('');
      setCompany('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const handleMediaKitDownload = () => {
    // Mock downloading file by opening a text file or triggering a download notice
    alert('EvoluMedia Media Kit PDF (2026 Edition) has been generated & downloaded successfully!');
  };

  return (
    <div className="bg-grid min-h-screen pt-12 pb-24">
      {/* Glow Spheres */}
      <div className="pointer-events-none absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-16 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary"
          >
            <Briefcase size={12} />
            <span>B2B Collaboration Zone</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl"
          >
            COLLABORATE WITH <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">EVOLU</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted md:mx-0"
          >
            Hubungkan brand Anda dengan ratusan ribu komunitas pencinta musik independen, penikmat audio, dan desainer kreatif di tanah air.
          </motion.p>
        </div>

        {/* Partnership Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left Column: Media Kit & Info (Col Span 5) */}
          <div className="space-y-8 lg:col-span-5">
            
            {/* Promo Pitch Box */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-4">
              <h3 className="text-xl font-bold text-white">Kenapa Bermitra dengan EvoluMedia?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Kami membangun ekosistem jurnalisme dan video musik terkurasi dengan audiens yang berfokus pada demografi urban, tech-savvy, dan pendukung produk kreatif.
              </p>
              
              <ul className="space-y-3 pt-2 text-sm text-neutral-300">
                <li className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Akses audiens pecinta musik alternatif & sub-kultur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Integrasi program talkshow, live music, dan media sosial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Kolaborasi merchandise eksklusif di galeri seni.</span>
                </li>
              </ul>
            </div>

            {/* Media Kit Download Banner */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-red-950/20 via-black to-neutral-900/40 p-6 md:p-8 glass-red shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white">EvoluMedia Media Kit 2026</h3>
              <p className="text-xs text-neutral-400">
                Unduh presentasi deck kami berisi demografi audiens lengkap, rate card iklan, paket sponsorship event, dan studi kasus kemitraan kami.
              </p>
              <button
                onClick={handleMediaKitDownload}
                className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                <Download size={14} />
                <span>Unduh Media Kit (PDF)</span>
              </button>
            </div>

            {/* Partner Logos Marquee Ribbon */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white text-center md:text-left">
                BRANDS WHO TRUST US
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex h-20 items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-4 text-center transition hover:border-primary/20"
                  >
                    <span className="font-sans text-xs font-black tracking-widest text-neutral-500 uppercase">
                      {partner.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form Sheet (Col Span 7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
              
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-white">PARTNERSHIP INQUIRY FORM</h3>
                <p className="text-xs text-muted mt-1">Isi form berikut dan tim Business Development kami akan menghubungi Anda dalam waktu 1x24 jam.</p>
              </div>

              {success ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-8 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950/40 text-emerald-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Pesan Berhasil Dikirim!</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                      Terima kasih atas minat kolaborasi Anda. Kami telah merekam detail inquiry Anda dan mengirimkan email notifikasi konfirmasi ke kotak masuk Anda.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Nama Kontak</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nico Wicaksana"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                    
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Perusahaan / Brand</label>
                      <input
                        type="text"
                        placeholder="e.g. MUTE Records"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Email Bisnis</label>
                    <input
                      type="email"
                      required
                      placeholder="business@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Topik Kolaborasi</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50 accent-black"
                    >
                      <option value="Sponsorship">Sponsorship Event</option>
                      <option value="Advertising">Iklan & Review Media</option>
                      <option value="Merchandise">Kolaborasi Merchandise</option>
                      <option value="Other">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Pesan Inquiry</label>
                    <textarea
                      required
                      placeholder="Deskripsikan ide kolaborasi, anggaran promosi, atau detail proposal bisnis Anda di sini..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-primary-hover active:scale-95 disabled:opacity-50 shadow-md shadow-primary/20"
                  >
                    <Send size={12} />
                    <span>Kirim Inquiry Bisnis</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
