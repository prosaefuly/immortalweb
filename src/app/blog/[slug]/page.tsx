'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  getBlogPostBySlug, 
  getBlogPosts, 
  getComments, 
  addComment, 
  BlogPost, 
  Comment 
} from '@/lib/db';
import { ArrowLeft, Send, MessageSquare, Link as LinkIcon, Check, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const { user, setShowAuthModal } = useApp();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load Post and Related Posts
  useEffect(() => {
    const loadPostData = async () => {
      const activePost = await getBlogPostBySlug(slug);
      if (!activePost) return;
      setPost(activePost);

      const allPosts = await getBlogPosts();
      // Filter out current post, get up to 3 posts of same category
      const related = allPosts
        .filter(p => p.id !== activePost.id)
        .slice(0, 3);
      setRelatedPosts(related);

      // Load comments
      const comms = await getComments({ postId: activePost.id });
      setComments(comms);
    };

    loadPostData();
  }, [slug]);

  // Handle Comment Submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.isLoggedIn || !newCommentText.trim() || !post) return;

    setSubmittingComment(true);
    const added = await addComment({
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      postId: post.id,
      content: newCommentText.trim()
    });
    setSubmittingComment(false);

    if (added) {
      setComments(prev => [...prev, added]);
      setNewCommentText('');
    }
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!post) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white">Loading Article...</h2>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-muted transition hover:text-white"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Journal</span>
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Article Reader & Comments (Col Span 8) */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* Article Header Card */}
          <article className="overflow-hidden rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
            
            {/* Category and Read time */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-primary py-0.5 px-2 text-[9px] font-black uppercase tracking-wider text-white">
                {post.category}
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <Clock size={12} className="text-primary" />
                <span>5 Min Read</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl leading-tight">
              {post.title}
            </h1>

            {/* Author details */}
            <div className="flex items-center gap-4 border-y border-white/5 py-4">
              <img
                src={post.author.avatar_url}
                alt={post.author.full_name}
                className="h-10 w-10 rounded-full object-cover border border-primary/20"
              />
              <div>
                <p className="text-sm font-bold text-white">Written by {post.author.full_name}</p>
                <p className="text-xs text-muted">Published: {formatDate(post.published_at)}</p>
              </div>
            </div>

            {/* Cover Image */}
            <div className="aspect-[1.9] overflow-hidden rounded-2xl border border-white/5 bg-neutral-900">
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Article Content Render */}
            <div className="font-sans text-base leading-relaxed text-neutral-300 space-y-6 pt-4 border-t border-white/5">
              {post.content.split('\n\n').map((para, i) => {
                if (para.trim().startsWith('###')) {
                  // Render subheadings
                  return (
                    <h3 key={i} className="text-xl font-bold text-white pt-4 tracking-tight">
                      {para.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (para.trim().startsWith('**')) {
                  // Bold text
                  return (
                    <p key={i} className="font-bold text-white">
                      {para.replace(/\*\*/g, '').trim()}
                    </p>
                  );
                }
                return (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Share Widget Controls */}
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-10">
              <span className="text-xs font-black uppercase tracking-widest text-white">SHARE ARTICLE</span>
              
              <div className="flex items-center gap-2">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-lg bg-white/5 py-2 px-4 text-xs font-bold text-white hover:bg-white/10"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon size={12} className="text-primary" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {/* Twitter Share Button */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-[#1DA1F2] py-2 px-4 text-xs font-bold text-white hover:opacity-90"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Tweet</span>
                </a>
              </div>
            </div>

          </article>

          {/* Comments Discussion Area */}
          <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 md:p-8 space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-wider text-white border-b border-white/5 pb-4">
              <MessageSquare size={18} className="text-primary" />
              <span>DISCUSSIONS ({comments.length})</span>
            </h3>

            {/* Post Comments form (Authenticated check) */}
            {user.isLoggedIn ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-10 w-10 rounded-full object-cover border border-primary/20"
                />
                <div className="flex-1 space-y-3">
                  <textarea
                    placeholder="Tulis tanggapan atau opini mengenai ulasan ini..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-primary/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary py-2 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Send size={12} />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-black/40 p-6 text-center">
                <p className="text-sm text-muted">
                  Hanya member EvoluMedia yang dapat berpartisipasi dalam diskusi artikel.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  Sign In / Register &rarr;
                </button>
              </div>
            )}

            {/* Comment Timeline Feed */}
            <div className="space-y-4 pt-2">
              {comments.length > 0 ? (
                comments.map((comm) => (
                  <div key={comm.id} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-b-0">
                    <img
                      src={comm.avatar_url}
                      alt={comm.username}
                      className="h-10 w-10 rounded-full object-cover border border-white/5"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">@{comm.username}</span>
                        <span className="text-[10px] text-muted">
                          {new Date(comm.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-sm">{comm.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-neutral-600">
                  Belum ada tanggapan diskusi di artikel ini.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Recommendations Sidebar (Col Span 4) */}
        <div className="space-y-6 lg:col-span-4">
          
          {/* Related Articles Card */}
          <div className="rounded-3xl border border-white/5 bg-[#08080a] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b border-white/5 pb-3">
              RECOMMENDED READS
            </h3>
            
            <div className="space-y-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex gap-3 block"
                >
                  <img
                    src={related.cover_image}
                    alt={related.title}
                    className="h-14 w-20 rounded-lg object-cover border border-white/5 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold leading-snug text-white group-hover:text-primary transition line-clamp-2">
                      {related.title}
                    </h4>
                    <span className="text-[9px] text-muted block mt-1 font-sans">
                      {formatDate(related.published_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
