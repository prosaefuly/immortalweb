'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  // Read APIs
  getPrograms, getEpisodes, getArtWorks, getMusicTracks, getBlogPosts, getEvents, getInquiries, getMembersList, getProducts, getOrders,
  // Mutation APIs
  addProgram, deleteProgram, updateProgram, addEpisode, deleteEpisode, updateEpisode, addMusicTrack, deleteMusicTrack, updateMusicTrack,
  addArtWork, deleteArtWork, updateArtWork, addBlogPost, deleteBlogPost, updateBlogPost, addEvent, deleteEvent, updateEvent,
  updateInquiryStatus, deleteInquiry, deleteMember, toggleAdminPrivilege, createAdminAccount,
  addProduct, deleteProduct, updateProduct, updateOrderStatus, deleteOrder,
  // Types
  Program, Episode, ArtWork, MusicTrack, BlogPost, EventItem, Inquiry, UserSession, Product, Order
} from '@/lib/db';
import { 
  LayoutDashboard, Tv, Music, Image as ImageIcon, Newspaper, Calendar, Mail, Users, 
  Plus, Trash2, Edit, Shield, Eye, ShieldAlert, LogOut, CheckCircle2, UserPlus, FileText,
  ShoppingBag, ShoppingCart, MessageSquare, Check, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'overview' | 'programs' | 'episodes' | 'music' | 'art' | 'blogs' | 'events' | 'inquiries' | 'members' | 'products' | 'orders';

export default function AdminPage() {
  const { user, login, logout } = useApp();
  
  // Auth Form Local State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editingArtId, setEditingArtId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingBlogPostId, setEditingBlogPostId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);


  // Database lists
  const [programs, setPrograms] = useState<Program[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [artWorks, setArtWorks] = useState<ArtWork[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [members, setMembers] = useState<UserSession[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  // Mutation Form States
  // 1. Program Form
  const [progTitle, setProgTitle] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progCover, setProgCover] = useState('');
  const [progTags, setProgTags] = useState('');
  
  // 2. Episode Form
  const [epProgId, setEpProgId] = useState('');
  const [epTitle, setEpTitle] = useState('');
  const [epDesc, setEpDesc] = useState('');
  const [epYoutubeId, setEpYoutubeId] = useState('');
  const [epSeason, setEpSeason] = useState(1);
  const [epNumber, setEpNumber] = useState(1);
  const [epDuration, setEpDuration] = useState('10:00');
  const [epExclusive, setEpExclusive] = useState(false);

  // 3. Track Form
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackAlbum, setTrackAlbum] = useState('');
  const [trackCover, setTrackCover] = useState('');
  const [trackAudioUrl, setTrackAudioUrl] = useState('');
  const [trackSpotify, setTrackSpotify] = useState('');
  const [trackApple, setTrackApple] = useState('');
  const [trackLyrics, setTrackLyrics] = useState('');
  const [trackDuration, setTrackDuration] = useState('03:30');

  // 4. Artwork Form
  const [artTitle, setArtTitle] = useState('');
  const [artArtist, setArtArtist] = useState('');
  const [artDesc, setArtDesc] = useState('');
  const [artImage, setArtImage] = useState('');
  const [artCategory, setArtCategory] = useState('Digital Art');
  const [artMerch, setArtMerch] = useState('');

  // 5. Blog Form
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCover, setBlogCover] = useState('');
  const [blogCategory, setBlogCategory] = useState('Music News');
  const [blogAuthor, setBlogAuthor] = useState('');

  // 6. Event Form
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtCover, setEvtCover] = useState('');
  const [evtTicket, setEvtTicket] = useState('');
  const [evtPrice, setEvtPrice] = useState('Free');
  const [evtOnline, setEvtOnline] = useState(false);

  // 7. Invite Admin Form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminBio, setNewAdminBio] = useState('');

  // 8. Product Form
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState<number>(10);
  const [prodCategory, setProdCategory] = useState('Baju');
  const [prodSizes, setProdSizes] = useState('S, M, L, XL');

  // Notification banners
  const [successMsg, setSuccessMsg] = useState('');

  // Load Data
  const refreshData = async () => {
    const progsData = await getPrograms();
    const epsData = await getEpisodes();
    const tracksData = await getMusicTracks();
    const artsData = await getArtWorks();
    const postsData = await getBlogPosts();
    const eventsData = await getEvents();
    const inquiriesData = await getInquiries();
    const membersData = await getMembersList();
    const prodsData = await getProducts();
    const ordsData = await getOrders();

    setPrograms(progsData);
    setEpisodes(epsData);
    setTracks(tracksData);
    setArtWorks(artsData);
    setPosts(postsData);
    setEvents(eventsData);
    setInquiries(inquiriesData);
    setMembers(membersData);
    setProductsList(prodsData);
    setOrdersList(ordsData);

    if (progsData.length > 0 && !epProgId) {
      setEpProgId(progsData[0].id);
    }
  };

  useEffect(() => {
    if (user.isLoggedIn && user.isAdmin) {
      refreshData();
    }
  }, [user]);

  // Auth Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      login(loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    }
  };

  // Trigger Notifications
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Format Price IDR
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // --- CRUD ACTIONS ---

  // 1. Program CRUD
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle || !progCover) return;
    
    const payload = {
      title: progTitle,
      description: progDesc,
      cover_image: progCover,
      tags: progTags.split(',').map(t => t.trim()).filter(Boolean),
      slug: progTitle.toLowerCase().replace(/\s+/g, '-')
    };

    if (editingProgramId) {
      await updateProgram(editingProgramId, payload);
      setEditingProgramId(null);
      triggerSuccess('Program Berhasil Diperbarui!');
    } else {
      await addProgram(payload);
      triggerSuccess('Program Baru Berhasil Ditambahkan!');
    }

    setProgTitle('');
    setProgDesc('');
    setProgCover('');
    setProgTags('');
    refreshData();
  };

  const handleStartEditProgram = (p: Program) => {
    setEditingProgramId(p.id);
    setProgTitle(p.title);
    setProgDesc(p.description || '');
    setProgCover(p.cover_image || '');
    setProgTags(p.tags ? p.tags.join(', ') : '');
  };

  const handleCancelEditProgram = () => {
    setEditingProgramId(null);
    setProgTitle('');
    setProgDesc('');
    setProgCover('');
    setProgTags('');
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Hapus program ini beserta semua episodenya?')) return;
    await deleteProgram(id);
    triggerSuccess('Program Berhasil Dihapus.');
    refreshData();
  };

  // 2. Episode CRUD
  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epProgId || !epTitle || !epYoutubeId) return;

    const payload = {
      program_id: epProgId,
      title: epTitle,
      description: epDesc,
      youtube_id: epYoutubeId,
      season: Number(epSeason),
      episode_number: Number(epNumber),
      duration: epDuration,
      is_exclusive: epExclusive
    };

    if (editingEpisodeId) {
      await updateEpisode(editingEpisodeId, payload);
      setEditingEpisodeId(null);
      triggerSuccess('Episode Berhasil Diperbarui!');
    } else {
      await addEpisode(payload);
      triggerSuccess('Episode Baru Berhasil Ditambahkan!');
    }

    setEpTitle('');
    setEpDesc('');
    setEpYoutubeId('');
    setEpSeason(1);
    setEpNumber(1);
    setEpDuration('10:00');
    setEpExclusive(false);
    refreshData();
  };

  const handleStartEditEpisode = (ep: Episode) => {
    setEditingEpisodeId(ep.id);
    setEpProgId(ep.program_id);
    setEpTitle(ep.title);
    setEpDesc(ep.description || '');
    setEpYoutubeId(ep.youtube_id);
    setEpSeason(ep.season);
    setEpNumber(ep.episode_number || 1);
    setEpDuration(ep.duration || '10:00');
    setEpExclusive(ep.is_exclusive || false);
  };

  const handleCancelEditEpisode = () => {
    setEditingEpisodeId(null);
    setEpProgId('');
    setEpTitle('');
    setEpDesc('');
    setEpYoutubeId('');
    setEpSeason(1);
    setEpNumber(1);
    setEpDuration('10:00');
    setEpExclusive(false);
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm('Hapus episode ini?')) return;
    await deleteEpisode(id);
    triggerSuccess('Episode Berhasil Dihapus.');
    refreshData();
  };

  // 3. Music CRUD
  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle || !trackArtist || !trackCover || !trackAudioUrl) return;

    const payload = {
      title: trackTitle,
      artist: trackArtist,
      album: trackAlbum,
      cover_image: trackCover,
      audio_url: trackAudioUrl,
      spotify_embed: trackSpotify || '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4PTG3Z6ehGkBFmzskQlI6W" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      apple_music_link: trackApple || 'https://music.apple.com',
      lyrics: trackLyrics,
      duration: trackDuration
    };

    if (editingTrackId) {
      await updateMusicTrack(editingTrackId, payload);
      setEditingTrackId(null);
      triggerSuccess('Track Musik Berhasil Diperbarui!');
    } else {
      await addMusicTrack(payload);
      triggerSuccess('Track Musik Berhasil Rilis!');
    }

    setTrackTitle('');
    setTrackArtist('');
    setTrackAlbum('');
    setTrackCover('');
    setTrackAudioUrl('');
    setTrackSpotify('');
    setTrackApple('');
    setTrackLyrics('');
    setTrackDuration('03:30');
    refreshData();
  };

  const handleStartEditTrack = (t: MusicTrack) => {
    setEditingTrackId(t.id);
    setTrackTitle(t.title);
    setTrackArtist(t.artist);
    setTrackAlbum(t.album || '');
    setTrackCover(t.cover_image || '');
    setTrackAudioUrl(t.audio_url || '');
    setTrackSpotify(t.spotify_embed || '');
    setTrackApple(t.apple_music_link || '');
    setTrackLyrics(t.lyrics || '');
    setTrackDuration(t.duration || '03:30');
  };

  const handleCancelEditTrack = () => {
    setEditingTrackId(null);
    setTrackTitle('');
    setTrackArtist('');
    setTrackAlbum('');
    setTrackCover('');
    setTrackAudioUrl('');
    setTrackSpotify('');
    setTrackApple('');
    setTrackLyrics('');
    setTrackDuration('03:30');
  };

  const handleDeleteTrack = async (id: string) => {
    if (!confirm('Hapus track musik ini?')) return;
    await deleteMusicTrack(id);
    triggerSuccess('Track Musik Dihapus.');
    refreshData();
  };

  // 4. Artwork CRUD
  const handleAddArt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artImage) return;

    const payload = {
      title: artTitle,
      artist_name: artArtist || 'Immortal Division Team',
      description: artDesc,
      image_url: artImage,
      category: artCategory,
      merch_link: artMerch
    };

    if (editingArtId) {
      await updateArtWork(editingArtId, payload);
      setEditingArtId(null);
      triggerSuccess('Karya/Merch Berhasil Diperbarui!');
    } else {
      await addArtWork(payload);
      triggerSuccess('Karya/Merch Berhasil Dipublikasikan!');
    }

    setArtTitle('');
    setArtArtist('');
    setArtDesc('');
    setArtImage('');
    setArtCategory('Digital Art');
    setArtMerch('');
    refreshData();
  };

  const handleStartEditArt = (a: ArtWork) => {
    setEditingArtId(a.id);
    setArtTitle(a.title);
    setArtArtist(a.artist_name || 'Immortal Division Team');
    setArtDesc(a.description || '');
    setArtImage(a.image_url);
    setArtCategory(a.category || 'Digital Art');
    setArtMerch(a.merch_link || '');
  };

  const handleCancelEditArt = () => {
    setEditingArtId(null);
    setArtTitle('');
    setArtArtist('');
    setArtDesc('');
    setArtImage('');
    setArtCategory('Digital Art');
    setArtMerch('');
  };

  const handleDeleteArt = async (id: string) => {
    if (!confirm('Hapus karya seni ini dari galeri?')) return;
    await deleteArtWork(id);
    triggerSuccess('Karya Seni Dihapus.');
    refreshData();
  };

  // 5. Blog CRUD
  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent || !blogCover) return;

    const payload = {
      title: blogTitle,
      excerpt: blogExcerpt,
      content: blogContent,
      cover_image: blogCover,
      category: blogCategory,
      slug: blogTitle.toLowerCase().replace(/\s+/g, '-'),
      authorName: blogAuthor || 'Immortal Admin'
    };

    if (editingBlogPostId) {
      await updateBlogPost(editingBlogPostId, payload);
      setEditingBlogPostId(null);
      triggerSuccess('Artikel Berhasil Diperbarui!');
    } else {
      await addBlogPost(payload);
      triggerSuccess('Artikel Berhasil Dipublikasikan di Immortal Journal!');
    }

    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCover('');
    setBlogCategory('Music News');
    setBlogAuthor('');
    refreshData();
  };

  const handleStartEditBlogPost = (bp: BlogPost) => {
    setEditingBlogPostId(bp.id);
    setBlogTitle(bp.title);
    setBlogExcerpt(bp.excerpt || '');
    setBlogContent(bp.content);
    setBlogCover(bp.cover_image || '');
    setBlogCategory(bp.category || 'Music News');
    setBlogAuthor(bp.author?.full_name || 'Immortal Admin');
  };

  const handleCancelEditBlogPost = () => {
    setEditingBlogPostId(null);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCover('');
    setBlogCategory('Music News');
    setBlogAuthor('');
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return;
    await deleteBlogPost(id);
    triggerSuccess('Artikel Dihapus.');
    refreshData();
  };

  // 6. Event CRUD
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtLocation || !evtDate || !evtCover) return;

    const payload = {
      title: evtTitle,
      description: evtDesc,
      location: evtLocation,
      start_date: new Date(evtDate).toISOString(),
      cover_image: evtCover,
      ticket_link: evtTicket,
      price_info: evtPrice,
      is_online: evtOnline
    };

    if (editingEventId) {
      await updateEvent(editingEventId, payload);
      setEditingEventId(null);
      triggerSuccess('Event Berhasil Diperbarui!');
    } else {
      await addEvent(payload);
      triggerSuccess('Event Baru Berhasil Terjadwal!');
    }

    setEvtTitle('');
    setEvtDesc('');
    setEvtLocation('');
    setEvtDate('');
    setEvtCover('');
    setEvtTicket('');
    setEvtPrice('Free');
    setEvtOnline(false);
    refreshData();
  };

  const handleStartEditEvent = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setEvtTitle(evt.title);
    setEvtDesc(evt.description || '');
    setEvtLocation(evt.location);
    
    let formattedDate = '';
    if (evt.start_date) {
      const d = new Date(evt.start_date);
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
      formattedDate = localISOTime;
    }
    setEvtDate(formattedDate);
    setEvtCover(evt.cover_image || '');
    setEvtTicket(evt.ticket_link || '');
    setEvtPrice(evt.price_info || 'Free');
    setEvtOnline(evt.is_online || false);
  };

  const handleCancelEditEvent = () => {
    setEditingEventId(null);
    setEvtTitle('');
    setEvtDesc('');
    setEvtLocation('');
    setEvtDate('');
    setEvtCover('');
    setEvtTicket('');
    setEvtPrice('Free');
    setEvtOnline(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Batalkan & Hapus event ini?')) return;
    await deleteEvent(id);
    triggerSuccess('Event Dihapus.');
    refreshData();
  };

  // 7. Inquiry Status Update
  const handleInquiryStatus = async (id: string, nextStatus: string) => {
    await updateInquiryStatus(id, nextStatus);
    triggerSuccess('Status Inquiry Diubah.');
    refreshData();
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Hapus tiket inquiries ini?')) return;
    await deleteInquiry(id);
    triggerSuccess('Inquiry Dihapus.');
    refreshData();
  };

  // 8. Member Actions
  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminUser || !newAdminName) return;

    const ok = await createAdminAccount({
      email: newAdminEmail,
      username: newAdminUser.toLowerCase().replace(/\s+/g, '_'),
      fullName: newAdminName,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      bio: newAdminBio || 'Co-Administrator of Immortal Division.'
    });

    if (ok) {
      setNewAdminEmail('');
      setNewAdminUser('');
      setNewAdminName('');
      setNewAdminBio('');
      triggerSuccess('Akun Admin Baru Berhasil Ditambahkan!');
      refreshData();
    } else {
      alert('Email admin sudah terdaftar!');
    }
  };

  const handleToggleAdmin = async (id: string) => {
    if (id === 'admin-master') {
      alert('Hak akses Master Admin tidak dapat diubah!');
      return;
    }
    await toggleAdminPrivilege(id);
    triggerSuccess('Hak Akses Admin Diubah.');
    refreshData();
  };

  const handleDeleteMember = async (id: string) => {
    if (id === 'admin-master') {
      alert('Master Admin tidak dapat dihapus!');
      return;
    }
    if (!confirm('Hapus akun member ini secara permanen?')) return;
    await deleteMember(id);
    triggerSuccess('Akun Member Dihapus.');
    refreshData();
  };

  // 9. Store Product CRUD
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodImage) return;

    const payload = {
      name: prodName,
      description: prodDesc,
      price: Number(prodPrice),
      image_url: prodImage,
      stock: Number(prodStock),
      category: prodCategory,
      sizes: prodSizes.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingProductId) {
      await updateProduct(editingProductId, payload);
      setEditingProductId(null);
      triggerSuccess('Produk Berhasil Diperbarui!');
    } else {
      await addProduct(payload);
      triggerSuccess('Produk Store Berhasil Ditambahkan!');
    }

    setProdName('');
    setProdDesc('');
    setProdPrice(0);
    setProdImage('');
    setProdStock(10);
    setProdSizes('S, M, L, XL');
    refreshData();
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdDesc(prod.description || '');
    setProdPrice(prod.price);
    setProdImage(prod.image_url);
    setProdStock(prod.stock || 0);
    setProdCategory(prod.category || 'Baju');
    setProdSizes(prod.sizes ? prod.sizes.join(', ') : 'S, M, L, XL');
  };

  const handleCancelEditProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice(0);
    setProdImage('');
    setProdStock(10);
    setProdSizes('S, M, L, XL');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini dari store?')) return;
    await deleteProduct(id);
    triggerSuccess('Produk Dihapus.');
    refreshData();
  };

  // 10. Store Order CRUD & Actions
  const handleOrderStatus = async (id: string, nextStatus: string) => {
    await updateOrderStatus(id, nextStatus);
    triggerSuccess('Status Pembayaran Order Diperbarui.');
    refreshData();
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Hapus data pesanan ini?')) return;
    await deleteOrder(id);
    triggerSuccess('Pesanan Dihapus.');
    refreshData();
  };

  // Format Dates
  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // --- RENDERING ADMIN GATEWAY IF GUEST ---
  if (!user.isLoggedIn || !user.isAdmin) {
    return (
      <div className="bg-grid min-h-screen flex items-center justify-center pt-12 pb-24">
        <div className="mx-auto w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-primary/20 bg-[#0a0a0c]/90 p-8 shadow-2xl glass-red relative overflow-hidden"
          >
            <div className="pointer-events-none absolute top-0 left-0 h-[200px] w-[200px] rounded-full bg-primary/10 blur-[80px]" />

            <div className="mb-8 text-center relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                <Shield size={12} className="animate-pulse" />
                <span>Security Panel Gate</span>
              </span>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-wider text-white">
                ADMIN SYSTEM
              </h1>
              <p className="mt-1 text-xs text-muted">
                Silakan login menggunakan akun Master Administrator Anda.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-950/20 p-3.5 text-xs font-semibold text-rose-400 animate-shake">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Email Admin</label>
                <input
                  type="email"
                  required
                  placeholder="admin@immortaldivision.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-primary py-3.5 font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover active:scale-95"
              >
                Access System
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- RENDERING ADMIN DASHBOARD IF AUTHENTICATED ---
  return (
    <div className="bg-grid min-h-screen pt-6 pb-24">
      
      {/* Banner success notifications */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/90 p-4 text-sm font-bold text-emerald-400 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Shell Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* 1. LEFT SIDEBAR PANEL (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Admin Brand Card */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-5 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary font-black text-white">
                A
              </span>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-white">ImmortalAdmin</h2>
                <p className="text-[10px] text-primary font-semibold">Master System</p>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <div className="rounded-3xl border border-white/5 bg-[#08080a] p-2 space-y-1">
              {[
                { type: 'overview', label: 'Overview', icon: LayoutDashboard },
                { type: 'programs', label: 'Programs Catalog', icon: Tv },
                { type: 'episodes', label: 'Show Episodes', icon: Tv },
                { type: 'music', label: 'Music Tracks', icon: Music },
                { type: 'art', label: 'Art & Merch', icon: ImageIcon },
                { type: 'products', label: 'Store Products', icon: ShoppingBag },
                { type: 'orders', label: 'Store Orders', icon: ShoppingCart, count: ordersList.filter(o => o.payment_status === 'Pending').length },
                { type: 'blogs', label: 'Journal Articles', icon: Newspaper },
                { type: 'events', label: 'Events Schedule', icon: Calendar },
                { type: 'inquiries', label: 'B2B Inquiries', icon: Mail, count: inquiries.filter(i => i.status === 'Pending').length },
                { type: 'members', label: 'Members Area', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.type;
                return (
                  <button
                    key={tab.type}
                    onClick={() => setActiveTab(tab.type as TabType)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                      isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </div>
                    {/* Floating badge for pending inquiries/orders */}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="h-5 min-w-5 flex items-center justify-center rounded-full bg-primary px-1 font-mono text-[9px] text-white">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout Admin */}
            <button
              onClick={logout}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-rose-950/20 bg-rose-950/15 py-3 text-xs font-bold uppercase tracking-widest text-rose-400 transition hover:bg-rose-950/20"
            >
              <LogOut size={14} />
              <span>Quit Admin Panel</span>
            </button>

          </div>

          {/* 2. RIGHT CONTENTS DISPLAY PANEL (Col Span 9) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">OVERVIEW ANALYTICS</h1>
                  <p className="text-xs text-muted">Statistik dasar operasional Immortal Division platform.</p>
                </div>

                {/* Counters Widgets Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Total Members', count: members.length, icon: Users },
                    { label: 'Show Programs', count: programs.length, icon: Tv },
                    { label: 'Store Products', count: productsList.length, icon: ShoppingBag },
                    { label: 'Store Orders', count: ordersList.length, icon: ShoppingCart },
                    { label: 'Songs Track', count: tracks.length, icon: Music },
                    { label: 'B2B Inquiries', count: inquiries.length, icon: Mail }
                  ].map((wid) => {
                    const Icon = wid.icon;
                    return (
                      <div key={wid.label} className="rounded-3xl border border-white/5 bg-[#08080a] p-5 flex items-center gap-4 relative overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted">{wid.label}</p>
                          <p className="text-2xl font-black text-white mt-0.5">{wid.count}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Info Box */}
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-red-950/10 via-black to-neutral-900/30 p-6 md:p-8 glass-red">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Master System Configuration</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed max-w-2xl">
                    Selamat datang di panel admin Immortal Division. Di sini Anda memiliki kontrol penuh atas konten yang ditampilkan di situs utama. Anda dapat menambahkan konten baru (video original, track rilisan lagu, blog jurnalisme, event, merchandise) atau mengelola status database akun member, order toko, dan inquiries kemitraan komersial.
                  </p>
                </div>
              </div>
            )}

            {/* PROGRAMS TAB */}
            {activeTab === 'programs' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MANAGE SHOW PROGRAMS</h1>
                  <p className="text-xs text-muted">Tambahkan kategori/acara YouTube original baru.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form */}
                  <form onSubmit={handleAddProgram} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">{editingProgramId ? 'EDIT PROGRAM' : 'ADD PROGRAM'}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Judul Acara</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Immortal Studio Sessions"
                          value={progTitle}
                          onChange={(e) => setProgTitle(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Deskripsi Singkat</label>
                        <textarea
                          placeholder="Acara mingguan ngobrol santai..."
                          value={progDesc}
                          onChange={(e) => setProgDesc(e.target.value)}
                          rows={3}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none focus:border-primary/50 resize-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Cover Image URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={progCover}
                          onChange={(e) => setProgCover(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Tags (Pisahkan koma)</label>
                        <input
                          type="text"
                          placeholder="Talkshow, Indie, Gears"
                          value={progTags}
                          onChange={(e) => setProgTags(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="submit"
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        {editingProgramId ? <Check size={14} /> : <Plus size={14} />}
                        <span>{editingProgramId ? 'Update Program' : 'Add Program'}</span>
                      </button>
                      {editingProgramId && (
                        <button
                          type="button"
                          onClick={handleCancelEditProgram}
                          className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">PROGRAMS LIST ({programs.length})</h3>
                    <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                      {programs.map(p => (
                        <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={p.cover_image} className="h-10 w-16 rounded object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                              <p className="text-[9px] text-muted">slug: /{p.slug}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditProgram(p)}
                              className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(p.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EPISODES TAB */}
            {activeTab === 'episodes' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MANAGE EPISODES</h1>
                  <p className="text-xs text-muted">Kaitkan video YouTube original baru ke program acara.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form */}
                  <form onSubmit={handleAddEpisode} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">{editingEpisodeId ? 'EDIT EPISODE' : 'ADD EPISODE'}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Pilih Program</label>
                        <select
                          value={epProgId}
                          onChange={(e) => setEpProgId(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        >
                          {programs.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Judul Episode</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Synth Jam live set"
                          value={epTitle}
                          onChange={(e) => setEpTitle(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Deskripsi Episode</label>
                        <textarea
                          placeholder="Di episode kali ini kita membedah..."
                          value={epDesc}
                          onChange={(e) => setEpDesc(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none focus:border-primary/50 resize-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">YouTube Video ID</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. dQw4w9WgXcQ"
                          value={epYoutubeId}
                          onChange={(e) => setEpYoutubeId(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Season</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={epSeason}
                            onChange={(e) => setEpSeason(Number(e.target.value))}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Episode No.</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={epNumber}
                            onChange={(e) => setEpNumber(Number(e.target.value))}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-center">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Durasi</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 12:45"
                            value={epDuration}
                            onChange={(e) => setEpDuration(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            id="exclusive"
                            checked={epExclusive}
                            onChange={(e) => setEpExclusive(e.target.checked)}
                            className="accent-primary"
                          />
                          <label htmlFor="exclusive" className="text-[10px] font-bold uppercase tracking-wider text-muted cursor-pointer select-none">Exclusive Member</label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="submit"
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        {editingEpisodeId ? <Check size={14} /> : <Plus size={14} />}
                        <span>{editingEpisodeId ? 'Update Episode' : 'Add Episode'}</span>
                      </button>
                      {editingEpisodeId && (
                        <button
                          type="button"
                          onClick={handleCancelEditEpisode}
                          className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">EPISODES LIST ({episodes.length})</h3>
                    <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                      {episodes.map(e => {
                        const p = programs.find(prog => prog.id === e.program_id);
                        return (
                          <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{e.title}</h4>
                              <p className="text-[9px] text-muted">
                                {p?.title || 'Program'} • Season {e.season} Ep {e.episode_number}
                              </p>
                              {e.is_exclusive && (
                                <span className="inline-block rounded bg-primary/10 border border-primary/20 text-[8px] text-primary px-1 mt-1 font-bold">MEMBER GATED</span>
                              )}
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditEpisode(e)}
                                className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteEpisode(e.id)}
                                className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 shrink-0"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MUSIC TAB */}
            {activeTab === 'music' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MANAGE MUSIC RELEASES</h1>
                  <p className="text-xs text-muted">Rilis lagu audio orisinil ke dalam galeri.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form */}
                  <form onSubmit={handleAddTrack} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">{editingTrackId ? 'EDIT MUSIC TRACK' : 'RELEASE TRACK'}</h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Judul Lagu</label>
                          <input
                            type="text"
                            required
                            placeholder="Midnight Rain"
                            value={trackTitle}
                            onChange={(e) => setTrackTitle(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Nama Artist</label>
                          <input
                            type="text"
                            required
                            placeholder="Luna Eclipse"
                            value={trackArtist}
                            onChange={(e) => setTrackArtist(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Nama Album</label>
                          <input
                            type="text"
                            placeholder="Neon EP"
                            value={trackAlbum}
                            onChange={(e) => setTrackAlbum(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Durasi</label>
                          <input
                            type="text"
                            required
                            placeholder="04:20"
                            value={trackDuration}
                            onChange={(e) => setTrackDuration(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Cover Image URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={trackCover}
                          onChange={(e) => setTrackCover(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Audio File URL (MP3)</label>
                        <input
                          type="url"
                          required
                          placeholder="https://www.soundhelix.com/examples/mp3/..."
                          value={trackAudioUrl}
                          onChange={(e) => setTrackAudioUrl(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Spotify Embed Code (Iframe)</label>
                        <input
                          type="text"
                          placeholder="<iframe src='...' />"
                          value={trackSpotify}
                          onChange={(e) => setTrackSpotify(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Apple Music URL</label>
                        <input
                          type="url"
                          placeholder="https://music.apple.com/..."
                          value={trackApple}
                          onChange={(e) => setTrackApple(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Lirik Lagu</label>
                        <textarea
                          placeholder="Tulis lirik lagu..."
                          value={trackLyrics}
                          onChange={(e) => setTrackLyrics(e.target.value)}
                          rows={3}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="submit"
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        {editingTrackId ? <Check size={14} /> : <Plus size={14} />}
                        <span>{editingTrackId ? 'Update Track' : 'Release Track'}</span>
                      </button>
                      {editingTrackId && (
                        <button
                          type="button"
                          onClick={handleCancelEditTrack}
                          className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">RELEASES LIST ({tracks.length})</h3>
                    <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
                      {tracks.map(t => (
                        <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={t.cover_image} className="h-10 w-10 rounded object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{t.title}</h4>
                              <p className="text-[9px] text-muted">{t.artist} — {t.album || 'No Album'}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditTrack(t)}
                              className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteTrack(t.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 shrink-0"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ART TAB */}
            {activeTab === 'art' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MANAGE ART & MERCH</h1>
                  <p className="text-xs text-muted">Tambahkan portofolio artwork digital.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form */}
                  <form onSubmit={handleAddArt} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">{editingArtId ? 'EDIT ARTWORK' : 'ADD ARTWORK'}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Judul Karya</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Neon Horizon"
                          value={artTitle}
                          onChange={(e) => setArtTitle(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Artist / Designer</label>
                          <input
                            type="text"
                            placeholder="e.g. Reza Art"
                            value={artArtist}
                            onChange={(e) => setArtArtist(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Kategori</label>
                          <select
                            value={artCategory}
                            onChange={(e) => setArtCategory(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          >
                            <option value="Digital Art">Digital Art</option>
                            <option value="Poster Art">Poster Art</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Deskripsi</label>
                        <textarea
                          placeholder="Deskripsi karya seni..."
                          value={artDesc}
                          onChange={(e) => setArtDesc(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Image URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={artImage}
                          onChange={(e) => setArtImage(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="submit"
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        {editingArtId ? <Check size={14} /> : <Plus size={14} />}
                        <span>{editingArtId ? 'Update Artwork' : 'Add Artwork'}</span>
                      </button>
                      {editingArtId && (
                        <button
                          type="button"
                          onClick={handleCancelEditArt}
                          className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">ARTWORKS LIST ({artWorks.length})</h3>
                    <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                      {artWorks.map(a => (
                        <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={a.image_url} className="h-10 w-10 rounded object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{a.title}</h4>
                              <p className="text-[9px] text-muted">Category: {a.category}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditArt(a)}
                              className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteArt(a.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 shrink-0"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STORE PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MANAGE STORE PRODUCTS</h1>
                  <p className="text-xs text-muted">Kelola barang merchandise yang dijual di toko.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form */}
                  <form onSubmit={handleAddProduct} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">{editingProductId ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Nama Barang</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Immortal Hoodie"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Kategori</label>
                          <select
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none focus:border-primary/50"
                          >
                            <option value="Baju">Baju</option>
                            <option value="Jaket">Jaket</option>
                            <option value="Topi">Topi</option>
                            <option value="Celana">Celana</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Stok (Pcs)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={prodStock}
                            onChange={(e) => setProdStock(Number(e.target.value))}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Harga (Rp)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="e.g. 150000"
                            value={prodPrice || ''}
                            onChange={(e) => setProdPrice(Number(e.target.value))}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Ukuran (Koma)</label>
                          <input
                            type="text"
                            placeholder="S, M, L, XL"
                            value={prodSizes}
                            onChange={(e) => setProdSizes(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Deskripsi Barang</label>
                        <textarea
                          placeholder="Spesifikasi bahan kaos..."
                          value={prodDesc}
                          onChange={(e) => setProdDesc(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Foto Barang URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="submit"
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        {editingProductId ? <Check size={14} /> : <Plus size={14} />}
                        <span>{editingProductId ? 'Update Product' : 'Add Product'}</span>
                      </button>
                      {editingProductId && (
                        <button
                          type="button"
                          onClick={handleCancelEditProduct}
                          className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">PRODUCTS LIST ({productsList.length})</h3>
                    <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                      {productsList.map(prod => (
                        <div key={prod.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={prod.image_url} className="h-10 w-10 rounded object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                              <p className="text-[9px] text-muted">{prod.category} • {formatIDR(prod.price)} • Stock: {prod.stock}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditProduct(prod)}
                              className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 shrink-0"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STORE ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">STORE TRANSACTIONS</h1>
                  <p className="text-xs text-muted">Kelola order penjualan merchandise member via Transfer Bank.</p>
                </div>

                <div className="space-y-4">
                  {ordersList.length > 0 ? (
                    ordersList.map((ord) => (
                      <div key={ord.id} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4 relative overflow-hidden">
                        {/* Header */}
                        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/5 pb-3">
                          <div>
                            <span className="text-[10px] font-mono font-black text-primary">{ord.id}</span>
                            <h3 className="text-base font-bold text-white mt-0.5">Buyer: {ord.buyer_name}</h3>
                            <p className="text-[10px] text-muted">Email: {ord.buyer_email} • Phone: {ord.buyer_phone}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Payment Status Badge */}
                            <span className={`rounded py-0.5 px-2.5 text-[9px] font-bold uppercase tracking-wider text-white ${
                              ord.payment_status === 'Pending' ? 'bg-primary' : 'bg-emerald-600'
                            }`}>
                              {ord.payment_status}
                            </span>
                            
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Order item details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 border border-white/5 p-4 rounded-xl text-xs">
                          <div>
                            <h4 className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">Rincian Barang</h4>
                            <p className="text-neutral-300">Barang: <span className="text-white font-bold">{ord.product_name}</span></p>
                            <p className="text-neutral-300">Ukuran (Size): <span className="text-white font-bold">{ord.size}</span></p>
                            <p className="text-neutral-300">Jumlah (Qty): <span className="text-white font-bold">{ord.quantity} Pcs</span></p>
                            <p className="text-primary font-bold mt-1">Total: {formatIDR(ord.total_price)}</p>
                          </div>

                          <div>
                            <h4 className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">Alamat Pengiriman</h4>
                            <p className="text-neutral-300 leading-relaxed">{ord.buyer_address}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => handleOrderStatus(ord.id, 'Paid')}
                            className="flex items-center gap-1 rounded-lg bg-emerald-950/20 border border-emerald-500/25 py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                          >
                            <Check size={12} />
                            <span>Mark Paid</span>
                          </button>

                          <button
                            onClick={() => handleOrderStatus(ord.id, 'Pending')}
                            className="rounded-lg bg-white/5 py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition"
                          >
                            Mark Pending
                          </button>

                          {/* Chat Buyer on WhatsApp */}
                          <a
                            href={`https://wa.me/${ord.buyer_phone}?text=${encodeURIComponent(`Halo ${ord.buyer_name}, kami dari Immortal Division Store ingin mengonfirmasi pesanan Anda dengan Order ID ${ord.id}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/25 py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition"
                          >
                            <MessageSquare size={12} />
                            <span>Chat WhatsApp Buyer</span>
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 rounded-3xl border border-white/5 bg-[#08080a] text-center text-sm text-neutral-600">
                      Belum ada pesanan masuk dari toko.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MANAGE JOURNAL ARTICLES</h1>
                  <p className="text-xs text-muted">Tulis artikel jurnalisme atau review album musik baru.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form */}
                  <form onSubmit={handleAddBlogPost} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">{editingBlogPostId ? 'EDIT ARTICLE' : 'PUBLISH ARTICLE'}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Judul Artikel</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Analisis Musik Folk"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Kategori</label>
                          <select
                            value={blogCategory}
                            onChange={(e) => setBlogCategory(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          >
                            <option value="Music News">Music News</option>
                            <option value="Editor Picks">Editor Picks</option>
                            <option value="Gear Reviews">Gear Reviews</option>
                            <option value="Culture">Culture</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Penulis</label>
                          <input
                            type="text"
                            placeholder="e.g. Nico Wicaksana"
                            value={blogAuthor}
                            onChange={(e) => setBlogAuthor(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-4 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Excerpt (Ringkasan singkat)</label>
                        <input
                          type="text"
                          placeholder="Ringkasan 1 kalimat artikel..."
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Cover Image URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={blogCover}
                          onChange={(e) => setBlogCover(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Konten Lengkap</label>
                        <textarea
                          required
                          placeholder="Tulis tulisan konten artikel di sini (mendukung spasi baris)..."
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          rows={6}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="submit"
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        {editingBlogPostId ? <Check size={14} /> : <Plus size={14} />}
                        <span>{editingBlogPostId ? 'Update Article' : 'Publish Blog'}</span>
                      </button>
                      {editingBlogPostId && (
                        <button
                          type="button"
                          onClick={handleCancelEditBlogPost}
                          className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">ARTICLES LIST ({posts.length})</h3>
                    <div className="max-h-[480px] overflow-y-auto space-y-3 pr-1">
                      {posts.map(p => (
                        <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={p.cover_image} className="h-10 w-14 rounded object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                              <p className="text-[9px] text-muted">Author: {p.author?.full_name || 'Admin'} • {p.category}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditBlogPost(p)}
                              className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteBlogPost(p.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 shrink-0"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MANAGE EVENTS & WORKSHOPS</h1>
                  <p className="text-xs text-muted">Rencanakan agenda gig musik offline atau online masterclass.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form */}
                  <form onSubmit={handleAddEvent} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">{editingEventId ? 'EDIT EVENT' : 'SCHEDULE EVENT'}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Nama Event</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Synth Workshop"
                          value={evtTitle}
                          onChange={(e) => setEvtTitle(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Deskripsi Event</label>
                        <textarea
                          placeholder="Workshop synthesizer gratis..."
                          value={evtDesc}
                          onChange={(e) => setEvtDesc(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Tanggal Mulai</label>
                          <input
                            type="datetime-local"
                            required
                            value={evtDate}
                            onChange={(e) => setEvtDate(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-3 text-xs text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Lokasi / Venue</label>
                          <input
                            type="text"
                            required
                            placeholder="Senayan, Jakarta"
                            value={evtLocation}
                            onChange={(e) => setEvtLocation(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-3 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Harga / Biaya Tiket</label>
                          <input
                            type="text"
                            required
                            placeholder="Free atau Rp 100.000"
                            value={evtPrice}
                            onChange={(e) => setEvtPrice(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 px-3 text-xs text-white outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            id="online"
                            checked={evtOnline}
                            onChange={(e) => setEvtOnline(e.target.checked)}
                            className="accent-primary"
                          />
                          <label htmlFor="online" className="text-[10px] font-bold uppercase tracking-wider text-muted cursor-pointer select-none">Online Event</label>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Cover Banner Image URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={evtCover}
                          onChange={(e) => setEvtCover(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Link Tiket Partner (Jika Berbayar)</label>
                        <input
                          type="url"
                          placeholder="https://loket.com/..."
                          value={evtTicket}
                          onChange={(e) => setEvtTicket(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        type="submit"
                        className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        {editingEventId ? <Check size={14} /> : <Plus size={14} />}
                        <span>{editingEventId ? 'Update Event' : 'Schedule Event'}</span>
                      </button>
                      {editingEventId && (
                        <button
                          type="button"
                          onClick={handleCancelEditEvent}
                          className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List */}
                  <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">EVENTS LIST ({events.length})</h3>
                    <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
                      {events.map(e => (
                        <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={e.cover_image} className="h-10 w-14 rounded object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{e.title}</h4>
                              <p className="text-[9px] text-muted">{formatShortDate(e.start_date)} • {e.location}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditEvent(e)}
                              className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(e.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 shrink-0"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">PARTNERSHIP INQUIRIES</h1>
                  <p className="text-xs text-muted">Tiket pesan kemitraan B2B yang dikirimkan calon mitra.</p>
                </div>

                <div className="space-y-4">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <div key={inq.id} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4 relative overflow-hidden">
                        {/* Top bar */}
                        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/5 pb-3">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{inq.subject}</span>
                            <h3 className="text-base font-bold text-white mt-0.5">from {inq.name} ({inq.company || 'Perorangan'})</h3>
                            <p className="text-[10px] text-muted">Email: {inq.email} • Sent: {formatShortDate(inq.created_at)}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Status Pill Badge */}
                            <span className={`rounded py-0.5 px-2.5 text-[9px] font-bold uppercase tracking-wider text-white ${
                              inq.status === 'Pending' ? 'bg-primary' : inq.status === 'Reviewed' ? 'bg-amber-600' : 'bg-emerald-600'
                            }`}>
                              {inq.status}
                            </span>
                            
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="rounded-lg bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Content text */}
                        <p className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed bg-black/40 border border-white/5 p-4 rounded-xl">
                          {inq.message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleInquiryStatus(inq.id, 'Reviewed')}
                            className="rounded-lg bg-white/5 py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => handleInquiryStatus(inq.id, 'Replied')}
                            className="rounded-lg bg-emerald-950/20 border border-emerald-500/25 py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-600 hover:text-white"
                          >
                            Mark Replied
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 rounded-3xl border border-white/5 bg-[#08080a] text-center text-sm text-neutral-600">
                      Belum ada partnership inquiries yang masuk.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MEMBERS TAB (MEMBERS & ADMIN MANAGEMENT) */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black uppercase text-white tracking-wider">MEMBERS & ROLES</h1>
                  <p className="text-xs text-muted">Kelola akun komunitas member dan buat admin baru.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                  
                  {/* Left Column: Invite/Create Admin Form (Col Span 5) */}
                  <div className="md:col-span-5">
                    <form onSubmit={handleInviteAdmin} className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 flex items-center gap-2">
                        <UserPlus size={16} className="text-primary" />
                        <span>CREATE NEW ADMIN</span>
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Email Admin</label>
                          <input
                            type="email"
                            required
                            placeholder="admin2@immortaldivision.com"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Username</label>
                          <input
                            type="text"
                            required
                            placeholder="alex_admin"
                            value={newAdminUser}
                            onChange={(e) => setNewAdminUser(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Nama Lengkap</label>
                          <input
                            type="text"
                            required
                            placeholder="Alex Smith"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Short Bio</label>
                          <textarea
                            placeholder="Bio admin..."
                            value={newAdminBio}
                            onChange={(e) => setNewAdminBio(e.target.value)}
                            rows={2}
                            className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="flex cursor-pointer w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover transition"
                      >
                        <Plus size={14} />
                        <span>Create Admin Account</span>
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Member Registry Table (Col Span 7) */}
                  <div className="md:col-span-7">
                    <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2 font-black">MEMBER REGISTRY ({members.length})</h3>
                      
                      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                        {members.map(member => (
                          <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/40 p-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={member.avatarUrl} className="h-10 w-10 rounded-full object-cover border border-white/5" />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">{member.fullName}</h4>
                                <p className="text-[9px] text-muted">@{member.username} • {member.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Toggle Admin Privilege Button */}
                              <button
                                onClick={() => handleToggleAdmin(member.id)}
                                className={`flex items-center gap-1 rounded px-2 py-1 text-[9px] font-black uppercase tracking-wider transition ${
                                  member.isAdmin 
                                    ? 'bg-primary text-white border border-primary/20' 
                                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <Shield size={10} />
                                <span>{member.isAdmin ? 'Admin' : 'Member'}</span>
                              </button>

                              {/* Delete Profile Account */}
                              <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="rounded bg-rose-950/20 p-1.5 text-rose-400 hover:bg-rose-950/40"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
