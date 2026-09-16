'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getEpisodes, getBlogPosts, Episode, BlogPost } from '@/lib/db';
import { User, LogOut, Edit3, Save, Sparkles, Lock, Play, Newspaper, CheckCircle, Camera, Upload, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MemberPage() {
  const { user, login, signup, logout, updateProfile } = useApp();
  
  // Auth Form local states (if accessed as guest)
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState('');

  // Dashboard edit local states
  const [editMode, setEditMode] = useState(false);
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  ];

  // Exclusive contents states
  const [exclusiveEps, setExclusiveEps] = useState<Episode[]>([]);
  const [exclusiveArticles, setExclusiveArticles] = useState<BlogPost[]>([]);

  // Sync edit fields when user status loaded
  useEffect(() => {
    if (user.isLoggedIn) {
      setEditFullName(user.fullName || '');
      setEditBio(user.bio || '');
      setEditAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  // Load exclusive contents
  useEffect(() => {
    const loadExclusives = async () => {
      const allEps = await getEpisodes();
      const allPosts = await getBlogPosts();
      
      setExclusiveEps(allEps.filter(e => e.is_exclusive));
      // Standard blog posts are accessible, but we can display recommended reads for members
      setExclusiveArticles(allPosts.slice(0, 2));
    };
    loadExclusives();
  }, []);

  const [regError, setRegError] = useState('');

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('Ukuran file foto maksimal 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditAvatarUrl(reader.result);
        setSaveError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (isSignUp) {
      if (!username || !email || !password) {
        setRegError('Username, email, dan password wajib diisi.');
        return;
      }
      try {
        await signup(username, fullName || username, email, bio, password);
      } catch (err: any) {
        setRegError(err.message || 'Pendaftaran gagal.');
      }
    } else {
      if (!email || !password) {
        setRegError('Email/username dan password wajib diisi.');
        return;
      }
      try {
        login(email, password);
      } catch (err: any) {
        setRegError(err.message || 'Login gagal.');
      }
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setIsSaving(true);
    try {
      await updateProfile({
        fullName: editFullName,
        bio: editBio,
        avatarUrl: editAvatarUrl
      });
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || 'Gagal menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user.isLoggedIn) {
    return (
      /* GUEST GATEWAY PORTAL */
      <div className="bg-grid min-h-screen pt-12 pb-24 flex items-center justify-center">
        <div className="mx-auto w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-primary/20 bg-[#0a0a0c]/90 p-8 shadow-2xl glass-red"
          >
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                <Sparkles size={12} className="animate-pulse" />
                <span>Immortal Division Club</span>
              </span>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-wider text-white">
                MEMBER ZONE
              </h1>
              <p className="mt-1 text-xs text-muted">
                {isSignUp ? 'Daftar untuk menikmati akses exclusive video dan diskusi forum.' : 'Sign in untuk mengelola profile dan melihat konten member Anda.'}
              </p>
            </div>

            {regError && (
              <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-950/30 p-3 text-xs font-semibold text-rose-400">
                {regError}
              </div>
            )}
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              {isSignUp ? (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Username <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. joko_beat (wajib)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-neutral-500">Username unik untuk identitas member dan diskusi.</p>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Joko Prabowo (opsional)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Password <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pr-10 px-4 text-xs text-white outline-none focus:border-primary/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Bio Singkat</label>
                    <textarea
                      placeholder="Ceritakan ketertarikan musik Anda..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Email atau Username <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="name@example.com atau username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Password <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pr-10 px-4 text-xs text-white outline-none focus:border-primary/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-primary py-3.5 font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:scale-102 active:scale-98"
              >
                {isSignUp ? 'Daftar Sebagai Member' : 'Masuk ke Portal Member'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted">
              {isSignUp ? 'Sudah memiliki akun?' : 'Belum bergabung menjadi member?'}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setRegError('');
                }}
                className="font-bold text-primary hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Daftar Akun Baru'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    /* MEMBER DASHBOARD */
    <div className="bg-grid min-h-screen pt-12 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Profile Card & Actions (Col Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Info block */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 text-center relative overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-xl" />
              
              <div className="relative space-y-4">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="mx-auto h-24 w-24 rounded-full object-cover border-2 border-primary shadow-lg shadow-primary/15"
                />
                
                <div>
                  <h2 className="text-xl font-bold text-white leading-snug">{user.fullName}</h2>
                  <p className="text-xs text-muted mt-0.5">@{user.username}</p>
                </div>

                <p className="text-xs text-neutral-400 bg-black/40 rounded-xl p-3 border border-white/5 whitespace-pre-line leading-relaxed">
                  {user.bio || 'Tidak ada bio ditulis.'}
                </p>

                {/* Edit Toggle Button */}
                {!editMode ? (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditAvatarUrl(user.avatarUrl || '');
                      setEditFullName(user.fullName || '');
                      setEditBio(user.bio || '');
                      setSaveError('');
                    }}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                  >
                    <Edit3 size={12} />
                    <span>Edit Foto Profil & Bio</span>
                  </button>
                ) : (
                  <form onSubmit={handleProfileSave} className="space-y-4 text-left pt-3 border-t border-white/5">
                    {saveError && (
                      <div className="rounded-xl border border-rose-500/20 bg-rose-950/30 p-2.5 text-[11px] font-semibold text-rose-400">
                        {saveError}
                      </div>
                    )}

                    {/* Photo Profile Section */}
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted">
                        Ubah Foto Profil
                      </label>

                      {/* Live Avatar Preview */}
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={editAvatarUrl || user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt="Preview Avatar"
                          className="h-16 w-16 rounded-full object-cover border-2 border-primary/50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="file"
                            id="member-avatar-file"
                            accept="image/png,image/jpeg,image/webp,image/jpg"
                            onChange={handleAvatarFile}
                            className="hidden"
                          />
                          <label
                            htmlFor="member-avatar-file"
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-[11px] font-bold text-white hover:bg-white/10 hover:border-primary/40 transition"
                          >
                            <Upload size={12} className="text-primary" />
                            <span>Pilih Gambar Perangkat</span>
                          </label>
                          <span className="block text-[9px] text-neutral-500 mt-1">Format .jpg, .png, .webp (Maks 2MB)</span>
                        </div>
                      </div>

                      {/* URL input */}
                      <div className="mb-2">
                        <input
                          type="text"
                          placeholder="Atau tempel link URL foto..."
                          value={editAvatarUrl}
                          onChange={(e) => setEditAvatarUrl(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-black/60 py-2 px-3 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>

                      {/* Presets */}
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 block mb-1.5">Atau Pilih Preset Avatar:</span>
                        <div className="flex gap-2">
                          {avatarPresets.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditAvatarUrl(preset)}
                              className={`h-8 w-8 rounded-full overflow-hidden border-2 transition ${
                                editAvatarUrl === preset ? 'border-primary scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={preset} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/60 py-2 px-3 text-xs text-white outline-none focus:border-primary/50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Bio Singkat</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={3}
                        placeholder="Tuliskan bio profil Anda..."
                        className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-xs text-white outline-none focus:border-primary/50 resize-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-primary py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover disabled:opacity-50"
                      >
                        <Save size={12} />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setSaveError('');
                        }}
                        className="rounded-lg bg-white/5 px-4 py-2.5 text-xs font-bold uppercase text-neutral-400 hover:bg-white/10 hover:text-white"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}

                {saveSuccess && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle size={12} />
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                {/* Sign out */}
                <button
                  onClick={logout}
                  className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-900/20 bg-rose-950/15 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-400 transition hover:bg-rose-950/30"
                >
                  <LogOut size={12} />
                  <span>Logout Account</span>
                </button>

              </div>
            </div>

            {/* Privileges checklist */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-3">
                MEMBER BENEFITS STATUS
              </h3>
              
              <ul className="space-y-2 text-xs text-neutral-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Full access to Member Gated Videos (Unlocked).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Write comments on episodes & articles (Unlocked).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Participate in community forums (Unlocked).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Subscribe to newsletter rate card deals.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Exclusive Gated Contents Feed (Col Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Exclusive Video Row */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-primary animate-pulse" />
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  UNLOCKED EXCLUSIVE EPISODES
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {exclusiveEps.map((ep) => (
                  <div
                    key={ep.id}
                    className="group relative flex overflow-hidden rounded-2xl border border-white/5 bg-[#08080a] p-4 gap-4 transition hover:border-primary/20"
                  >
                    <Link
                      href={`/programs/studio-sessions?ep=${ep.id}`}
                      className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-white/5"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${ep.youtube_id}/default.jpg`}
                        alt={ep.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play size={16} fill="white" className="text-white" />
                      </div>
                    </Link>

                    <div className="min-w-0 space-y-1 py-1">
                      <span className="rounded bg-primary/15 border border-primary/25 px-2 py-0.5 text-[8px] font-black tracking-widest text-primary uppercase">
                        Member Special
                      </span>
                      <Link
                        href={`/programs/studio-sessions?ep=${ep.id}`}
                        className="block text-xs font-bold text-white transition hover:text-primary leading-snug truncate"
                      >
                        {ep.title}
                      </Link>
                      <span className="text-[9px] text-muted block">Duration: {ep.duration}</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Member Recommended Articles */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Newspaper size={16} className="text-primary" />
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  RECOMMENDED FOR MEMBERS
                </h3>
              </div>

              <div className="space-y-4">
                {exclusiveArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-white/5 bg-black/40 transition hover:border-white/10"
                  >
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="h-24 w-full sm:w-36 rounded-xl object-cover shrink-0 border border-white/5"
                    />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                        {article.category}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary hover:underline pt-2"
                      >
                        Read Article &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
