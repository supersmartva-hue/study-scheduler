import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActiveSchedule, markComplete, markSkip } from '../store/scheduleSlice';
import { fetchSubjects } from '../store/subjectsSlice';
import { getStats } from '../api/users.api';
import { formatDate, formatTime } from '../utils/dateUtils';
import { CheckCircle2, Flame, TrendingUp, Zap, BookOpen, Clock, ArrowRight, Sparkles, Target } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import Tooltip from '../components/common/Tooltip';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const STAT_CARDS = [
  {
    key: 'sessions_completed', label: 'Sessions Done',
    icon: CheckCircle2, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    bg: 'linear-gradient(135deg, #ecfdf5, #f0fdfa)',
    border: '#d1fae5', iconColor: '#10b981',
    tip: 'Total study sessions you have completed so far',
  },
  {
    key: 'streak', label: 'Day Streak',
    icon: Flame, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    bg: 'linear-gradient(135deg, #fffbeb, #fff7ed)',
    border: '#fde68a', iconColor: '#f59e0b',
    tip: 'Consecutive days you have studied — don\'t break the chain!',
  },
  {
    key: 'completion_rate', label: 'Completion Rate',
    icon: TrendingUp, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    bg: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    border: '#c7d2fe', iconColor: '#6366f1',
    tip: 'Percentage of scheduled sessions you actually completed',
    format: v => v ? `${v}%` : '—',
  },
  {
    key: 'xp_total', label: 'Total XP',
    icon: Zap, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    bg: 'linear-gradient(135deg, #ecfeff, #eff6ff)',
    border: '#a5f3fc', iconColor: '#06b6d4',
    tip: 'Experience points earned — complete sessions to level up',
  },
];

