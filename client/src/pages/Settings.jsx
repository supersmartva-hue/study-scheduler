import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';
import { updateMe } from '../api/users.api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Clock, Zap, Shield, ChevronRight } from 'lucide-react';
import Tooltip from '../components/common/Tooltip';
import toast from 'react-hot-toast';

function SectionCard({ icon: Icon, title, description, children, color = '#6366f1', bg = '#eef2ff' }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bg }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function Settings() {
  const user     = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    full_name: '', study_start_hour: 8, study_end_hour: 22,
    daily_goal_hours: 4, timezone: 'UTC',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({
      full_name: user.full_name || '',
      study_start_hour: user.study_start_hour ?? 8,
      study_end_hour: user.study_end_hour ?? 22,
      daily_goal_hours: user.daily_goal_hours ?? 4,
      timezone: user.timezone || 'UTC',
    });
  }, [user]);

  const set    = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setNum = k => e => setForm(f => ({ ...f, [k]: Number(e.target.value) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMe(form);
      await dispatch(fetchCurrentUser());
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const studyWindow = form.study_end_hour - form.study_start_hour;
  const to12h = h => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:00 ${ampm}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account and study preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Profile */}
        <SectionCard icon={User} title="Profile" description="Your personal information"
          color="#6366f1" bg="#eef2ff">
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user?.full_name || 'Student'}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
                    Level {user?.level || 1}
                  </span>
                  <span className="text-xs text-amber-600 font-semibold">🔥 {user?.current_streak || 0} day streak</span>
                </div>
              </div>
            </div>
            <Input label="Full Name" value={form.full_name} onChange={set('full_name')} placeholder="Your name" />
            <Input label="Timezone" value={form.timezone} onChange={set('timezone')} placeholder="e.g. America/New_York" hint="Used to align your schedule correctly" />
          </div>
        </SectionCard>

        {/* Study preferences */}
        <SectionCard icon={Clock} title="Study Preferences" description="Configure when and how much you study"
          color="#10b981" bg="#ecfdf5">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  Study Starts ({to12h(form.study_start_hour)})
                </label>
                <input type="range" min="5" max="14" value={form.study_start_hour} onChange={setNum('study_start_hour')}
                  className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  Study Ends ({to12h(form.study_end_hour)})
                </label>
                <input type="range" min="14" max="24" value={form.study_end_hour} onChange={setNum('study_end_hour')}
                  className="w-full accent-emerald-500" />
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <Clock size={15} className="text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-700">
                Study window: <strong>{to12h(form.study_start_hour)} – {to12h(form.study_end_hour)}</strong>
                {' '}({studyWindow} hours available)
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Daily Goal: <span className="text-emerald-600">{form.daily_goal_hours} hours</span>
              </label>
              <input type="range" min="1" max="12" step="0.5" value={form.daily_goal_hours}
                onChange={setNum('daily_goal_hours')} className="w-full accent-emerald-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1h</span><span>6h</span><span>12h</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* AI */}
        <SectionCard icon={Zap} title="AI Settings" description="Configure your OpenAI integration"
          color="#f59e0b" bg="#fffbeb">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border border-amber-100">
            <div>
              <p className="text-sm font-semibold text-amber-800">OpenAI API Key</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Add your key in <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">server/.env</code> to enable real AI scheduling
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-700">Mock Mode</span>
          </div>
        </SectionCard>

        <Tooltip text="Save all changes to your profile and study preferences" position="top">
          <Button type="submit" loading={saving} className="w-full justify-center py-3 text-base">
            Save Settings
          </Button>
        </Tooltip>
      </form>

      {/* Account danger zone */}
      <div className="card overflow-hidden border-rose-100">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-rose-50">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-50">
            <Shield size={17} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Account</h3>
            <p className="text-xs text-slate-400">Signed in as {user?.email}</p>
          </div>
        </div>
        <div className="p-5">
          <Tooltip text="Permanently deletes your account, subjects, schedules and all data — cannot be undone" position="top">
            <button className="flex items-center justify-between w-full text-sm text-rose-500 font-medium hover:text-rose-600 transition-colors">
              <span>Delete account and all data</span>
              <ChevronRight size={16} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
