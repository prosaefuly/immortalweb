import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client if keys are available
const supabaseUrl = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const supabaseAnonKey = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const MASTER_ADMIN_ID = '88888888-8888-4888-a888-888888888888';

export const isValidUUID = (val?: string | null): boolean => {
  if (!val || typeof val !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (typeof window !== 'undefined') {
  console.log(
    "Immortal Division DB Connection Mode:",
    isSupabaseConfigured 
      ? "CONNECTED TO SUPABASE CLOUD ✅" 
      : "FALLBACK TO LOCAL STORAGE MOCK ❌ (Periksa file .env.local Anda)"
  );
}

// --- INTERFACES ---

export interface UserSession {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  isLoggedIn: boolean;
  isAdmin: boolean; // Admin Privilege flag
}

export interface Program {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  tags: string[];
  slug: string;
}

export interface Episode {
  id: string;
  program_id: string;
  title: string;
  description: string;
  youtube_id: string;
  season: number;
  episode_number: number;
  duration: string;
  published_at: string;
  is_exclusive: boolean;
}

export interface ArtWork {
  id: string;
  title: string;
  artist_name: string;
  description: string;
  image_url: string;
  merch_link?: string;
  category: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover_image: string;
  audio_url: string; // Direct audio file URL
  spotify_embed: string; // iframe embed HTML code
  apple_music_link: string;
  lyrics: string;
  duration: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  published_at: string;
  author: {
    full_name: string;
    avatar_url: string;
  };
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  cover_image: string;
  ticket_link?: string;
  price_info: string;
  is_online: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  episode_id?: string;
  post_id?: string;
  content: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  sizes: string[];
  category: string;
  created_at?: string;
}

export interface Order {
  id: string;
  product_id: string;
  product_name?: string; // helper to show product name
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_address: string;
  quantity: number;
  size: string;
  total_price: number;
  payment_status: string; // 'Pending' | 'Paid'
  created_at: string;
}

// --- MOCK DATABASE DEFAULT SEED DATA ---

const mockPrograms: Program[] = [
  {
    id: 'prog-1',
    title: 'Immortal Studio Sessions',
    description: 'Exclusive live performances and intimate studio raw takes from outstanding independent music artists.',
    cover_image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    tags: ['Live Music', 'Acoustic', 'Raw'],
    slug: 'studio-sessions'
  },
  {
    id: 'prog-2',
    title: 'The Underground Beat',
    description: 'Weekly deep dive podcast talking about independent artists, sub-culture events, and electronic music gear.',
    cover_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    tags: ['Talkshow', 'Gear', 'Sub-Culture'],
    slug: 'underground-beat'
  },
  {
    id: 'prog-3',
    title: 'Immortal Records Showcase',
    description: 'Documenting the songwriting and production processes behind the latest Immortal Division label releases.',
    cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    tags: ['Behind the Scenes', 'Songwriting', 'Label'],
    slug: 'records-showcase'
  }
];

const mockEpisodes: Episode[] = [
  {
    id: 'ep-1',
    program_id: 'prog-1',
    title: 'Lofi Indie Folk Set: Waves of Autumn (Live)',
    description: 'An acoustic performance of Waves of Autumn. Recorded live in Immortal Studio Room A with multi-angle capture and custom tube mic preamps.',
    youtube_id: 'coPZJz6b9jM',
    season: 1,
    episode_number: 1,
    duration: '11:45',
    published_at: '2026-06-15T12:00:00Z',
    is_exclusive: false
  },
  {
    id: 'ep-2',
    program_id: 'prog-1',
    title: 'Neon Synthpop Jam - Nightcrawler (Live)',
    description: 'High energy performance using vintage analog synths and dynamic live drumming. Experience the sound of Immortal Division live room.',
    youtube_id: 'Hq0NkrM4bF8',
    season: 1,
    episode_number: 2,
    duration: '08:20',
    published_at: '2026-06-22T12:00:00Z',
    is_exclusive: false
  },
  {
    id: 'ep-3',
    program_id: 'prog-1',
    title: '[Member Exclusive] Extended Electronic Live Set & Sound Check',
    description: 'Exclusive 30 minutes extended jam and technical talk about our Eurorack setup, live vocal processors, and lighting sync rigs.',
    youtube_id: 'n_C90GZf90Q',
    season: 1,
    episode_number: 3,
    duration: '32:15',
    published_at: '2026-06-29T12:00:00Z',
    is_exclusive: true
  },
  {
    id: 'ep-4',
    program_id: 'prog-2',
    title: 'Why Modular Synthesizers are Taking Over Indie Music',
    description: 'Host Dan discusses the revival of Eurorack modular synthesizers and how local artists integrate them into songwriting.',
    youtube_id: 'F3vY2vO3T1Q',
    season: 1,
    episode_number: 1,
    duration: '45:10',
    published_at: '2026-06-10T15:00:00Z',
    is_exclusive: false
  },
  {
    id: 'ep-5',
    program_id: 'prog-2',
    title: 'Interview with Kurosuke: Balancing Pop and Underground Nostalgia',
    description: 'We sat down with Indonesian indie-pop artist Kurosuke to talk about vintage recording equipment and mixing techniques.',
    youtube_id: 'n4X4o4D4o4Q',
    season: 1,
    episode_number: 2,
    duration: '52:40',
    published_at: '2026-06-17T15:00:00Z',
    is_exclusive: false
  }
];

const mockArtWorks: ArtWork[] = [
  {
    id: 'art-1',
    title: 'Immortal Records Showcase Poster',
    artist_name: 'VibrantRed Design',
    description: 'Limited edition high-density print poster designed for the launch event of Immortal Records.',
    image_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
    merch_link: 'https://tokopedia.com',
    category: 'Poster Art'
  },
  {
    id: 'art-2',
    title: 'Analog Synthesis Blueprint',
    artist_name: 'Studio MUTE',
    description: 'Detailed vector blueprint illustration of vintage polyphonic synthesizers.',
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    merch_link: 'https://shopee.co.id',
    category: 'Digital Art'
  },
  {
    id: 'art-3',
    title: 'Immortal Division Logo Tee (Red Edition)',
    artist_name: 'Immortal Division Team',
    description: 'Premium heavyweight cotton street-wear tee with red logo emblem embroidered on chest.',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    merch_link: 'https://tokopedia.com',
    category: 'Merchandise'
  },
  {
    id: 'art-4',
    title: 'Vinyl Records Custom Slipmat',
    artist_name: 'Analog Lover',
    description: 'Custom felt record slipmats featuring full-color Immortal Division dynamic waves.',
    image_url: 'https://images.unsplash.com/photo-1539625319135-8d62ac1e58cd?w=800&auto=format&fit=crop&q=80',
    merch_link: 'https://tokopedia.com',
    category: 'Merchandise'
  },
  {
    id: 'art-5',
    title: 'Electric Glow Cover Art',
    artist_name: 'Reza Art',
    description: 'Album cover design project blending neo-noir aesthetics with street photography.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    category: 'Digital Art'
  }
];

const mockMusicTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Midnight Echoes',
    artist: 'Luna Eclipse',
    album: 'Neon Memories',
    cover_image: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=400&auto=format&fit=crop&q=80',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    spotify_embed: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4PTG3Z6ehGkBFmzskQlI6W" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
    apple_music_link: 'https://music.apple.com',
    lyrics: `[Verse 1]\nNeon lights reflecting in the rain\nShadows dancing, whispers of the pain\nWe walk along the quiet boulevard\nCounting stars, although the sky is dark\n\n[Chorus]\nMidnight echoes, calling out your name\nIn the silence, nothing feels the same\nMidnight echoes, running through the streets\nTo the rhythm of our pounding beats\n\n[Verse 2]\nFading traces of the words you said\nPlaying like a record in my head\nAnalog warmth inside the frozen air\nI look around, but you are never there`,
    duration: '06:12'
  },
  {
    id: 'track-2',
    title: 'Hyperdrive',
    artist: 'Retro Runner',
    album: 'Outrun the Grid',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    spotify_embed: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/303D8cO6476qfL8s3K8tYQ" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
    apple_music_link: 'https://music.apple.com',
    lyrics: `[Instrumental Synth Solo]\n\n[Verse 1]\nVelocity increasing, watch it break\nEvery single choice we had to make\nFaster than the light, we cross the line\nEscaping from the boundaries of time\n\n[Chorus]\nHyperdrive, ignition sparks the flame\nWe will never play their quiet game\nHyperdrive, we accelerate the sound\nLeaving all our shadows on the ground`,
    duration: '07:05'
  },
  {
    id: 'track-3',
    title: 'Acoustic Rain',
    artist: 'Sarah & The Synths',
    album: 'Immortal Studio Live',
    cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    spotify_embed: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/1PZj4rM3tC5P9vXy6sWv9v" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
    apple_music_link: 'https://music.apple.com',
    lyrics: `[Verse 1]\nDrops of water on the wooden floor\nYou don't have to hide here anymore\nAcoustic strings blending with the storm\nKeep the fire burning, keep it warm\n\n[Chorus]\nLet the rain fall down on us tonight\nEverything is going to be alright\nAcoustic rain, washing out the noise\nListen to the beauty of your voice`,
    duration: '05:44'
  }
];

