'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Mail, Lock, User, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login, signup } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isSignUp) {
        if (!username || !email || !password) {
          setErrorMsg('Username, email, dan password wajib diisi.');
          return;
        }
        await signup(username, fullName || username, email, bio, password);
      } else {
        if (!email || !password) {
          setErrorMsg('Email dan password wajib diisi.');
          return;
        }
        login(email, password);
      }
      // Reset forms
      setEmail('');
      setPassword('');
      setUsername('');
      setFullName('');
      setBio('');
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Proses autentikasi gagal.');
    }
  };

  const handleGoogleMock = () => {
    if (isSignUp) {
      signup('google_fan', 'Google Guest', 'guest@gmail.com', 'Registered via Google Mock Auth.');
    } else {
      login('guest@gmail.com');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAuthModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-[#0a0a0c]/90 p-8 shadow-2xl glass-red"
        >
          {/* Close button */}
          <button 
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 rounded-full p-1 text-muted transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold uppercase tracking-wider text-white">
              {isSignUp ? 'Join' : 'Welcome'}{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Club
              </span>
            </h2>
            <p className="mt-1 text-sm text-muted">
              {isSignUp ? 'Create an account for exclusive access' : 'Enter your details to access member perks'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-950/30 p-3 text-xs font-semibold text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Username</label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. joko_beat"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-white outline-none placeholder:text-neutral-600 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={16} />
                    <input
                      type="text"
                      placeholder="e.g. Joko Prabowo (opsional)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-white outline-none placeholder:text-neutral-600 focus:border-primary/50"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                {isSignUp ? 'Alamat Email' : 'Email atau Username'}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="text"
                  required
                  placeholder={isSignUp ? 'name@example.com' : 'name@example.com atau username'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-white outline-none placeholder:text-neutral-600 focus:border-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-white outline-none placeholder:text-neutral-600 focus:border-primary/50"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Short Bio</label>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 text-muted" size={16} />
                  <textarea
                    placeholder="Tell us about your musical interests..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-white outline-none placeholder:text-neutral-600 focus:border-primary/50 resize-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary to-accent py-3 font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/20 transition duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-between">
            <span className="h-[1px] w-full bg-white/10" />
            <span className="px-4 text-xs font-semibold uppercase tracking-widest text-muted">OR</span>
            <span className="h-[1px] w-full bg-white/10" />
          </div>

          {/* Social Sign-in */}
          <button
            onClick={handleGoogleMock}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Bottom Switch Toggle */}
          <p className="mt-6 text-center text-sm text-muted">
            {isSignUp ? 'Already a member?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="font-bold text-primary transition hover:underline"
            >
              {isSignUp ? 'Sign In Now' : 'Sign Up Free'}
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
