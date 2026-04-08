import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Calendar, BarChart2,
  Settings, LogOut, Zap, Flame, Star,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import Tooltip from '../common/Tooltip';

const NAV = [
  {
    to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',
    grad: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    activeBg: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    activeText: '#4f46e5', dot: '#6366f1',
    tip: 'Overview: today\'s sessions, stats & quick actions',
  },
  {
    to: '/subjects', icon: BookOpen, label: 'My Subjects',
    grad: 'linear-gradient(135deg, #059669, #0891b2)',
    activeBg: 'linear-gradient(135deg, #ecfdf5, #ecfeff)',
    activeText: '#059669', dot: '#10b981',
    tip: 'Add & manage subjects with deadlines and difficulty',
  },
  {
    to: '/schedule', icon: Calendar, label: 'Schedule',
    grad: 'linear-gradient(135deg, #7c3aed, #db2777)',
    activeBg: 'linear-gradient(135deg, #f5f3ff, #fdf2f8)',
    activeText: '#7c3aed', dot: '#8b5cf6',
    tip: 'Generate & view your AI-powered weekly study plan',
  },
  {
    to: '/progress', icon: BarChart2, label: 'Progress',
    grad: 'linear-gradient(135deg, #0891b2, #4f46e5)',
    activeBg: 'linear-gradient(135deg, #ecfeff, #eef2ff)',
    activeText: '#0891b2', dot: '#06b6d4',
    tip: 'Charts, streaks, XP levels and subject breakdown',
  },
  {
    to: '/settings', icon: Settings, label: 'Settings',
    grad: 'linear-gradient(135deg, #d97706, #ea580c)',
    activeBg: 'linear-gradient(135deg, #fffbeb, #fff7ed)',
    activeText: '#d97706', dot: '#f59e0b',
    tip: 'Study hours, timezone, AI settings & account',
  },
];

export default function Sidebar({ collapsed, onToggle, onMobileClose }) {
  const dispatch  = useDispatch();
  const user      = useSelector(s => s.auth.user);
  const xpForNext = user ? Math.pow((user.level || 1), 2) * 100 : 100;
  const xpPct     = user ? Math.min(100, ((user.xp_total || 0) % xpForNext) / xpForNext * 100) : 0;

  return (
    <aside
      className="flex flex-col h-screen border-r border-indigo-100 transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? 72 : 256,
        background: 'linear-gradient(180deg, #ffffff 0%, #f5f7ff 100%)',
        boxShadow: '4px 0 32px rgba(79,70,229,0.08)',
      }}
    >
      {/* ── Logo / header row ── */}
      <div className={`flex items-center h-16 flex-shrink-0 border-b border-indigo-50 ${
        collapsed ? 'justify-center' : 'px-4 justify-between'
      }`}>
        {collapsed ? (
          <Tooltip text="StudyAI — Smart Scheduler" position="right">
            <button onClick={onToggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-brand"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <Zap size={17} className="text-white" fill="white" />
            </button>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-brand"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">StudyAI</span>
                <div className="text-[10px] font-semibold leading-none mt-0.5"
                  style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Smart Scheduler
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Mobile close */}
              <Tooltip text="Close menu" position="bottom">
                <button onClick={onMobileClose}
                  className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-indigo-50 transition-colors">
                  <X size={14} />
                </button>
              </Tooltip>
              {/* Desktop collapse */}
              <Tooltip text="Collapse sidebar" position="bottom">
                <button onClick={onToggle}
                  className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-indigo-50 transition-colors">
                  <ChevronLeft size={14} />
                </button>
              </Tooltip>
            </div>
          </>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-indigo-300">Menu</p>
        )}
        {NAV.map(({ to, icon: Icon, label, grad, activeBg, activeText, dot, tip }) => (
          <Tooltip key={to} text={collapsed ? `${label} — ${tip}` : tip} position="right">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl transition-all duration-150 ${
                  collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                } ${isActive ? '' : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50'}`
              }
              style={({ isActive }) => isActive ? { background: activeBg } : {}}
            >
              {({ isActive }) => (
                <>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={isActive
                      ? { background: grad, boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }
                      : { background: '#e0e7ff' }
                    }>
                    <Icon size={15} style={{ color: isActive ? '#fff' : '#818cf8' }} />
                  </div>
                  {!collapsed && (
                    <>
                      <span className={`text-sm flex-1 ${isActive ? 'font-bold' : 'font-medium'}`}
                        style={isActive ? { color: activeText } : {}}>
                        {label}
                      </span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          </Tooltip>
        ))}
      </nav>

      {/* ── User card + logout ── */}
      {user && (
        <div className="border-t border-indigo-100 p-2.5 space-y-1">
          {!collapsed && (
            <div className="px-3 py-2.5 rounded-xl mb-1 border border-indigo-100"
              style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-brand"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                  {(user.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {user.full_name || 'Student'}
                  </p>
                  <p className="text-[10px] text-indigo-400 truncate font-medium">{user.email}</p>
                </div>
              </div>
              {/* XP */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <Star size={9} className="text-amber-500" fill="currentColor" />
                  <span className="text-[10px] font-bold text-amber-600">Level {user.level || 1}</span>
                </div>
                <span className="text-[10px] font-semibold text-indigo-400">{user.xp_total || 0} XP</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#c7d2fe' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }} />
              </div>
              {(user.current_streak || 0) > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Flame size={10} className="text-orange-500" fill="currentColor" />
                  <span className="text-[10px] font-bold text-orange-500">
                    {user.current_streak} day streak 🔥
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Logout */}
          <Tooltip text="Sign out of your account" position={collapsed ? 'right' : 'top'}>
            <button
              onClick={() => dispatch(logout())}
              className={`flex items-center gap-2.5 w-full rounded-xl text-sm font-semibold transition-all duration-150 text-slate-500 hover:text-rose-600 hover:bg-rose-50 ${
                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#fee2e2' }}>
                <LogOut size={14} className="text-rose-500" />
              </div>
              {!collapsed && <span>Sign out</span>}
            </button>
          </Tooltip>

          {collapsed && (
            <Tooltip text="Expand sidebar" position="right">
              <button onClick={onToggle}
                className="flex items-center justify-center w-full p-2 rounded-xl text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <ChevronRight size={15} />
              </button>
            </Tooltip>
          )}
        </div>
      )}
    </aside>
  );
}