const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: '10 Indonesian Indie Music Acts You Need to Hear in 2026',
    slug: '10-indonesian-indie-acts-2026',
    excerpt: 'From dream-pop to garage rock, the archipelago is buzzing with incredible underground talent. Here are our top editor picks.',
    cover_image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
    category: 'Editor Picks',
    published_at: '2026-07-01T08:00:00Z',
    author: {
      full_name: 'Nico Wicaksana',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    },
    content: `
The Indonesian independent music scene has undergone a massive renaissance over the last few years. Driven by digital autonomy and a tight-knit gig-going community, musicians from Jakarta, Bandung, Yogyakarta, and Bali are releasing some of the most innovative and soulful music in Southeast Asia.

### 1. The Pastel Waves (Bandung)
Blending hazy shoegaze with lush orchestral synth layers, this Bandung-based quintet sounds like a dream you don't want to wake up from. Their latest EP, *Fading Mirrors*, has gained global attention on Bandcamp.

### 2. Kurosuke (Jakarta)
A staple in the modern city-pop revival, Kurosuke mixes infectious baseline rhythms with warm retro synthesizers and romantic lyricism. We recently hosted him in the [Immortal Studio Podcast](/programs/underground-beat), where he broke down his vintage instrumentation.
    `
  },
  {
    id: 'post-2',
    title: 'Review: Arturia PolyBrute 12 - The Ultimate Sound Designer Synth?',
    slug: 'arturia-polybrute-12-review',
    excerpt: 'We spend 48 hours in Room B testing the expressive MPE bed and complex routing matrix of Arturia’s new flagship analog synthesizer.',
    cover_image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&auto=format&fit=crop&q=80',
    category: 'Gear Reviews',
    published_at: '2026-07-03T10:00:00Z',
    author: {
      full_name: 'Dan Pratama',
      avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
    },
    content: `
Analog poly-synths are in a golden era, and Arturia's recent release—the **PolyBrute 12**—takes expressiveness to an entirely new level. With 12 voices of pure analog power and the new patented FullTouch® keyboard, it aims to merge acoustic keyboard realism with electronic flexibility.
    `
  }
];

const mockEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'Immortal Showcase: Vol. 1 (Jakarta)',
    description: 'An intimate evening featuring live performances by Luna Eclipse and Retro Runner, followed by an open analog synthesizer jam session.',
    location: 'Studio Room A, Immortal Division HQ, Jakarta',
    start_date: '2026-07-25T19:00:00Z',
    end_date: '2026-07-25T23:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    ticket_link: 'https://loket.com',
    price_info: 'Rp 150.000',
    is_online: false
  },
  {
    id: 'event-2',
    title: 'Workshop: Sound Synthesis for Beginners',
    description: 'A hands-on masterclass led by Dan Pratama on building patches, understanding envelope filters, and recording synth tracks.',
    location: 'Zoom Interactive Broadcast',
    start_date: '2026-08-05T14:00:00Z',
    end_date: '2026-08-05T16:30:00Z',
    cover_image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=800&auto=format&fit=crop&q=80',
    ticket_link: '#register',
    price_info: 'Free (Member RSVP)',
    is_online: true
  }
];

