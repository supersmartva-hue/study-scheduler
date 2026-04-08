import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubjects } from '../store/subjectsSlice';
import { getStats, getAchievements } from '../api/users.api';
import { getSessions } from '../api/sessions.api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
} from 'recharts';
import { Trophy, Flame, Clock, CheckCircle, TrendingUp, Star, Award, Zap } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';

const ACHIEVEMENT_ICONS = {
  first_session: '⭐', streak_3: '🔥', streak_7: '⚡', streak_30: '🏆',
  complete_10: '✅', complete_50: '📚', complete_100: '🎓', night_owl: '🦉',
  early_bird: '🌅', speed_run: '⚡',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-glass border border-slate-100 px-3.5 py-2.5">
      <p className="text-xs font-bold text-slate-700">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold mt-0.5" style={{ color: p.color || '#6366f1' }}>
          {p.value} {p.name === 'minutes' ? 'min' : ''}
        </p>
      ))}
    </div>
  );
}

export default function Progress() {
  const dispatch   = useDispatch();
  const user       = useSelector(s => s.auth.user);
  const subjects   = useSelector(s => s.subjects.items);
  const [stats, setStats]          = useState(null);
  const [achievements, setAchievs] = useState([]);
  const [sessions, setSessions]    = useState([]);

  useEffect(() => {
    dispatch(fetchSubjects());
    getStats().then(setStats).catch(() => {});
    getAchievements().then(setAchievs).catch(() => {});
    getSessions({}).then(setSessions).catch(() => {});
  }, [dispatch]);

  // Last 14 days chart data
  const dailyData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const date = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const minutes = sessions
      .filter(s => s.planned_date?.startsWith(date) && s.status === 'completed')
      .reduce((sum, s) => sum + (s.duration_mins || 0), 0);
    return { day: i % 2 === 0 ? dayLabel : '', date, minutes };
  });

  // Pie data
  const pieData = subjects.map(s => ({
    name: s.name, value: Number(s.hours_completed) || 0, color: s.color,
  })).filter(s => s.value > 0);

  const level      = user?.level || 1;
  const xpTotal    = user?.xp_total || 0;
  const xpForNext  = Math.pow(level, 2) * 100;
  const xpProgress = Math.min(100, (xpTotal % xpForNext) / xpForNext * 100);
  const hoursStudied = stats ? Math.round(stats.total_minutes_studied / 60) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">

      {/* Level banner */}
      <div className="relative overflow-hidden rounded-3xl text-white p-6"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(99,102,241,0.25) 0%, transparent 60%)' }} />

        <div className="relative z-10 grid sm:grid-cols-3 gap-6">
          {/* Level + XP */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-brand"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {level}
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide">Current Level</p>
                <h2 className="text-2xl font-black text-white">Level {level}</h2>
                <p className="text-indigo-300 text-sm">{xpTotal.toLocaleString()} XP earned</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-indigo-300 mb-1.5">
                <span>Progress to Level {level + 1}</span>
                <span>{xpForNext - (xpTotal % xpForNext)} XP remaining</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${xpProgress}%`, background: 'linear-gradient(90deg, #818cf8, #c084fc)' }} />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex flex-col justify-center items-center bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-4xl mb-1">🔥</div>
            <div className="text-3xl font-black text-white">{user?.current_streak || 0}</div>
            <div className="text-indigo-300 text-sm font-medium">Day Streak</div>
            <div className="text-indigo-400 text-xs mt-1">Best: {user?.longest_streak || 0} days</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle, label: 'Completed',    value: stats?.sessions_completed ?? '—', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', bg: '#ecfdf5', border: '#d1fae5' },
          { icon: Clock,       label: 'Hours Studied', value: hoursStudied ? `${hoursStudied}h` : '—',     gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', bg: '#eef2ff', border: '#c7d2fe' },
          { icon: TrendingUp,  label: 'Completion %',  value: stats?.completion_rate ? `${stats.completion_rate}%` : '—', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', bg: '#fffbeb', border: '#fde68a' },
          { icon: Trophy,      label: 'Missed',        value: stats?.sessions_missed ?? '—',    gradient: 'linear-gradient(135deg, #f43f5e, #f97316)',  bg: '#fff1f2', border: '#fecdd3' },
        ].map(({ icon: Icon, label, value, gradient, bg, border }) => (
          <div key={label} className="stat-card border" style={{ background: bg, borderColor: border }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: gradient }}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Daily area chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Study Activity (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="minutes" name="minutes" stroke="#6366f1" strokeWidth={2.5}
                fill="url(#studyGrad)" dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject breakdown */}
        {pieData.length > 0 ? (
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Hours by Subject</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={35} outerRadius={65} paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={v => [`${v.toFixed(1)}h`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.slice(0, 4).map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-slate-600 truncate flex-1">{s.name}</span>
                  <span className="text-xs font-bold text-slate-700">{s.value.toFixed(1)}h</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-5 flex flex-col items-center justify-center text-center">
            <Star size={32} className="text-slate-200 mb-3" />
            <p className="text-sm text-slate-500 font-medium">Complete sessions to see progress</p>
          </div>
        )}
      </div>

      {/* Subject progress table */}
      {subjects.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">Subject Breakdown</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {subjects.map(s => {
              const pct = s.estimated_hours > 0 ? Math.min(100, (s.hours_completed / s.estimated_hours) * 100) : 0;
              return (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)` }}>
                    {s.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-800 truncate">{s.name}</span>
                      <span className="text-xs font-bold text-slate-500 ml-2 flex-shrink-0">
                        {Number(s.hours_completed).toFixed(1)} / {s.estimated_hours}h
                      </span>
                    </div>
                    <ProgressBar value={pct} max={100}
                      gradient={`linear-gradient(90deg, ${s.color}, ${s.color}88)`} />
                  </div>
                  <span className="text-sm font-bold flex-shrink-0 ml-2"
                    style={{ color: s.color }}>{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Achievements Earned</h3>
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff' }}>
              {achievements.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {achievements.map(a => (
              <div key={a.slug} className="flex items-center gap-3 p-3.5 rounded-2xl border transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #fffbeb, #fff7ed)', borderColor: '#fde68a' }}>
                <span className="text-2xl flex-shrink-0">{ACHIEVEMENT_ICONS[a.slug] || '🏅'}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{a.name}</p>
                  <p className="text-xs text-amber-600 font-semibold">+{a.xp_reward} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
