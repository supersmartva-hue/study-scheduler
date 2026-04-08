import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import Input from '../components/common/Input';
import { Zap, ArrowRight, Check } from 'lucide-react';

const PERKS = ['AI-generated weekly schedules', 'XP, streaks & achievements', 'Smart rescheduling for missed sessions'];

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    if (!result.error) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f8fafc' }}>
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div className="relative w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left copy */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-2xl text-slate-900">StudyAI</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              Start studying{' '}
              <span className="gradient-text">smarter today</span>
            </h1>
            <p className="text-slate-500 text-lg mt-3">
              Join thousands of students who transformed their learning with AI-powered schedules.
            </p>
          </div>

          <div className="space-y-3">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                  <Check size={13} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-slate-700 font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-glass border border-slate-100 p-8">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-slate-900">StudyAI</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="text-slate-500 text-sm mt-1">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
                ⚠️ {error}
              </div>
            )}
            <Input label="Full Name" placeholder="Nadia Mahak" value={form.fullName} onChange={set('fullName')} />
            <Input label="Email address *" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            <Input label="Password *" type="password" placeholder="Min. 8 characters"
              hint="Use at least 8 characters for security"
              value={form.password} onChange={set('password')} required minLength={8} />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span>Create account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