const mockMembersSeed: UserSession[] = [
  {
    id: MASTER_ADMIN_ID,
    username: 'master_admin',
    fullName: 'Master Admin',
    email: 'admin@immortaldivision.com',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    bio: 'Immortal Division Chief System Administrator.',
    isLoggedIn: false,
    isAdmin: true
  },
  {
    id: '22222222-2222-4222-a222-111111111111',
    username: 'vinyl_junkie',
    fullName: 'Maya Wijaya',
    email: 'maya@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Dedicated crate digger and live gig reviewer.',
    isLoggedIn: false,
    isAdmin: false
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    username: 'synth_builder',
    fullName: 'Reza Ahmad',
    email: 'reza@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Analog modular synthesizer enthusiast and gear head.',
    isLoggedIn: false,
    isAdmin: false
  }
];

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Immortal Records Oversized Tee',
    description: 'Kaos oversized katun berat 24s premium berwarna hitam pekat dengan bordir logo merah Immortal di dada depan dan sablon grafis analog waves di punggung.',
    price: 185000,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    stock: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Baju'
  },
  {
    id: 'prod-2',
    name: 'Vintage Synth Club Windbreaker',
    description: 'Jaket windbreaker tahan air dengan kerah tegak tinggi, kantong ritsleting ganda, dan lining jaring bersirkulasi udara. Sempurna untuk gig outdoor malam hari.',
    price: 320000,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    sizes: ['M', 'L', 'XL'],
    category: 'Jaket'
  },
  {
    id: 'prod-3',
    name: 'Immortal Dad Cap (Crimson Accent)',
    description: 'Topi katun twill washed dengan pengait logam kuningan di belakang. Logo grafis gelombang suara crimson disulam rapi di sisi depan.',
    price: 120000,
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    sizes: ['All Size'],
    category: 'Topi'
  },
  {
    id: 'prod-4',
    name: 'Sub-culture Utility Cargo Pants',
    description: 'Celana kargo katun ripstop dengan multi-pocket kompartemen utilitas dan sablon wave minimalis. Nyaman dipakai seharian penuh di festival.',
    price: 245000,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    sizes: ['28', '30', '32', '34'],
    category: 'Celana'
  }
];

const mockOrdersSeed: Order[] = [
  {
    id: 'IMM-ORD-882191',
    product_id: 'prod-1',
    buyer_name: 'Joko Prabowo',
    buyer_email: 'joko@gmail.com',
    buyer_phone: '628123456789',
    buyer_address: 'Jl. Senopati No. 45, Jakarta Selatan',
    quantity: 1,
    size: 'L',
    total_price: 185000,
    payment_status: 'Paid',
    created_at: '2026-07-07T12:00:00Z'
  },
  {
    id: 'IMM-ORD-476291',
    product_id: 'prod-3',
    buyer_name: 'Maya Wijaya',
    buyer_email: 'maya@gmail.com',
    buyer_phone: '628987654321',
    buyer_address: 'Pondok Indah Blok C3, Jakarta Selatan',
    quantity: 2,
    size: 'All Size',
    total_price: 240000,
    payment_status: 'Pending',
    created_at: '2026-07-08T08:30:00Z'
  }
];

// --- REACTIVE STORAGE STATE ACCESS (LOCALSTORAGE FALLBACK) ---

const getLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

// Seed LocalStorage helpers (client-side only)
const seedMockData = () => {
  if (typeof window === 'undefined') return;
  if (!window.localStorage.getItem('immortal_programs')) setLocalStorage('immortal_programs', mockPrograms);
  if (!window.localStorage.getItem('immortal_episodes')) setLocalStorage('immortal_episodes', mockEpisodes);
  if (!window.localStorage.getItem('immortal_artworks')) setLocalStorage('immortal_artworks', mockArtWorks);
  if (!window.localStorage.getItem('immortal_music')) setLocalStorage('immortal_music', mockMusicTracks);
  if (!window.localStorage.getItem('immortal_blog')) setLocalStorage('immortal_blog', mockBlogPosts);
  if (!window.localStorage.getItem('immortal_events')) setLocalStorage('immortal_events', mockEvents);
  if (!window.localStorage.getItem('immortal_members')) setLocalStorage('immortal_members', mockMembersSeed);
  if (!window.localStorage.getItem('immortal_products')) setLocalStorage('immortal_products', mockProducts);
  if (!window.localStorage.getItem('immortal_orders')) setLocalStorage('immortal_orders', mockOrdersSeed);
};

// Execute seeding immediately on module load
if (typeof window !== 'undefined') {
  seedMockData();
}

// --- DATA ACCESS LAYER DIRECT API FUNCTIONS ---

export const getPrograms = async (): Promise<Program[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('programs').select('*');
    if (!error && data) return data;
  }
  return getLocalStorage('immortal_programs', mockPrograms);
};

export const getProgramBySlug = async (slug: string): Promise<Program | undefined> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('programs').select('*').eq('slug', slug).single();
    if (!error && data) return data;
  }
  const progs = getLocalStorage('immortal_programs', mockPrograms);
  return progs.find((p: Program) => p.slug === slug);
};

export const getEpisodes = async (programId?: string): Promise<Episode[]> => {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('episodes').select('*').order('published_at', { ascending: false });
    if (programId) query = query.eq('program_id', programId);
    const { data, error } = await query;
    if (!error && data) return data as unknown as Episode[];
  }
  const eps = getLocalStorage('immortal_episodes', mockEpisodes);
  if (programId) {
    return eps.filter((e: Episode) => e.program_id === programId);
  }
  return eps;
};

export const getEpisodeById = async (id: string): Promise<Episode | undefined> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('episodes').select('*').eq('id', id).single();
    if (!error && data) return data as unknown as Episode;
  }
  const eps = getLocalStorage('immortal_episodes', mockEpisodes);
  return eps.find((e: Episode) => e.id === id);
};

