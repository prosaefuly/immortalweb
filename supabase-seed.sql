-- Immortal Division Database Seed SQL (Supabase PostgreSQL)

-- 1. Create Auth Users (auth.users schema)
-- Using extensions.crypt with bcrypt hash to register users with password 'PastiSukses' for admin, and 'password123' for members.

-- 1a. Master Admin (admin@immortaldivision.com / password: PastiSukses)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '88888888-8888-4888-a888-888888888888',
    'authenticated',
    'authenticated',
    'admin@immortaldivision.com',
    crypt('PastiSukses', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Master Admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 1b. Member 1: Maya (maya@gmail.com / password: password123)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-a222-111111111111',
    'authenticated',
    'authenticated',
    'maya@gmail.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Maya Wijaya"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 1c. Member 2: Reza (reza@gmail.com / password: password123)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-a222-222222222222',
    'authenticated',
    'authenticated',
    'reza@gmail.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Reza Ahmad"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;


-- 2. Populate Public Profiles Table (public.profiles)
-- Matches auth.users UUIDs

-- 2a. Master Admin Profile
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, is_admin, created_at, updated_at)
VALUES (
    '88888888-8888-4888-a888-888888888888',
    'master_admin',
    'Master Admin',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'Immortal Division Chief System Administrator.',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2b. Member 1 Profile
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, is_admin, created_at, updated_at)
VALUES (
    '22222222-2222-4222-a222-111111111111',
    'vinyl_junkie',
    'Maya Wijaya',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Dedicated crate digger and live gig reviewer.',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2c. Member 2 Profile
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, is_admin, created_at, updated_at)
VALUES (
    '22222222-2222-4222-a222-222222222222',
    'synth_builder',
    'Reza Ahmad',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Analog modular synthesizer enthusiast and gear head.',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- 3. Seed Programs Table (public.programs)
INSERT INTO public.programs (id, title, description, cover_image, tags, slug, created_at)
VALUES (
    '11111111-1111-4111-a111-111111111111',
    'Immortal Studio Sessions',
    'Exclusive live performances and intimate studio raw takes from outstanding independent music artists.',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    ARRAY['Live Music', 'Acoustic', 'Raw'],
    'studio-sessions',
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.programs (id, title, description, cover_image, tags, slug, created_at)
VALUES (
    '11111111-1111-4111-a111-222222222222',
    'The Underground Beat',
    'Weekly deep dive podcast talking about independent artists, sub-culture events, and electronic music gear.',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    ARRAY['Talkshow', 'Gear', 'Sub-Culture'],
    'underground-beat',
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.programs (id, title, description, cover_image, tags, slug, created_at)
VALUES (
    '11111111-1111-4111-a111-333333333333',
    'Immortal Records Showcase',
    'Documenting the songwriting and production processes behind the latest Immortal Division label releases.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    ARRAY['Behind the Scenes', 'Songwriting', 'Label'],
    'records-showcase',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- 4. Seed Episodes Table (public.episodes)
INSERT INTO public.episodes (id, program_id, title, description, youtube_id, season, episode_number, duration, published_at, is_exclusive)
VALUES (
    '33333333-3333-4333-b333-111111111111',
    '11111111-1111-4111-a111-111111111111',
    'Lofi Indie Folk Set: Waves of Autumn (Live)',
    'An acoustic performance of Waves of Autumn. Recorded live in Immortal Studio Room A with multi-angle capture.',
    'coPZJz6b9jM',
    1,
    1,
    '11:45',
    NOW() - INTERVAL '15 days',
    FALSE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.episodes (id, program_id, title, description, youtube_id, season, episode_number, duration, published_at, is_exclusive)
VALUES (
    '33333333-3333-4333-b333-222222222222',
    '11111111-1111-4111-a111-111111111111',
    'Neon Synthpop Jam - Nightcrawler (Live)',
    'High energy performance using vintage analog synths and dynamic live drumming.',
    'Hq0NkrM4bF8',
    1,
    2,
    '08:20',
    NOW() - INTERVAL '8 days',
    FALSE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.episodes (id, program_id, title, description, youtube_id, season, episode_number, duration, published_at, is_exclusive)
VALUES (
    '33333333-3333-4333-b333-333333333333',
    '11111111-1111-4111-a111-111111111111',
    '[Member Exclusive] Extended Electronic Live Set & Sound Check',
    'Exclusive 30 minutes extended jam and technical talk about our Eurorack setup.',
    'n_C90GZf90Q',
    1,
    3,
    '32:15',
    NOW() - INTERVAL '1 day',
    TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.episodes (id, program_id, title, description, youtube_id, season, episode_number, duration, published_at, is_exclusive)
VALUES (
    '33333333-3333-4333-b333-444444444444',
    '11111111-1111-4111-a111-222222222222',
    'Why Modular Synthesizers are Taking Over Indie Music',
    'Host Dan discusses the revival of Eurorack modular synthesizers and how local artists integrate them into songwriting.',
    'F3vY2vO3T1Q',
    1,
    1,
    '45:10',
    NOW() - INTERVAL '20 days',
    FALSE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.episodes (id, program_id, title, description, youtube_id, season, episode_number, duration, published_at, is_exclusive)
VALUES (
    '33333333-3333-4333-b333-555555555555',
    '11111111-1111-4111-a111-222222222222',
    'Interview with Kurosuke: Balancing Pop and Underground Nostalgia',
    'We sat down with Indonesian indie-pop artist Kurosuke to talk about vintage recording equipment and mixing techniques.',
    'n4X4o4D4o4Q',
    1,
    2,
    '52:40',
    NOW() - INTERVAL '12 days',
    FALSE
) ON CONFLICT (id) DO NOTHING;


-- 5. Seed Art Works Table (public.art_works)
INSERT INTO public.art_works (id, title, artist_name, description, image_url, merch_link, category)
VALUES (
    '44444444-4444-4444-c444-111111111111',
    'Immortal Records Showcase Poster',
    'VibrantRed Design',
    'Limited edition high-density print poster designed for the launch event of Immortal Records.',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
    'https://tokopedia.com',
    'Poster Art'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.art_works (id, title, artist_name, description, image_url, merch_link, category)
VALUES (
    '44444444-4444-4444-c444-222222222222',
    'Analog Synthesis Blueprint',
    'Studio MUTE',
    'Detailed vector blueprint illustration of vintage polyphonic synthesizers.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    'https://shopee.co.id',
    'Digital Art'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.art_works (id, title, artist_name, description, image_url, category)
VALUES (
    '44444444-4444-4444-c444-333333333333',
    'Electric Glow Cover Art',
    'Reza Art',
    'Album cover design project blending neo-noir aesthetics with street photography.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'Digital Art'
) ON CONFLICT (id) DO NOTHING;


-- 6. Seed Music Tracks Table (public.music_tracks)
INSERT INTO public.music_tracks (id, title, artist, album, cover_image, audio_url, spotify_embed, apple_music_link, lyrics, duration)
VALUES (
    '55555555-5555-4555-d555-111111111111',
    'Midnight Echoes',
    'Luna Eclipse',
    'Neon Memories',
    'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=400&auto=format&fit=crop&q=80',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4PTG3Z6ehGkBFmzskQlI6W" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
    'https://music.apple.com',
    '[Verse 1]\nNeon lights reflecting in the rain\nShadows dancing, whispers of the pain\nWe walk along the quiet boulevard\nCounting stars, although the sky is dark\n\n[Chorus]\nMidnight echoes, calling out your name\nIn the silence, nothing feels the same\nMidnight echoes, running through the streets\nTo the rhythm of our pounding beats\n\n[Verse 2]\nFading traces of the words you said\nPlaying like a record in my head\nAnalog warmth inside the frozen air\nI look around, but you are never there',
    '06:12'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.music_tracks (id, title, artist, album, cover_image, audio_url, spotify_embed, apple_music_link, lyrics, duration)
VALUES (
    '55555555-5555-4555-d555-222222222222',
    'Hyperdrive',
    'Retro Runner',
    'Outrun the Grid',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/303D8cO6476qfL8s3K8tYQ" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
    'https://music.apple.com',
    '[Instrumental Synth Solo]\n\n[Verse 1]\nVelocity increasing, watch it break\nEvery single choice we had to make\nFaster than the light, we cross the line\nEscaping from the boundaries of time\n\n[Chorus]\nHyperdrive, ignition sparks the flame\nWe will never play their quiet game\nHyperdrive, we accelerate the sound\nLeaving all our shadows on the ground',
    '07:05'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.music_tracks (id, title, artist, album, cover_image, audio_url, spotify_embed, apple_music_link, lyrics, duration)
VALUES (
    '55555555-5555-4555-d555-333333333333',
    'Acoustic Rain',
    'Sarah & The Synths',
    'Immortal Studio Live',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/1PZj4rM3tC5P9vXy6sWv9v" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
    'https://music.apple.com',
    '[Verse 1]\nDrops of water on the wooden floor\nYou don''t have to hide here anymore\nAcoustic strings blending with the storm\nKeep the fire burning, keep it warm\n\n[Chorus]\nLet the rain fall down on us tonight\nEverything is going to be alright\nAcoustic rain, washing out the noise\nListen to the beauty of your voice',
    '05:44'
) ON CONFLICT (id) DO NOTHING;


-- 7. Seed Blog Posts Table (public.blog_posts)
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, cover_image, category, author_id, is_published, published_at)
VALUES (
    '66666666-6666-4666-e666-111111111111',
    '10 Indonesian Indie Music Acts You Need to Hear in 2026',
    '10-indonesian-indie-acts-2026',
    'From dream-pop to garage rock, the archipelago is buzzing with incredible underground talent.',
    'The Indonesian independent music scene has undergone a massive renaissance over the last few years. Driven by digital autonomy and a tight-knit gig-going community, musicians from Jakarta, Bandung, Yogyakarta, and Bali are releasing some of the most innovative and soulful music in Southeast Asia.

### 1. The Pastel Waves (Bandung)
Blending hazy shoegaze with lush orchestral synth layers, this Bandung-based quintet sounds like a dream you don''t want to wake up from.

### 2. Kurosuke (Jakarta)
A staple in the modern city-pop revival, Kurosuke mixes infectious baseline rhythms with warm retro synthesizers.',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
    'Editor Picks',
    '88888888-8888-4888-a888-888888888888',
    TRUE,
    NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;


-- 8. Seed Events Table (public.events)
INSERT INTO public.events (id, title, description, location, start_date, end_date, cover_image, ticket_link, price_info, is_online)
VALUES (
    '77777777-7777-4777-f777-111111111111',
    'Immortal Showcase: Vol. 1 (Jakarta)',
    'An intimate evening featuring live performances by Luna Eclipse and Retro Runner, followed by an open analog synthesizer jam session.',
    'Studio Room A, Immortal Division HQ, Jakarta',
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '10 days' + INTERVAL '4 hours',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    'https://loket.com',
    'Rp 150.000',
    FALSE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.events (id, title, description, location, start_date, end_date, cover_image, ticket_link, price_info, is_online)
VALUES (
    '77777777-7777-4777-f777-222222222222',
    'Workshop: Sound Synthesis for Beginners',
    'A hands-on masterclass led by Dan Pratama on building patches, understanding envelope filters, and recording synth tracks.',
    'Zoom Interactive Broadcast',
    NOW() + INTERVAL '20 days',
    NOW() + INTERVAL '20 days' + INTERVAL '2 hours',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=800&auto=format&fit=crop&q=80',
    '#register',
    'Free (Member RSVP)',
    TRUE
) ON CONFLICT (id) DO NOTHING;


-- 9. Seed Store Products Table (public.products)
INSERT INTO public.products (id, name, description, price, image_url, stock, sizes, category, created_at)
VALUES (
    '99999999-9999-4999-9999-111111111111',
    'Immortal Records Oversized Tee',
    'Kaos oversized katun berat 24s premium berwarna hitam pekat dengan bordir logo merah Immortal di dada depan dan sablon grafis analog waves di punggung.',
    185000,
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    50,
    ARRAY['S', 'M', 'L', 'XL'],
    'Baju',
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, description, price, image_url, stock, sizes, category, created_at)
VALUES (
    '99999999-9999-4999-9999-222222222222',
    'Vintage Synth Club Windbreaker',
    'Jaket windbreaker tahan air dengan kerah tegak tinggi, kantong ritsleting ganda, dan lining jaring bersirkulasi udara.',
    320000,
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    25,
    ARRAY['M', 'L', 'XL'],
    'Jaket',
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, description, price, image_url, stock, sizes, category, created_at)
VALUES (
    '99999999-9999-4999-9999-333333333333',
    'Immortal Dad Cap (Crimson Accent)',
    'Topi katun twill washed dengan pengait logam kuningan di belakang. Logo grafis gelombang suara crimson disulam rapi di sisi depan.',
    120000,
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    40,
    ARRAY['All Size'],
    'Topi',
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, description, price, image_url, stock, sizes, category, created_at)
VALUES (
    '99999999-9999-4999-9999-444444444444',
    'Sub-culture Utility Cargo Pants',
    'Celana kargo katun ripstop dengan multi-pocket kompartemen utilitas dan sablon wave minimalis.',
    245000,
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80',
    30,
    ARRAY['28', '30', '32', '34'],
    'Celana',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- 10. Seed Orders Table (public.orders)
INSERT INTO public.orders (id, product_id, buyer_name, buyer_email, buyer_phone, buyer_address, quantity, size, total_price, payment_status, created_at)
VALUES (
    'IMM-ORD-882191',
    '99999999-9999-4999-9999-111111111111',
    'Joko Prabowo',
    'joko@gmail.com',
    '628123456789',
    'Jl. Senopati No. 45, Jakarta Selatan',
    1,
    'L',
    185000,
    'Paid',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;


-- 11. Seed Comments (public.comments)
INSERT INTO public.comments (id, user_id, episode_id, content, created_at)
VALUES (
    '88888888-0000-0000-0000-111111111111',
    '22222222-2222-4222-a222-111111111111',
    '33333333-3333-4333-b333-111111111111',
    'This acoustic live take sounds absolutely breathtaking! The vocals are so crisp and natural.',
    NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.comments (id, user_id, episode_id, content, created_at)
VALUES (
    '88888888-0000-0000-0000-222222222222',
    '22222222-2222-4222-a222-222222222222',
    '33333333-3333-4333-b333-444444444444',
    'Awesome explanation on the Eurorack modules. That Mutable Instruments Clouds demo was neat!',
    NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;
