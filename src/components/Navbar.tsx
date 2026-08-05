'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, X, LogIn, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, setShowAuthModal, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Programs', path: '/programs' },
    { label: 'Art & Music', path: '/gallery' },
    { label: 'Store', path: '/store' },
    { label: 'Blog', path: '/blog' },
    { label: 'Events', path: '/events' },
    { label: 'Partnership', path: '/partnership' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/75 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={handleLinkClick} className="group flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-black text-xl text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105 active:scale-95">
                I
              </span>
              <span className="font-sans text-2xl font-black uppercase tracking-wider text-white transition-colors group-hover:text-primary">
                Immortal<span className="text-primary group-hover:text-white">Division</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-neutral-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex md:items-center">
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pr-4 pl-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-7 w-7 rounded-full object-cover border border-primary/40"
                  />
                  <span>{user.username}</span>
                  <ChevronDown size={14} className={`text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0c0c0e] p-2 shadow-2xl glass-red z-20"
                      >
                        <Link
                          href="/member"
                          onClick={handleLinkClick}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-primary/10 hover:text-white"
                        >
                          <User size={16} className="text-primary" />
                          <span>Member Zone</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            handleLinkClick();
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-950/20"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 rounded-lg bg-primary py-2.5 px-5 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-primary/20 transition duration-300 hover:bg-primary-hover hover:scale-[1.03] active:scale-[0.97]"
              >
                <LogIn size={16} />
                <span>Join Member</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/5 bg-[#08080a] md:hidden"
          >
            <div className="space-y-1 px-4 pt-2 pb-6">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={handleLinkClick}
                    className={`block rounded-lg px-3 py-2 text-base font-bold uppercase tracking-wider transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-6 border-t border-white/5 pt-4">
                {user.isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="h-9 w-9 rounded-full object-cover border border-primary/40"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{user.fullName}</p>
                        <p className="text-xs text-muted">@{user.username}</p>
                      </div>
                    </div>
                    <Link
                      href="/member"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-300 hover:bg-white/5 hover:text-white"
                    >
                      <User size={18} className="text-primary" />
                      <span>Member Zone</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        handleLinkClick();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-rose-400 hover:bg-rose-950/20"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 px-4 text-base font-bold uppercase tracking-wider text-white shadow-md"
                  >
                    <LogIn size={18} />
                    <span>Join Member</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