export const getArtWorks = async (): Promise<ArtWork[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('art_works').select('*');
    if (!error && data) return data;
  }
  return getLocalStorage('immortal_artworks', mockArtWorks);
};

export const getMusicTracks = async (): Promise<MusicTrack[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('music_tracks').select('*');
    if (!error && data) return data;
  }
  return getLocalStorage('immortal_music', mockMusicTracks);
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (!error && data) return data as unknown as BlogPost[];
  }
  return getLocalStorage('immortal_blog', mockBlogPosts);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('slug', slug)
      .single();
    if (!error && data) return data as unknown as BlogPost;
  }
  const posts = getLocalStorage('immortal_blog', mockBlogPosts);
  return posts.find((p: BlogPost) => p.slug === slug);
};

export const getEvents = async (): Promise<EventItem[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('events').select('*').order('start_date', { ascending: true });
    if (!error && data) return data;
  }
  return getLocalStorage('immortal_events', mockEvents);
};

// --- B2B INQUIRIES & NEWSLETTER ---

export const getInquiries = async (): Promise<Inquiry[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return getLocalStorage('immortal_inquiries', []);
};

export const submitInquiry = async (data: Omit<Inquiry, 'id' | 'status' | 'created_at'>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('inquiries').insert([data]);
    return !error;
  }
  const currentInquiries = getLocalStorage('immortal_inquiries', []);
  const newInquiry: Inquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    status: 'Pending',
    created_at: new Date().toISOString()
  };
  setLocalStorage('immortal_inquiries', [...currentInquiries, newInquiry]);
  return true;
};

export const updateInquiryStatus = async (id: string, status: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    return !error;
  }
  const currentInquiries = getLocalStorage('immortal_inquiries', []);
  const updated = currentInquiries.map((inq: Inquiry) => inq.id === id ? { ...inq, status } : inq);
  setLocalStorage('immortal_inquiries', updated);
  return true;
};

export const deleteInquiry = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    return !error;
  }
  const currentInquiries = getLocalStorage('immortal_inquiries', []);
  const filtered = currentInquiries.filter((inq: Inquiry) => inq.id !== id);
  setLocalStorage('immortal_inquiries', filtered);
  return true;
};

export const subscribeNewsletter = async (email: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
    return !error;
  }
  const subscribers = getLocalStorage('immortal_newsletter', []);
  if (!subscribers.includes(email)) {
    setLocalStorage('immortal_newsletter', [...subscribers, email]);
  }
  return true;
};

// --- COMMENTS ---

export const getComments = async (target: { episodeId?: string; postId?: string }): Promise<Comment[]> => {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('comments').select('*, profiles(username, avatar_url)');
    if (target.episodeId) query = query.eq('episode_id', target.episodeId);
    if (target.postId) query = query.eq('post_id', target.postId);
    const { data, error } = await query.order('created_at', { ascending: true });
    
    if (!error && data) {
      return data.map(c => ({
        id: c.id,
        user_id: c.user_id,
        username: c.profiles?.username || 'user',
        avatar_url: c.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        episode_id: c.episode_id,
        post_id: c.post_id,
        content: c.content,
        created_at: c.created_at
      }));
    }
  }
  
  // Local storage fallback
  const defaultComments: Comment[] = [
    {
      id: 'comm-1',
      user_id: 'user-mock-1',
      username: 'vinyl_junkie',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      episode_id: 'ep-1',
      content: 'This acoustic live take sounds absolutely breathtaking! The vocals are so crisp and natural.',
      created_at: '2026-06-16T04:22:00Z'
    },
    {
      id: 'comm-2',
      user_id: 'user-mock-2',
      username: 'synth_builder',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      episode_id: 'ep-4',
      content: 'Awesome explanation on the Eurorack modules. That Mutable Instruments Clouds demo was neat!',
      created_at: '2026-06-11T16:05:00Z'
    }
  ];
  const allComments = getLocalStorage('immortal_comments', defaultComments);
  if (target.episodeId) {
    return allComments.filter((c: Comment) => c.episode_id === target.episodeId);
  }
  if (target.postId) {
    return allComments.filter((c: Comment) => c.post_id === target.postId);
  }
  return [];
};

export const addComment = async (commentData: {
  userId: string;
  username: string;
  avatarUrl: string;
  episodeId?: string;
  postId?: string;
  content: string;
}): Promise<Comment | null> => {
  if (isSupabaseConfigured && supabase) {
    const validUserId = isValidUUID(commentData.userId) ? commentData.userId : MASTER_ADMIN_ID;
    const { data, error } = await supabase.from('comments').insert([{
      user_id: validUserId,
      episode_id: isValidUUID(commentData.episodeId) ? commentData.episodeId : null,
      post_id: isValidUUID(commentData.postId) ? commentData.postId : null,
      content: commentData.content
    }]).select('*, profiles(username, avatar_url)').single();
    
    if (!error && data) {
      return {
        id: data.id,
        user_id: data.user_id,
        username: data.profiles?.username || commentData.username,
        avatar_url: data.profiles?.avatar_url || commentData.avatarUrl,
        episode_id: data.episode_id,
        post_id: data.post_id,
        content: data.content,
        created_at: data.created_at
      };
    }
  }
  
  const defaultComments: Comment[] = [];
  const allComments = getLocalStorage('immortal_comments', defaultComments);
  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    user_id: commentData.userId,
    username: commentData.username,
    avatar_url: commentData.avatarUrl,
    episode_id: commentData.episodeId,
    post_id: commentData.postId,
    content: commentData.content,
    created_at: new Date().toISOString()
  };
  
  const updatedComments = [...allComments, newComment];
  setLocalStorage('immortal_comments', updatedComments);
  return newComment;
};

// --- PRODUCTS APIs ---

export const getProducts = async (): Promise<Product[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) return data;
  }
  return getLocalStorage('immortal_products', mockProducts);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (!error && data) return data;
  }
  const prods = getLocalStorage('immortal_products', mockProducts);
  return prods.find((p: Product) => p.id === id);
};

