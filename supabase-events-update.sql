-- Immortal Division: Supabase Schema Update for Events & Event Discussions
-- Jalankan script SQL ini di Dashboard Supabase Anda (SQL Editor -> New Query -> Run)

-- ==========================================================
-- 1. EVENTS TABLE (Link Google Maps & Media Galeri Video/Foto)
-- ==========================================================
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS maps_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS gallery_media JSONB DEFAULT '[]'::jsonb;

-- ==========================================================
-- 2. COMMENTS TABLE (Mendukung Komentar Diskusi Pada Event)
-- ==========================================================
-- Tambahkan relasi event_id ke tabel comments
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;

-- Lepaskan constraint lama (check_target) yang sebelumnya membatasi komentar hanya untuk episode atau blog post
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS check_target;

-- ==========================================================
-- 3. PERMISSIONS & POLICIES
-- ==========================================================
-- Pastikan tidak ada limitasi policy untuk operasi CRUD Event & Komentar
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
