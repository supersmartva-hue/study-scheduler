import { Bell, X, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getUnreadCount, getNotifications, markAllRead } from '../../api/users.api';
import Tooltip from '../common/Tooltip';

const TYPE_ICONS = {
  reminder: '⏰', missed: '❌', streak: '🔥', achievement: '🏆', system: 'ℹ️',
};

export default function TopBar({ title, subtitle, onMenuClick }) {
  const [unread, setUnread]        = useState(0);
  const [open, setOpen]            = useState(false);
  const [notifications, setNotifs] = useState([]);
  const [loading, setLoading]      = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    fetchCount();
    const iv = setInterval(fetchCount, 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchCount = () => getUnreadCount().then(d => setUnread(d.count)).catch(() => {});

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      const data = await getNotifications().catch(() => []);
      setNotifs(data);
      setLoading(false);
    }
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setUnread(0);
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m / 60)}h ago`;
    return `${Math.floor(m / 1440)}d ago`;
  };

  return (
    <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 flex-shrink-0"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>

      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5 truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: date + bell */}
      <div className="flex items-center gap-2">
        {/* Date pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-xs font-semibold text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Notification bell */}
        <div className="relative" ref={ref}>
          <Tooltip text={unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''} — click to view` : 'Notifications — reminders & achievements'} position="bottom">
            <button
              onClick={handleOpen}
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
                open ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <Bell size={17} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] rounded-full flex items-center justify-center text-white text-[9px] font-bold px-1"
                  style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 2px 6px rgba(244,63,94,0.5)' }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
          </Tooltip>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-200 z-30 animate-fade-in overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  {unread > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      {unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={handleMarkAll} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {loading && (
                  <div className="space-y-3 p-4">
                    {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl skeleton" />)}
                  </div>
                )}
                {!loading && notifications.length === 0 && (
                  <div className="py-10 text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-sm font-semibold text-slate-600">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No new notifications</p>
                  </div>
                )}
                {!loading && notifications.map(n => (
                  <div key={n.id}
                    className={`px-4 py-3 flex gap-3 transition-colors ${!n.is_read ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}>
                    <div className="text-lg flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type] || 'ℹ️'}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {n.title}
                      </p>
                      {n.message && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>}
                      <p className="text-xs text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
