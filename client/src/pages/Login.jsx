import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import Input from '../components/common/Input';
import { Zap, ArrowRight, BookOpen, Brain, Trophy } from 'lucide-react';

const FEATURES = [
  { icon: Brain,    color: '#6366f1', label: 'AI-Powered Scheduling' },
  { icon: BookOpen, color: '#8b5cf6', label: 'Smart Subject Tracking'  },
  { icon: Trophy,   color: '#06b6d4', label: 'Gamified Learning'       },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (!result.error) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        {/* Ambient */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-white font-bold text-xl">StudyAI</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Study smarter,<br />
              <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                not harder
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Your AI-powered study companion that adapts to your schedule and maximizes learning efficiency.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, color, label }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}25`, border: `1px solid ${color}40` }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <span className="text-slate-200 font-medium text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-sm">
          © 2026 StudyAI. Designed for students, built for results.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-slate-900">StudyAI</span>
          </div>

          <div className="bg-white rounded-3xl shadow-glass border border-slate-100 p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-900">Welcome back 👋</h1>
              <p className="text-slate-500 text-sm mt-1">Sign in to your study dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}
              <Input label="Email address" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <Input label="Password" type="password" placeholder="Enter your password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />

              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 mt-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>Sign in</span><ArrowRight size={16} /></>
                }
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
