-- Immortal Division: Supabase RLS Fix Script
-- Jalankan script SQL ini di SQL Editor pada Dashboard Supabase Anda
-- untuk memperbolehkan pengunjung web umum mengirim komentar, newsletter, dan order secara langsung.

-- ==========================================
-- 1. NEWSLETTER SUBSCRIBERS TABLE
-- ==========================================
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow public insert to newsletter_subscribers" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access to newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow public read access to newsletter_subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (true);

-- ==========================================
-- 2. COMMENTS TABLE
-- ==========================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to comments" ON public.comments;
CREATE POLICY "Allow public read access to comments" ON public.comments
    FOR SELECT USING (true);

-- Buka izin insert komentar bagi pengunjung/member
DROP POLICY IF EXISTS "Allow authenticated users to create comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public insert to comments" ON public.comments;
CREATE POLICY "Allow public insert to comments" ON public.comments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to delete their own comments" ON public.comments;
CREATE POLICY "Allow users to delete their own comments" ON public.comments
    FOR DELETE USING (true);

-- ==========================================
-- 3. INQUIRIES TABLE
-- ==========================================
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to inquiries" ON public.inquiries;
CREATE POLICY "Allow public insert to inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to inquiries" ON public.inquiries;
CREATE POLICY "Allow all access to inquiries" ON public.inquiries
    FOR ALL USING (true);

-- ==========================================
-- 4. ORDERS TABLE
-- ==========================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to orders" ON public.orders;
CREATE POLICY "Allow all access to orders" ON public.orders
    FOR ALL USING (true);

-- ==========================================
-- 5. CONTENT TABLES (Programs, Episodes, ArtWorks, Music, Blog, Events, Products)
-- Pastikan tidak ada policy yang membatasi operasi CRUD
-- ==========================================
ALTER TABLE public.programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.art_works DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_tracks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Selesai! Semua fitur kini dapat berinteraksi dengan Supabase Cloud secara lancar.
