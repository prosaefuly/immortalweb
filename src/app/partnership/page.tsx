'use client';

import React, { useState, useEffect } from 'react';
import { 
  submitInquiry, 
  getB2BContent, 
  getPartnerBrands, 
  B2BContent, 
  PartnerBrand, 
  defaultB2BContent, 
  defaultPartnerBrands 
} from '@/lib/db';
import { Briefcase, Download, Send, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PartnershipPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Sponsorship');
  const [otherSubject, setOtherSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dynamic Content & Brands from Admin / Database
  const [b2bContent, setB2bContent] = useState<B2BContent>(defaultB2BContent);
  const [partnerBrands, setPartnerBrands] = useState<PartnerBrand[]>(defaultPartnerBrands);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getB2BContent(), getPartnerBrands()]).then(([content, brands]) => {
      if (isMounted) {
        if (content) setB2bContent(content);
        if (brands && brands.length > 0) setPartnerBrands(brands);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    if (subject === 'Other' && !otherSubject.trim()) {
      alert('Mohon tuliskan maksud atau bentuk kolaborasi Anda!');
      return;
    }

    const finalSubject = subject === 'Other'
      ? `Lainnya: ${otherSubject.trim()}`
      : subject;

    setSubmitting(true);
    const ok = await submitInquiry({
      name,
      company,
      email,
      subject: finalSubject,
      message
    });
    setSubmitting(false);

    if (ok) {
      setSuccess(true);
      // Clear forms
      setName('');
      setCompany('');
      setEmail('');
      setSubject('Sponsorship');
      setOtherSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const handlePitchDeckDownload = () => {
    if (b2bContent.pitch_deck_url) {
      // Direct link or Data URL download
      const link = document.createElement('a');
      link.href = b2bContent.pitch_deck_url;
      link.download = `${(b2bContent.pitch_deck_title || 'Immortal-Division-Pitch-Deck').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate actual informative text document if admin has not uploaded custom PDF
      const deckInfo = `IMMORTAL DIVISION - PITCH DECK 2026\n` +
        `==================================================\n\n` +
        `TENTANG KAMI:\n` +
        `Immortal Division adalah sebuah wadah yang membahas musik, seni budaya, dan olahraga-olahraga extreme yang ada di seluruh jagat raya.\n\n` +
        `KENAPA BERMITRA DENGAN IMMORTAL DIVISION:\n` +
        `${b2bContent.why_description || 'Kami membangun ekosistem jurnalisme dan video musik terkurasi dengan audiens yang berfokus pada demografi urban, tech-savvy, dan pendukung produk kreatif.'}\n\n` +
        `POIN KEUNGGULAN:\n` +
        (b2bContent.why_points && b2bContent.why_points.length > 0 
          ? b2bContent.why_points.map((p, i) => `${i + 1}. ${p}`).join('\n')
          : '1. Akses audiens pecinta musik alternatif & sub-kultur.\n2. Integrasi program talkshow, live music, dan media sosial.\n3. Kolaborasi merchandise eksklusif di galeri seni.') + `\n\n` +
        `PELUANG KEMITRAAN & SPONSORSHIP:\n` +
        `- Sponsorship Event & Stage Activations\n` +
        `- Advertising, Review Media & Banner Digital\n` +
        `- Exclusive Merch Collaborations & Art Showcases\n` +
        `- Talkshow & Video Series Co-Branding\n\n` +
        `KONTAK RESMI BUSINESS DEVELOPMENT:\n` +
        `Email: partnership@immortaldivision.com\n` +
        `Website: https://immortaldivision.com/partnership\n`;

      const blob = new Blob([deckInfo], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(b2bContent.pitch_deck_title || 'Immortal-Division-Pitch-Deck-2026').replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
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
            COLLABORATE WITH <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">IMMORTAL</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted md:mx-0"
          >
            Hubungkan brand Anda dengan ratusan ribu komunitas pencinta musik independen, penikmat seni, dan pendukung kultur kreatif di tanah air.
          </motion.p>
        </div>

        {/* Partnership Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left Column: Pitch Deck & Info (Col Span 5) */}
          <div className="space-y-8 lg:col-span-5">
            
            {/* Promo Pitch Box ("Kenapa Bermitra dengan Immortal Division") */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-4 shadow-lg">
              <h3 className="text-xl font-bold text-white">
                {b2bContent.why_title || 'Kenapa Bermitra dengan Immortal Division?'}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {b2bContent.why_description || 'Kami membangun ekosistem jurnalisme dan video musik terkurasi dengan audiens yang berfokus pada demografi urban, tech-savvy, dan pendukung produk kreatif.'}
              </p>
              
              {b2bContent.why_points && b2bContent.why_points.length > 0 && (
                <ul className="space-y-3 pt-2 text-sm text-neutral-300">
                  {b2bContent.why_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pitch Deck Download Banner (Replaced Media Kit) */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-red-950/20 via-black to-neutral-900/40 p-6 md:p-8 glass-red shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <h3 className="text-lg font-bold text-white">
                  {b2bContent.pitch_deck_title || 'Immortal Division Pitch Deck 2026'}
                </h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {b2bContent.pitch_deck_desc || 'Unduh presentasi deck kami berisi demografi audiens lengkap, rate card iklan, paket sponsorship event, dan studi kasus kemitraan kami.'}
              </p>
              <button
                type="button"
                onClick={handlePitchDeckDownload}
                className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                <Download size={14} />
                <span>Unduh Pitch Deck (PDF)</span>
              </button>
            </div>

            {/* Partner Logos Marquee Ribbon ("Brands Who Trust Us") */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white text-center md:text-left">
                BRANDS WHO TRUST US
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {partnerBrands.map((partner) => {
                  const content = (
                    <div className="flex h-20 w-full items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-4 text-center transition hover:border-primary/30 hover:bg-black/60 group">
                      {partner.logo_url ? (
                        <img 
                          src={partner.logo_url} 
                          alt={partner.name}
                          className="max-h-10 max-w-[85%] object-contain filter grayscale group-hover:grayscale-0 transition opacity-70 group-hover:opacity-100"
                        />
                      ) : (
                        <span className="font-sans text-xs font-black tracking-widest text-neutral-400 uppercase group-hover:text-white transition line-clamp-2">
                          {partner.name}
                        </span>
                      )}
                    </div>
                  );

                  return partner.website_url ? (
                    <a
                      key={partner.id || partner.name}
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      title={partner.name}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={partner.id || partner.name}>
                      {content}
                    </div>
                  );
                })}
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
                      Terima kasih atas minat kolaborasi Anda. Kami telah merekam detail inquiry Anda dan tim kami akan segera menghubungi kontak Anda.
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

                  {/* Manual Input when selecting 'Other' */}
                  {subject === 'Other' && (
                    <div className="space-y-1 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white">
                        Tuliskan Maksud / Bentuk Kolaborasi Anda <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Misal: Kurasi Playlist Khusus, Co-branding Event Olahraga Extreme, Dokumenter Khusus, dll."
                        value={otherSubject}
                        onChange={(e) => setOtherSubject(e.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-black/60 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/80"
                      />
                      <p className="text-[11px] text-neutral-400">
                        Jelaskan secara singkat jenis kemitraan yang Anda harapkan sebelum menjelaskan detail proposal di bawah.
                      </p>
                    </div>
                  )}

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
                    <span>{submitting ? 'Mengirim Pesan...' : 'Kirim Inquiry Bisnis'}</span>
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
