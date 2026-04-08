export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-slate-100 text-slate-600',
    indigo:   'bg-brand-100 text-brand-700',
    green:    'bg-emerald-100 text-emerald-700',
    red:      'bg-rose-100 text-rose-700',
    yellow:   'bg-amber-100 text-amber-700',
    blue:     'bg-cyan-100 text-cyan-700',
    purple:   'bg-violet-100 text-violet-700',
    gradient: 'text-white',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant] || variants.default} ${className}`}
      style={variant === 'gradient' ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
    >
      {children}
    </span>
  );
}
