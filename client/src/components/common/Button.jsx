export default function Button({
  children, variant = 'primary', size = 'md',
  loading, className = '', ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none';

  const variants = {
    primary:   'bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-brand hover:-translate-y-0.5 hover:shadow-lg focus:ring-brand-500',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md focus:ring-slate-300',
    danger:    'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose hover:-translate-y-0.5 hover:shadow-lg focus:ring-rose-400',
    ghost:     'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
    success:   'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald hover:-translate-y-0.5 hover:shadow-lg focus:ring-emerald-400',
    outline:   'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 hover:-translate-y-0.5 focus:ring-brand-400',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