const STATUS_CONFIG = {
  pending:     { bg: 'bg-blue-50',    text: 'text-blue-600',   label: 'Pending'   },
  completed:   { bg: 'bg-emerald-50', text: 'text-emerald-600',label: 'Done'      },
  missed:      { bg: 'bg-rose-50',    text: 'text-rose-500',   label: 'Missed'    },
  skipped:     { bg: 'bg-slate-100',  text: 'text-slate-500',  label: 'Skipped'   },
  rescheduled: { bg: 'bg-amber-50',   text: 'text-amber-600',  label: 'Moved'     },
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data: schedule, loading } = useSelector(s => s.schedule);
  const subjects = useSelector(s => s.subjects.items);
  const user     = useSelector(s => s.auth.user);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dispatch(fetchActiveSchedule());
    dispatch(fetchSubjects());
    getStats().then(setStats).catch(() => {});
  }, [dispatch]);

  const today = formatDate(new Date());
  const todaySessions = schedule?.sessions?.filter(s => s.planned_date?.startsWith(today)) || [];
  const pendingToday  = todaySessions.filter(s => s.status === 'pending').length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: 'Good morning', emoji: '☀️' };
    if (h < 17) return { text: 'Good afternoon', emoji: '⚡' };
    return { text: 'Good evening', emoji: '🌙' };
  };
  const greeting = getGreeting();

  const handleComplete = async (id) => {
    await dispatch(markComplete(id));
    toast.success('Session completed! XP earned 🎉');
  };

  const getStatValue = (card) => {
    if (card.key === 'streak') return user?.current_streak ?? 0;
    if (card.key === 'xp_total') return user?.xp_total ?? 0;
    if (card.key === 'completion_rate') return stats?.completion_rate;
    return stats?.[card.key] ?? '—';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.3) 0%, transparent 60%)' }} />
        {/* Decorative dots */}
        <div className="absolute right-6 top-4 opacity-20">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="inline-block w-1.5 h-1.5 rounded-full bg-white m-1"
              style={{ opacity: Math.random() > 0.4 ? 1 : 0.4 }} />
          ))}
        </div>

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">
              {greeting.emoji} {greeting.text}
            </p>
            <h2 className="text-2xl font-bold text-white">
              {user?.full_name?.split(' ')[0] || 'Student'}!
            </h2>
            <p className="text-indigo-300 text-sm mt-1.5">
              {pendingToday > 0
                ? `You have ${pendingToday} session${pendingToday > 1 ? 's' : ''} left today. Keep pushing!`
                : todaySessions.length > 0
                ? 'All done for today! Excellent work 🏆'
                : 'No sessions today. Generate your weekly schedule!'}
            </p>
          </div>
          <Link to="/schedule"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-900 transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.95)' }}>
            <Sparkles size={15} />
            {schedule ? 'View Schedule' : 'Generate Schedule'}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* XP progress */}
        {user?.xp_total !== undefined && (
          <div className="relative z-10 mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-2">
              <span className="font-semibold">Level {user.level || 1}</span>
              <span>{user.xp_total || 0} XP · {Math.pow((user.level || 1), 2) * 100 - ((user.xp_total || 0) % (Math.pow((user.level || 1), 2) * 100))} XP to next level</span>
            </div>
            <div className="h-2 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, ((user.xp_total || 0) % (Math.pow((user.level || 1), 2) * 100)) / (Math.pow((user.level || 1), 2) * 100) * 100)}%`, background: 'linear-gradient(90deg, #a5b4fc, #c4b5fd)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => {
          const Icon = card.icon;
          const val = getStatValue(card);
          const display = card.format ? card.format(val) : val;
          return (
            <Tooltip key={card.key} text={card.tip} position="bottom">
              <div className="stat-card border cursor-default w-full"
                style={{ background: card.bg, borderColor: card.border }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm"
                  style={{ background: card.gradient }}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{display ?? '—'}</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</div>
              </div>
            </Tooltip>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Today's sessions */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Clock size={15} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Today's Sessions</h3>
                <p className="text-xs text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <Link to="/schedule" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading && (
            <div className="p-4 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl skeleton" />)}
            </div>
          )}

          {!loading && todaySessions.length === 0 && (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
                <BookOpen size={24} className="text-brand-400" />
              </div>
              <p className="font-semibold text-slate-600 text-sm">No sessions today</p>
              <p className="text-xs text-slate-400 mt-1">Generate your AI schedule to get started</p>
              <Link to="/schedule">
                <button className="btn-primary mt-4 text-xs px-4 py-2">
                  <Sparkles size={13} /> Generate Schedule
                </button>
              </Link>
            </div>
          )}

          {todaySessions.map(session => {
            const cfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
            return (
              <div key={session.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: session.subject_color || '#6366f1' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {session.title || session.subject_name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatTime(session.start_time)} – {formatTime(session.end_time)} · {session.duration_mins} min
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.text} flex-shrink-0`}>
                  {cfg.label}
                </span>
                {session.status === 'pending' && (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Tooltip text="Mark as completed — earn XP & update streak" position="top">
                      <button onClick={() => handleComplete(session.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                        <CheckCircle2 size={15} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Skip this session — won't count toward your progress" position="top">
                      <button onClick={() => dispatch(markSkip(session.id))}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors">
                        ×
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Subject progress */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
              <Target size={15} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Subject Progress</h3>
              <p className="text-xs text-slate-400">{subjects.length} active</p>
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400">No subjects yet</p>
              <Link to="/subjects" className="text-xs text-brand-600 font-semibold mt-1 inline-block">+ Add subjects</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.slice(0, 5).map(s => {
                const pct = s.estimated_hours > 0 ? Math.min(100, (s.hours_completed / s.estimated_hours) * 100) : 0;
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-xs font-semibold text-slate-700 truncate">{s.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 ml-2 flex-shrink-0">{Math.round(pct)}%</span>
                    </div>
                    <ProgressBar value={pct} max={100} />
                  </div>
                );
              })}
              {subjects.length > 5 && (
                <Link to="/subjects" className="text-xs text-brand-600 font-semibold">
                  +{subjects.length - 5} more subjects
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