export const addProduct = async (data: Omit<Product, 'id'>): Promise<Product> => {
  if (isSupabaseConfigured && supabase) {
    const { data: newProd, error } = await supabase.from('products').insert([data]).select().single();
    if (!error && newProd) return newProd;
    console.error('Error adding product to Supabase:', error);
  }
  const list = getLocalStorage('immortal_products', mockProducts);
  const newProd: Product = {
    ...data,
    id: `prod-${Date.now()}`
  };
  setLocalStorage('immortal_products', [...list, newProd]);
  return newProd;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting product from Supabase:', error);
  }
  const list = getLocalStorage('immortal_products', mockProducts);
  const filtered = list.filter((p: Product) => p.id !== id);
  setLocalStorage('immortal_products', filtered);
  return true;
};

// --- ORDERS APIs ---

export const getOrders = async (): Promise<Order[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('orders').select('*, products(name)').order('created_at', { ascending: false });
    if (!error && data) {
      return data.map(o => ({
        ...o,
        product_name: o.products?.name || 'Unknown Product'
      }));
    }
  }
  
  const ords = getLocalStorage('immortal_orders', mockOrdersSeed);
  const prods = getLocalStorage('immortal_products', mockProducts);
  return ords.map((o: Order) => {
    const p = prods.find((p: Product) => p.id === o.product_id);
    return {
      ...o,
      product_name: p ? p.name : 'Unknown Product'
    };
  });
};

