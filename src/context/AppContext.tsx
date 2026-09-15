'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  getCurrentUserSession, 
  signUpMock, 
  signUpMember, 
  loginMock, 
  logoutMock, 
  updateProfileMock, 
  UserSession, 
  MusicTrack 
} from '@/lib/db';

interface AppContextProps {
  // Auth State
  user: UserSession;
  login: (email: string, password?: string) => void;
  signup: (username: string, fullName: string, email: string, bio: string) => Promise<UserSession>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<UserSession, 'id' | 'isLoggedIn'>>) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  
  // Audio Player State
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  lyricsOpen: boolean;
  setLyricsOpen: (open: boolean) => void;
  currentTime: number;
  duration: number;
  seekTrack: (time: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<UserSession>({
    id: '',
    username: '',
    fullName: '',
    email: '',
    avatarUrl: '',
    bio: '',
    isLoggedIn: false,
    isAdmin: false
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load user session on mount
  useEffect(() => {
    setUser(getCurrentUserSession());
  }, []);

  // Sync HTML5 Audio element actions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle Track Source Changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const isSameSource = audio.src === currentTrack.audio_url;
    if (!isSameSource) {
      audio.src = currentTrack.audio_url;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Audio play failed:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  // Handle Volume Change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auth Methods
  const handleLogin = (email: string, password?: string) => {
    const session = loginMock(email, password);
    setUser(session);
    setShowAuthModal(false);
  };

  const handleSignup = async (username: string, fullName: string, email: string, bio: string) => {
    const session = await signUpMember(username, fullName, email, bio);
    setUser(session);
    setShowAuthModal(false);
    return session;
  };

  const handleLogout = () => {
    logoutMock();
    setUser({
      id: '',
      username: '',
      fullName: '',
      email: '',
      avatarUrl: '',
      bio: '',
      isLoggedIn: false,
      isAdmin: false
    });
  };

  const handleUpdateProfile = (data: Partial<Omit<UserSession, 'id' | 'isLoggedIn'>>) => {
    const session = updateProfileMock(data);
    setUser(session);
  };

  // Audio Methods
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const seekTrack = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
        showAuthModal,
        setShowAuthModal,
        
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        togglePlay,
        lyricsOpen,
        setLyricsOpen,
        currentTime,
        duration,
        seekTrack,
        volume,
        setVolume
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
