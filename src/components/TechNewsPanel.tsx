import { useState, useEffect, useCallback, useRef } from 'react';
import {
  X, RefreshCw, ExternalLink, Clock, Zap, Globe, Cpu, Flame,
  Users, TrendingUp, ChevronRight, Wifi, WifiOff
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  summary: string;
  source: string;
  category: string;
  color: string;
  image: string | null;
  published: string | null;
}

interface TechNewsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const BACKEND_URL = 'http://127.0.0.1:8555';
const REFRESH_INTERVAL = 10 * 60 * 1000;

const TABS = [
  { id: 'all',       label: 'All',       icon: Globe,       color: '#60a5fa' },
  { id: 'startup',   label: 'Startup',   icon: TrendingUp,  color: '#0FA0CE' },
  { id: 'gadgets',   label: 'Gadgets',   icon: Zap,         color: '#FF4D4D' },
  { id: 'ai',        label: 'AI',        icon: Cpu,         color: '#A855F7' },
  { id: 'community', label: 'Community', icon: Users,       color: '#FF6600' },
];

const CATEGORY_MAP: Record<string, string> = {
  'Startup & VC':   'startup',
  'Gadgets & Tech': 'gadgets',
  'Science & Tech': 'gadgets',
  'Deep Dive':      'gadgets',
  'AI & Research':  'ai',
  'Community':      'community',
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Recently';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

function SkeletonCard() {
  return (
    <div className="tn-skeleton">
      <div className="tn-skel-line tn-skel-title" />
      <div className="tn-skel-line tn-skel-body" />
      <div className="tn-skel-line tn-skel-meta" />
    </div>
  );
}

function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="tn-card"
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <div className="tn-card-header">
        <span className="tn-badge" style={{ borderColor: article.color, color: article.color }}>
          {article.source}
        </span>
        <span className="tn-time">
          <Clock size={10} />
          {timeAgo(article.published)}
        </span>
      </div>

      <div className="tn-card-body">
        <div className="tn-card-text">
          <h3 className="tn-card-title">{article.title}</h3>
          {article.summary && (
            <p className="tn-card-summary">{stripHtml(article.summary).slice(0, 115)}…</p>
          )}
        </div>
        {article.image && !imgErr && (
          <img src={article.image} alt="" className="tn-card-img" onError={() => setImgErr(true)} />
        )}
      </div>

      <div className="tn-card-footer">
        <span className="tn-category">{article.category}</span>
        <span className="tn-read-more">Read <ChevronRight size={11} /></span>
      </div>
    </a>
  );
}

export function TechNewsPanel({ isOpen, onClose }: TechNewsPanelProps) {
  const [articles, setArticles]   = useState<NewsArticle[]>([]);
  const [loading, setLoading]     = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [isOnline, setIsOnline]   = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [countdown, setCountdown] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNews = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/tech-news${force ? '?refresh=true' : ''}`,
        { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setLastFetch(new Date());
      setIsOnline(true);
    } catch (err) {
      console.error('[TechNews]', err);
      setError('Could not load news. Check backend connection.');
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (articles.length === 0) fetchNews();
    timerRef.current = setInterval(() => fetchNews(true), REFRESH_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isOpen, fetchNews, articles.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Live countdown
  useEffect(() => {
    if (!lastFetch) return;
    const update = () => {
      const rem = Math.max(0, REFRESH_INTERVAL - (Date.now() - lastFetch.getTime()));
      const m = Math.floor(rem / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setCountdown(`${m}:${s.toString().padStart(2, '0')}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [lastFetch]);

  const filtered = articles.filter(a =>
    activeTab === 'all' ? true : (CATEGORY_MAP[a.category] || 'community') === activeTab
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="tn-backdrop" onClick={onClose} />
      <div className="tn-panel">
        {/* Header */}
        <div className="tn-header">
          <div className="tn-header-left">
            <div className="tn-header-icon"><Flame size={15} /></div>
            <div>
              <h2 className="tn-title">Tech News</h2>
              <div className="tn-subtitle">
                {isOnline
                  ? <><Wifi size={10} /> Live &middot; {articles.length} stories</>
                  : <><WifiOff size={10} /> Offline</>}
                {lastFetch && <span className="tn-countdown">&middot; Refreshes in {countdown}</span>}
              </div>
            </div>
          </div>
          <div className="tn-header-right">
            <button
              className={`tn-refresh-btn${loading ? ' spinning' : ''}`}
              onClick={() => fetchNews(true)}
              disabled={loading}
              title="Force refresh"
            >
              <RefreshCw size={14} />
            </button>
            <button className="tn-close-btn" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tn-tabs">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const cnt = tab.id === 'all'
              ? articles.length
              : articles.filter(a => (CATEGORY_MAP[a.category] || 'community') === tab.id).length;
            return (
              <button
                key={tab.id}
                className={`tn-tab${activeTab === tab.id ? ' active' : ''}`}
                style={activeTab === tab.id ? { '--tc': tab.color } as React.CSSProperties : {}}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={11} />
                {tab.label}
                {cnt > 0 && <span className="tn-tab-cnt">{cnt}</span>}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="tn-content">
          {loading && articles.length === 0 ? (
            <div className="tn-list">{Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : error && articles.length === 0 ? (
            <div className="tn-error-state">
              <WifiOff size={30} />
              <p>{error}</p>
              <button onClick={() => fetchNews(true)} className="tn-retry-btn">
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="tn-empty-state">
              <Globe size={26} />
              <p>No stories in this category.</p>
            </div>
          ) : (
            <div className="tn-list">
              {loading && (
                <div className="tn-refreshing-bar"><RefreshCw size={11} className="spin" /> Refreshing…</div>
              )}
              {filtered.map((a, i) => <NewsCard key={a.id} article={a} index={i} />)}
              <div className="tn-sources-note">
                <ExternalLink size={9} />
                TechCrunch · The Verge · Wired · Ars Technica · MIT Tech Review · Hacker News
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
