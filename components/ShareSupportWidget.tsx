'use client';

import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type ShareContext = 'homepage' | 'planner' | 'quiz' | 'milestone' | 'general';

interface ShareSupportWidgetProps {
  context?: ShareContext;
  title?: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}

const messagePool: Record<ShareContext, string[]> = {
  homepage: [
    "We've been using Prepify11Plus and it's been brilliant for structured 11+ prep. Worth a look.",
    'Found a lovely resource for 11+ learning and study planning: Prepify11Plus',
    'Really helpful study tools for children preparing for 11+. Sharing in case useful.'
  ],
  planner: [
    'Prepify11Plus has a really helpful 11+ study planner for families. Worth sharing if useful.',
    'If you are building an 11+ routine, the Prepify11Plus planner is a lovely tool to try.',
    'Sharing this Prepify11Plus planner for any parent organising 11+ prep at home.'
  ],
  quiz: [
    'Prepify11Plus practice tools keep 11+ revision structured and confidence-first. Worth a look.',
    'Found really helpful 11+ quizzes and practice tools on Prepify11Plus—sharing in case useful.',
    'If your child is preparing for 11+, Prepify11Plus practice sessions are great for steady progress.'
  ],
  milestone: [
    'Prepify11Plus has been a lovely support for our 11+ journey. Passing it on for other families.',
    'Sharing Prepify11Plus because the tools are clear, friendly, and genuinely useful for 11+ prep.',
    'If Prepify11Plus has helped your family too, here it is for anyone who may benefit.'
  ],
  general: [
    'Prepify11Plus is a great resource for 11+ learning and confidence-building practice.',
    'Helpful independent education tools for 11+ prep: Prepify11Plus.',
    'Sharing Prepify11Plus in case another family finds it useful for 11+ preparation.'
  ]
};

function getPageUrl() {
  if (typeof window === 'undefined') return 'https://elevenspark.example.com';
  return window.location.href;
}

function getCurrentMessage(context: ShareContext) {
  if (typeof window === 'undefined') return messagePool[context][0];
  const list = messagePool[context];
  const idx = new Date().getDate() % list.length;
  return list[idx];
}

function buildShareUrls(text: string, url: string) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  return {
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent('Prepify11Plus recommendation')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    instagram: 'https://www.instagram.com'
  };
}

export function CopyLinkButton({ value, label = 'Copy link', className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const area = document.createElement('textarea');
        area.value = value;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={twMerge(
        'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        copied && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        className
      )}
      aria-label="Copy share link"
    >
      <span>{copied ? '✓' : '🔗'}</span>
      <span>{copied ? 'Link copied — thank you for supporting us!' : label}</span>
    </button>
  );
}

function ShareModal({ open, onClose, context }: { open: boolean; onClose: () => void; context: ShareContext }) {
  const url = getPageUrl();
  const message = getCurrentMessage(context);
  const urls = buildShareUrls(message, url);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label="Share Prepify11Plus">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-text">Thanks for supporting Prepify11Plus</h3>
            <p className="mt-1 text-sm text-slate-600">Every share helps another child learn with confidence.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close share modal">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['X', urls.x],
            ['Facebook', urls.facebook],
            ['WhatsApp', urls.whatsapp],
            ['LinkedIn', urls.linkedin],
            ['Email', urls.email],
            ['Instagram', urls.instagram]
          ].map(([name, link]) => (
            <a key={name} href={link} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 p-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
              {name}
            </a>
          ))}
        </div>

        <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested message</p>
          <p className="text-sm text-slate-700">{message}</p>
          <p className="text-xs text-slate-500">Instagram tip: copy caption + link, then paste into your story, bio, or messages.</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <CopyLinkButton value={url} />
          <CopyLinkButton value={`${message} ${url}`} label="Copy caption + link" />
        </div>
      </div>
    </div>
  );
}

export function ShareButton({ context = 'general', className }: { context?: ShareContext; className?: string }) {
  const [open, setOpen] = useState(false);

  async function onShare() {
    const url = getPageUrl();
    const text = getCurrentMessage(context);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Prepify11Plus', text, url });
        return;
      }
    } catch {
      // intentionally silent fallback to modal
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={onShare}
        className={twMerge(
          'inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className
        )}
      >
        Share with Parents
      </button>
      <ShareModal open={open} onClose={() => setOpen(false)} context={context} />
    </>
  );
}

export function ShareSupportWidget({
  context = 'general',
  title = 'Love Prepify11Plus?',
  subtitle = 'Word of mouth helps us grow and helps more children learn with confidence.',
  className,
  compact = false
}: ShareSupportWidgetProps) {
  const messagePreview = useMemo(() => getCurrentMessage(context), [context]);

  return (
    <section className={twMerge('rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6', className)} aria-label="Share and support">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Share & Support</p>
      <h3 className="mt-2 text-xl font-heading font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      {!compact && <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">“{messagePreview}”</p>}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ShareButton context={context} />
        <CopyLinkButton value={getPageUrl()} label="Copy Link" />
      </div>
    </section>
  );
}
