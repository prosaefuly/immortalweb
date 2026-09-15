-- Immortal Division Database Schema SQL (Supabase PostgreSQL)

-- 1. Profiles Table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Programs Table (YouTube playlist/shows categories)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image TEXT,
    tags VARCHAR(50)[] DEFAULT '{}',
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Episodes Table (YouTube videos within a program)
CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_id VARCHAR(50) NOT NULL, -- YouTube video ID (e.g. dQw4w9WgXcQ)
    season INT DEFAULT 1,
    episode_number INT,
    duration VARCHAR(20), -- e.g. "12:34"
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_exclusive BOOLEAN DEFAULT FALSE, -- Member exclusive video flag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Art Works Table (digital art & merch gallery)
CREATE TABLE IF NOT EXISTS public.art_works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) DEFAULT 'Immortal Division Team',
    description TEXT,
    image_url TEXT NOT NULL,
    merch_link TEXT, -- Optional redirect if it is a merch item
    category VARCHAR(100) DEFAULT 'Digital Art',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Music Tracks Table (audio releases & Spotify embeds)
CREATE TABLE IF NOT EXISTS public.music_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    cover_image TEXT,
    audio_url TEXT, -- Path to MP3 file for local audio player
    spotify_embed TEXT, -- Spotify track embed code/iframe link
    apple_music_link TEXT, -- Link to Apple Music page
    lyrics TEXT, -- Track lyrics
    duration VARCHAR(20) DEFAULT '03:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Blog / News Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Rich-text / MDX markdown format
    cover_image TEXT,
    category VARCHAR(100) DEFAULT 'Music News',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. Events Table (Offline/Online events)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL, -- e.g. "Senayan Hall, Jakarta" or "Zoom Stream"
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    cover_image TEXT,
    ticket_link TEXT, -- Redirect to ticketing partner (Loket.com, etc)
    price_info VARCHAR(100) DEFAULT 'Free',
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. Partnership Inquiries (B2B contacts)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Reviewed, Replied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 9. Comments Table (Discussions on episodes or blog posts)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT check_target CHECK (
        (episode_id IS NOT NULL AND post_id IS NULL) OR 
        (episode_id IS NULL AND post_id IS NOT NULL)
    )
);

-- Enable RLS for Comments (Public read and insert allowed)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to comments" ON public.comments
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to comments" ON public.comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to delete their own comments" ON public.comments
    FOR DELETE USING (true);

-- 10. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to newsletter_subscribers" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to newsletter_subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (true);

-- Indexes for performance queries
CREATE INDEX IF NOT EXISTS idx_episodes_program ON public.episodes(program_id);
CREATE INDEX IF NOT EXISTS idx_comments_episode ON public.comments(episode_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON public.programs(slug);

-- 11. Products Table (Merchandise Store)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    image_url TEXT NOT NULL,
    stock INT DEFAULT 0,
    sizes VARCHAR(10)[] DEFAULT '{}', -- e.g. {'S', 'M', 'L', 'XL'}
    category VARCHAR(100) DEFAULT 'Baju', -- Baju, Jaket, Topi, Celana, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 12. Orders Table (Store Transactions)
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(100) PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(50) NOT NULL,
    buyer_address TEXT NOT NULL,
    quantity INT DEFAULT 1,
    size VARCHAR(10),
    total_price INT NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for Store
CREATE INDEX IF NOT EXISTS idx_orders_product ON public.orders(product_id);