export const placeOrder = async (data: Omit<Order, 'id' | 'payment_status' | 'created_at'>): Promise<string> => {
  const orderId = `IMM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('orders').insert([{
      id: orderId,
      product_id: isValidUUID(data.product_id) ? data.product_id : null,
      buyer_name: data.buyer_name,
      buyer_email: data.buyer_email,
      buyer_phone: data.buyer_phone,
      buyer_address: data.buyer_address,
      quantity: data.quantity,
      size: data.size,
      total_price: data.total_price,
      payment_status: 'Pending'
    }]);
    if (!error) return orderId;
  }

  const list = getLocalStorage('immortal_orders', mockOrdersSeed);
  const newOrder: Order = {
    ...data,
    id: orderId,
    payment_status: 'Pending',
    created_at: new Date().toISOString()
  };
  setLocalStorage('immortal_orders', [...list, newOrder]);
  
  // Deduct product stock
  const prods = getLocalStorage('immortal_products', mockProducts);
  const updatedProds = prods.map((p: Product) => {
    if (p.id === data.product_id) {
      return {
        ...p,
        stock: Math.max(0, p.stock - data.quantity)
      };
    }
    return p;
  });
  setLocalStorage('immortal_products', updatedProds);

  return orderId;
};

export const updateOrderStatus = async (id: string, status: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('orders').update({ payment_status: status }).eq('id', id);
    if (!error) return true;
    console.error('Error updating order status in Supabase:', error);
  }
  const list = getLocalStorage('immortal_orders', mockOrdersSeed);
  const updated = list.map((o: Order) => o.id === id ? { ...o, payment_status: status } : o);
  setLocalStorage('immortal_orders', updated);
  return true;
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting order from Supabase:', error);
  }
  const list = getLocalStorage('immortal_orders', mockOrdersSeed);
  const filtered = list.filter((o: Order) => o.id !== id);
  setLocalStorage('immortal_orders', filtered);
  return true;
};

// --- AUTHENTICATION MOCK STATE ---

const defaultSession: UserSession = {
  id: '',
  username: '',
  fullName: '',
  email: '',
  avatarUrl: '',
  bio: '',
  isLoggedIn: false,
  isAdmin: false
};

export const getCurrentUserSession = (): UserSession => {
  return getLocalStorage('immortal_session', defaultSession);
};

export const signUpMock = (username: string, fullName: string, email: string, bio: string): UserSession => {
  const newSession: UserSession = {
    id: `user-${Date.now()}`,
    username: username.toLowerCase().replace(/\s+/g, '_'),
    fullName,
    email,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: bio || 'Immortal Division music enthusiast.',
    isLoggedIn: true,
    isAdmin: false
  };
  setLocalStorage('immortal_session', newSession);
  
  // Register in list
  addMemberToMockList(newSession);
  return newSession;
};

export const signUpMember = async (username: string, fullName: string, email: string, bio: string): Promise<UserSession> => {
  const cleanUsername = username.toLowerCase().replace(/\s+/g, '_');
  const avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const newBio = bio || 'Immortal Division community member.';
  
  let memberId = '';

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Check if username already exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existing) {
        throw new Error('Username sudah digunakan oleh member lain!');
      }

      // 2. Insert into profiles table
      const insertPayload: any = {
        username: cleanUsername,
        full_name: fullName,
        email: email,
        avatar_url: avatarUrl,
        bio: newBio,
        is_admin: false
      };

      const { data: newProfile, error: insErr } = await supabase
        .from('profiles')
        .insert([insertPayload])
        .select()
        .single();

      if (!insErr && newProfile) {
        memberId = newProfile.id;
      } else {
        console.error('Error inserting member to Supabase profiles:', insErr);
      }
    } catch (e: any) {
      if (e.message && e.message.includes('Username')) {
        throw e;
      }
      console.error('Exception during member signup in Supabase:', e);
    }
  }

  if (!memberId) {
    memberId = `user-${Date.now()}`;
  }

  const newSession: UserSession = {
    id: memberId,
    username: cleanUsername,
    fullName,
    email,
    avatarUrl,
    bio: newBio,
    isLoggedIn: true,
    isAdmin: false
  };

  setLocalStorage('immortal_session', newSession);
  addMemberToMockList(newSession);

  return newSession;
};

export const getAdminPassword = (): string => {
  return getLocalStorage('immortal_admin_password', 'PastiSukses');
};

export const updateAdminPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  const existingPassword = getAdminPassword();
  if (currentPassword !== existingPassword) {
    throw new Error('Password saat ini salah!');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password baru minimal harus 6 karakter!');
  }
  setLocalStorage('immortal_admin_password', newPassword);

  // If Supabase is configured, attempt auth sync
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.updateUser({ password: newPassword });
    } catch (e) {
      console.warn('Supabase auth password update skipped:', e);
    }
  }

  return true;
};

export const updateAdminProfile = async (data: {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
}): Promise<UserSession> => {
  const current = getCurrentUserSession();

  const updatedFullName = data.fullName !== undefined ? data.fullName : current.fullName;
  const updatedAvatarUrl = data.avatarUrl !== undefined ? data.avatarUrl : current.avatarUrl;
  const updatedBio = data.bio !== undefined ? data.bio : current.bio;

  setLocalStorage('immortal_admin_name', updatedFullName);
  setLocalStorage('immortal_admin_avatar', updatedAvatarUrl);
  setLocalStorage('immortal_admin_bio', updatedBio);

  const updatedSession: UserSession = {
    ...current,
    fullName: updatedFullName,
    avatarUrl: updatedAvatarUrl,
    bio: updatedBio,
    isAdmin: true
  };

  setLocalStorage('immortal_session', updatedSession);

  // Sync in members list
  const members = getLocalStorage('immortal_members', mockMembersSeed);
  const syncedMembers = members.map((m: UserSession) => 
    (m.id === MASTER_ADMIN_ID || m.email === 'admin@immortaldivision.com')
      ? { ...m, fullName: updatedFullName, avatarUrl: updatedAvatarUrl, bio: updatedBio }
      : m
  );
  setLocalStorage('immortal_members', syncedMembers);

  // Sync to Supabase profiles table
  if (isSupabaseConfigured && supabase) {
    try {
      const updateData: any = {};
      if (data.fullName !== undefined) updateData.full_name = data.fullName;
      if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
      if (data.bio !== undefined) updateData.bio = data.bio;
      
      const { error } = await supabase.from('profiles').update(updateData).eq('id', MASTER_ADMIN_ID);
      if (error) {
        console.error('Error updating admin profile in Supabase:', error);
      }
    } catch (err) {
      console.error('Exception updating admin profile in Supabase:', err);
    }
  }

  return updatedSession;
};

export const loginMock = (email: string, password?: string): UserSession => {
  // Check master admin credentials
  if (email === 'admin@immortaldivision.com') {
    const validPassword = getAdminPassword();
    if (password !== validPassword) {
      throw new Error('Password Master Admin salah!');
    }
    const adminSession: UserSession = {
      id: MASTER_ADMIN_ID,
      username: 'master_admin',
      fullName: getLocalStorage('immortal_admin_name', 'Master Admin'),
      email: 'admin@immortaldivision.com',
      avatarUrl: getLocalStorage('immortal_admin_avatar', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'),
      bio: getLocalStorage('immortal_admin_bio', 'Immortal Division Chief System Administrator.'),
      isLoggedIn: true,
      isAdmin: true
    };
    setLocalStorage('immortal_session', adminSession);
    addMemberToMockList(adminSession);
    return adminSession;
  }

  // Check if member already exists in local list
  const members = getLocalStorage('immortal_members', mockMembersSeed);
  const found = members.find((m: UserSession) => m.email === email);
  
  let newSession: UserSession;
  if (found) {
    newSession = {
      ...found,
      isLoggedIn: true
    };
  } else {
    // Fallback automatic signin
    newSession = {
      id: `user-${Date.now()}`,
      username: 'immortal_listener',
      fullName: 'Joko Prabowo',
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Dedicated crate digger and live gig reviewer.',
      isLoggedIn: true,
      isAdmin: false
    };
    addMemberToMockList(newSession);
  }

  setLocalStorage('immortal_session', newSession);
  return newSession;
};

export const updateProfileMock = (data: Partial<Omit<UserSession, 'id' | 'isLoggedIn'>>): UserSession => {
  const current = getCurrentUserSession();
  const updated = { ...current, ...data };
  setLocalStorage('immortal_session', updated);
  
  // Sync to members list
  const members = getLocalStorage('immortal_members', mockMembersSeed);
  const syncedMembers = members.map((m: UserSession) => m.id === current.id ? { ...m, ...data } : m);
  setLocalStorage('immortal_members', syncedMembers);

  return updated;
};

export const logoutMock = (): void => {
  setLocalStorage('immortal_session', defaultSession);
};

// --- ADMIN SPECIFIC MUTATIONS ---

// 1. Members Management
export const getMembersList = async (): Promise<UserSession[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return data.map(u => ({
        id: u.id,
        username: u.username,
        fullName: u.full_name,
        email: u.email || 'member@immortaldivision.com',
        avatarUrl: u.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: u.bio || '',
        isLoggedIn: false,
        isAdmin: u.is_admin || false
      }));
    }
  }
  return getLocalStorage('immortal_members', mockMembersSeed);
};

export const addMemberToMockList = (user: UserSession) => {
  const members = getLocalStorage('immortal_members', mockMembersSeed);
  const exists = members.find((m: UserSession) => m.email === user.email || m.id === user.id);
  if (!exists) {
    const listUser = { ...user, isLoggedIn: false }; // Don't persist logged-in state inside list
    setLocalStorage('immortal_members', [...members, listUser]);
  }
};

export const createAdminAccount = async (data: Omit<UserSession, 'id' | 'isLoggedIn' | 'isAdmin'>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('profiles').insert([{
        username: data.username,
        full_name: data.fullName,
        email: data.email,
        avatar_url: data.avatarUrl,
        bio: data.bio,
        is_admin: true
      }]);
      if (!error) return true;
      console.error('Error creating admin in Supabase profiles:', error);
    } catch (e) {
      console.error('Exception creating admin account:', e);
    }
  }
  const members = getLocalStorage('immortal_members', mockMembersSeed);
  const exists = members.find((m: UserSession) => m.email === data.email);
  if (exists) return false;

  const newAdmin: UserSession = {
    ...data,
    id: `admin-${Date.now()}`,
    isLoggedIn: false,
    isAdmin: true
  };
  setLocalStorage('immortal_members', [...members, newAdmin]);
  return true;
};

export const deleteMember = async (id: string): Promise<boolean> => {
  // Never delete master admin
  if (id === MASTER_ADMIN_ID || id === 'admin-master') {
    return false;
  }

  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      console.error('Error deleting profile from Supabase:', error);
    }
  }
  const members = getLocalStorage('immortal_members', mockMembersSeed);
  const filtered = members.filter((m: UserSession) => m.id !== id);
  setLocalStorage('immortal_members', filtered);
  
  // If active user is deleted, force logout
  const active = getCurrentUserSession();
  if (active.id === id) {
    logoutMock();
  }
  return true;
};

export const toggleAdminPrivilege = async (id: string): Promise<boolean> => {
  if (id === MASTER_ADMIN_ID || id === 'admin-master') {
    return false;
  }

  const members = await getMembersList();
  const m = members.find((u: any) => u.id === id);
  const newAdminStatus = m ? !m.isAdmin : true;

  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('profiles').update({ is_admin: newAdminStatus }).eq('id', id);
    if (error) {
      console.error('Error toggling admin status in Supabase:', error);
    }
  }

  const localMembers = getLocalStorage('immortal_members', mockMembersSeed);
  const updated = localMembers.map((mem: UserSession) => mem.id === id ? { ...mem, isAdmin: newAdminStatus } : mem);
  setLocalStorage('immortal_members', updated);

  const active = getCurrentUserSession();
  if (active.id === id) {
    const activeUpdated = { ...active, isAdmin: newAdminStatus };
    setLocalStorage('immortal_session', activeUpdated);
  }
  return true;
};

// 2. Program CRUD
export const addProgram = async (data: Omit<Program, 'id'>): Promise<Program> => {
  if (isSupabaseConfigured && supabase) {
    const insertData = {
      title: data.title,
      description: data.description,
      cover_image: data.cover_image,
      tags: data.tags,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-')
    };
    const { data: newProg, error } = await supabase.from('programs').insert([insertData]).select().single();
    if (!error && newProg) return newProg;
    console.error('Error adding program to Supabase:', error);
  }
  const list = getLocalStorage('immortal_programs', mockPrograms);
  const newProg: Program = {
    ...data,
    id: `prog-${Date.now()}`,
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-')
  };
  setLocalStorage('immortal_programs', [...list, newProg]);
  return newProg;
};

export const deleteProgram = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting program from Supabase:', error);
  }
  const list = getLocalStorage('immortal_programs', mockPrograms);
  const filtered = list.filter((p: Program) => p.id !== id);
  setLocalStorage('immortal_programs', filtered);

  // Cascade delete episodes
  const eps = getLocalStorage('immortal_episodes', mockEpisodes);
  const filteredEps = eps.filter((e: Episode) => e.program_id !== id);
  setLocalStorage('immortal_episodes', filteredEps);
  
  return true;
};

// 3. Episode CRUD
export const addEpisode = async (data: Omit<Episode, 'id' | 'published_at'>): Promise<Episode> => {
  if (isSupabaseConfigured && supabase) {
    const insertData = {
      program_id: data.program_id,
      title: data.title,
      description: data.description,
      youtube_id: data.youtube_id,
      season: data.season,
      episode_number: data.episode_number,
      duration: data.duration,
      is_exclusive: data.is_exclusive,
      published_at: new Date().toISOString()
    };
    const { data: newEp, error } = await supabase.from('episodes').insert([insertData]).select().single();
    if (!error && newEp) return newEp;
    console.error('Error adding episode to Supabase:', error);
  }
  const list = getLocalStorage('immortal_episodes', mockEpisodes);
  const newEp: Episode = {
    ...data,
    id: `ep-${Date.now()}`,
    published_at: new Date().toISOString()
  };
  setLocalStorage('immortal_episodes', [...list, newEp]);
  return newEp;
};

export const deleteEpisode = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('episodes').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting episode from Supabase:', error);
  }
  const list = getLocalStorage('immortal_episodes', mockEpisodes);
  const filtered = list.filter((e: Episode) => e.id !== id);
  setLocalStorage('immortal_episodes', filtered);
  return true;
};

// 4. Music CRUD
export const addMusicTrack = async (data: Omit<MusicTrack, 'id'>): Promise<MusicTrack> => {
  if (isSupabaseConfigured && supabase) {
    const { data: newTrack, error } = await supabase.from('music_tracks').insert([data]).select().single();
    if (!error && newTrack) return newTrack;
    console.error('Error adding music track to Supabase:', error);
  }
  const list = getLocalStorage('immortal_music', mockMusicTracks);
  const newTrack: MusicTrack = {
    ...data,
    id: `track-${Date.now()}`
  };
  setLocalStorage('immortal_music', [...list, newTrack]);
  return newTrack;
};

export const deleteMusicTrack = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('music_tracks').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting music track from Supabase:', error);
  }
  const list = getLocalStorage('immortal_music', mockMusicTracks);
  const filtered = list.filter((t: MusicTrack) => t.id !== id);
  setLocalStorage('immortal_music', filtered);
  return true;
};

// 5. Artwork CRUD
export const addArtWork = async (data: Omit<ArtWork, 'id'>): Promise<ArtWork> => {
  if (isSupabaseConfigured && supabase) {
    const { data: newArt, error } = await supabase.from('art_works').insert([data]).select().single();
    if (!error && newArt) return newArt;
    console.error('Error adding artwork to Supabase:', error);
  }
  const list = getLocalStorage('immortal_artworks', mockArtWorks);
  const newArt: ArtWork = {
    ...data,
    id: `art-${Date.now()}`
  };
  setLocalStorage('immortal_artworks', [...list, newArt]);
  return newArt;
};

export const deleteArtWork = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('art_works').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting artwork from Supabase:', error);
  }
  const list = getLocalStorage('immortal_artworks', mockArtWorks);
  const filtered = list.filter((a: ArtWork) => a.id !== id);
  setLocalStorage('immortal_artworks', filtered);
  return true;
};

// 6. Blog CRUD
export const addBlogPost = async (data: Omit<BlogPost, 'id' | 'published_at' | 'author'> & { authorName: string }): Promise<BlogPost> => {
  if (isSupabaseConfigured && supabase) {
    const active = getCurrentUserSession();
    const authorId = active && active.isLoggedIn && isValidUUID(active.id) ? active.id : MASTER_ADMIN_ID;
    
    const insertData = {
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: data.excerpt,
      content: data.content,
      cover_image: data.cover_image,
      category: data.category,
      author_id: authorId,
      published_at: new Date().toISOString()
    };
    const { data: newPost, error } = await supabase.from('blog_posts').insert([insertData]).select().single();
    if (!error && newPost) {
      return {
        ...newPost,
        author: {
          full_name: data.authorName || active.fullName || 'Immortal Admin',
          avatar_url: active.avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
        }
      };
    }
    console.error('Error adding blog post to Supabase:', error);
  }
  const list = getLocalStorage('immortal_blog', mockBlogPosts);
  const newPost: BlogPost = {
    ...data,
    id: `post-${Date.now()}`,
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
    published_at: new Date().toISOString(),
    author: {
      full_name: data.authorName || 'Immortal Admin',
      avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
    }
  };
  setLocalStorage('immortal_blog', [...list, newPost]);
  return newPost;
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting blog post from Supabase:', error);
  }
  const list = getLocalStorage('immortal_blog', mockBlogPosts);
  const filtered = list.filter((p: BlogPost) => p.id !== id);
  setLocalStorage('immortal_blog', filtered);
  return true;
};

// 7. Event CRUD
export const addEvent = async (data: Omit<EventItem, 'id'>): Promise<EventItem> => {
  if (isSupabaseConfigured && supabase) {
    const { data: newEvent, error } = await supabase.from('events').insert([data]).select().single();
    if (!error && newEvent) return newEvent;
    console.error('Error adding event to Supabase:', error);
  }
  const list = getLocalStorage('immortal_events', mockEvents);
  const newEvent: EventItem = {
    ...data,
    id: `event-${Date.now()}`
  };
  setLocalStorage('immortal_events', [...list, newEvent]);
  return newEvent;
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) return true;
    console.error('Error deleting event from Supabase:', error);
  }
  const list = getLocalStorage('immortal_events', mockEvents);
  const filtered = list.filter((e: EventItem) => e.id !== id);
  setLocalStorage('immortal_events', filtered);
  return true;
};

// --- UPDATE OPERATIONS (EDIT CRUD) ---

export const updateProgram = async (id: string, data: Partial<Omit<Program, 'id'>>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('programs').update(data).eq('id', id);
    if (!error) return true;
    console.error('Error updating program in Supabase:', error);
  }
  const list = getLocalStorage('immortal_programs', mockPrograms);
  const updated = list.map((p: Program) => p.id === id ? { ...p, ...data } : p);
  setLocalStorage('immortal_programs', updated);
  return true;
};

export const updateEpisode = async (id: string, data: Partial<Omit<Episode, 'id' | 'published_at'>>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('episodes').update(data).eq('id', id);
    if (!error) return true;
    console.error('Error updating episode in Supabase:', error);
  }
  const list = getLocalStorage('immortal_episodes', mockEpisodes);
  const updated = list.map((e: Episode) => e.id === id ? { ...e, ...data } : e);
  setLocalStorage('immortal_episodes', updated);
  return true;
};

export const updateMusicTrack = async (id: string, data: Partial<Omit<MusicTrack, 'id'>>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('music_tracks').update(data).eq('id', id);
    if (!error) return true;
    console.error('Error updating music track in Supabase:', error);
  }
  const list = getLocalStorage('immortal_music', mockMusicTracks);
  const updated = list.map((t: MusicTrack) => t.id === id ? { ...t, ...data } : t);
  setLocalStorage('immortal_music', updated);
  return true;
};

export const updateArtWork = async (id: string, data: Partial<Omit<ArtWork, 'id'>>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('art_works').update(data).eq('id', id);
    if (!error) return true;
    console.error('Error updating artwork in Supabase:', error);
  }
  const list = getLocalStorage('immortal_artworks', mockArtWorks);
  const updated = list.map((a: ArtWork) => a.id === id ? { ...a, ...data } : a);
  setLocalStorage('immortal_artworks', updated);
  return true;
};

export const updateBlogPost = async (id: string, data: Partial<Omit<BlogPost, 'id' | 'published_at' | 'author'>> & { authorName?: string }): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const active = getCurrentUserSession();
    const updateData: any = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      cover_image: data.cover_image,
      category: data.category
    };
    // Clean undefined fields to avoid overwriting with null
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    if (isValidUUID(id)) {
      const { error } = await supabase.from('blog_posts').update(updateData).eq('id', id);
      if (!error) return true;
      console.error('Error updating blog post in Supabase:', error);
    }
  }
  const list = getLocalStorage('immortal_blog', mockBlogPosts);
  const updated = list.map((p: BlogPost) => {
    if (p.id === id) {
      const authorInfo = data.authorName ? { ...p.author, full_name: data.authorName } : p.author;
      return { ...p, ...data, author: authorInfo };
    }
    return p;
  });
  setLocalStorage('immortal_blog', updated);
  return true;
};

export const updateEvent = async (id: string, data: Partial<Omit<EventItem, 'id'>>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('events').update(data).eq('id', id);
    if (!error) return true;
    console.error('Error updating event in Supabase:', error);
  }
  const list = getLocalStorage('immortal_events', mockEvents);
  const updated = list.map((e: EventItem) => e.id === id ? { ...e, ...data } : e);
  setLocalStorage('immortal_events', updated);
  return true;
};

export const updateProduct = async (id: string, data: Partial<Omit<Product, 'id'>>): Promise<boolean> => {
  if (isSupabaseConfigured && supabase && isValidUUID(id)) {
    const { error } = await supabase.from('products').update(data).eq('id', id);
    if (!error) return true;
    console.error('Error updating product in Supabase:', error);
  }
  const list = getLocalStorage('immortal_products', mockProducts);
  const updated = list.map((p: Product) => p.id === id ? { ...p, ...data } : p);
  setLocalStorage('immortal_products', updated);
  return true;
};
