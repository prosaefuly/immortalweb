'use client';

import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, Underline, Heading2, Heading3, 
  List, ListOrdered, Quote, Link as LinkIcon, 
  Eye, Edit2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tuliskan deskripsi lengkap event...',
  minHeight = '180px'
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (openTag: string, closeTag: string, defaultText = 'Teks') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const before = value.substring(0, start);
    const after = value.substring(end);

    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newValue = `${before}${replacement}${after}`;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 10);
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL tautan / link:', 'https://');
    if (!url) return;
    wrapSelection(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary-hover">`, '</a>', 'Teks Link');
  };

  const insertList = (ordered = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let listHtml = '';
    if (selectedText.trim()) {
      const lines = selectedText.split('\n').filter(l => l.trim().length > 0);
      const items = lines.map(line => `  <li>${line.trim()}</li>`).join('\n');
      listHtml = ordered 
        ? `<ol class="list-decimal pl-5 space-y-1 my-2">\n${items}\n</ol>` 
        : `<ul class="list-disc pl-5 space-y-1 my-2">\n${items}\n</ul>`;
    } else {
      listHtml = ordered 
        ? `<ol class="list-decimal pl-5 space-y-1 my-2">\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ol>`
        : `<ul class="list-disc pl-5 space-y-1 my-2">\n  <li>Poin 1</li>\n  <li>Poin 2</li>\n</ul>`;
    }

    const before = value.substring(0, start);
    const after = value.substring(end);
    onChange(`${before}${listHtml}${after}`);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#08080a] overflow-hidden focus-within:border-primary/50 transition">
      {/* Top Bar: Tabs & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 bg-black/40 px-3 py-2">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            title="Tebal (Bold)"
            onClick={() => wrapSelection('<strong>', '</strong>', 'Teks Tebal')}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            title="Miring (Italic)"
            onClick={() => wrapSelection('<em>', '</em>', 'Teks Miring')}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            title="Garis Bawah (Underline)"
            onClick={() => wrapSelection('<u>', '</u>', 'Teks Garis Bawah')}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <Underline size={14} />
          </button>

          <span className="h-4 w-[1px] bg-white/10 mx-1" />

          <button
            type="button"
            title="Heading 2 (Subjudul Utama)"
            onClick={() => wrapSelection('<h2 class="text-xl font-bold text-white mt-4 mb-2">', '</h2>', 'Subjudul Event')}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            title="Heading 3 (Subjudul Kecil)"
            onClick={() => wrapSelection('<h3 class="text-base font-bold text-primary mt-3 mb-1">', '</h3>', 'Poin Penting')}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <Heading3 size={14} />
          </button>

          <span className="h-4 w-[1px] bg-white/10 mx-1" />

          <button
            type="button"
            title="Daftar Poin (Bullet List)"
            onClick={() => insertList(false)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            title="Daftar Bernomor (Numbered List)"
            onClick={() => insertList(true)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            title="Kutipan (Blockquote)"
            onClick={() => wrapSelection('<blockquote class="border-l-2 border-primary pl-4 py-1 italic text-neutral-300 my-2 bg-primary/5 rounded-r">', '</blockquote>', 'Catatan penting')}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            title="Tautan / Link"
            onClick={insertLink}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <LinkIcon size={14} />
          </button>
        </div>

        {/* View Switcher: Editor vs Preview */}
        <div className="flex items-center gap-1 rounded-lg bg-black/60 p-0.5 border border-white/5 text-[10px] font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              activeTab === 'edit' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Edit2 size={10} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              activeTab === 'preview' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye size={10} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full bg-transparent p-4 text-xs leading-relaxed text-white outline-none placeholder:text-neutral-600 resize-y font-sans"
        />
      ) : (
        <div 
          style={{ minHeight }}
          className="p-4 text-xs leading-relaxed text-neutral-300 overflow-y-auto max-h-80"
        >
          {value ? (
            <div 
              className="space-y-3 prose prose-invert max-w-none text-xs" 
              dangerouslySetInnerHTML={{ __html: value }} 
            />
          ) : (
            <p className="italic text-neutral-600">Belum ada konten deskripsi yang ditulis.</p>
          )}
        </div>
      )}
      
      {/* Bottom Hint */}
      <div className="flex justify-between items-center px-4 py-1.5 bg-black/30 border-t border-white/5 text-[9px] text-neutral-500">
        <span>Format WYSIWYG aktif • Mendukung HTML & styling teks visual</span>
        <span>{value ? `${value.length} karakter` : '0 karakter'}</span>
      </div>
    </div>
  );
};
