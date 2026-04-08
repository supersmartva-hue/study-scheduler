export default function ProgressBar({ value, max = 100, gradient, color, className = '', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const bg = gradient || 'linear-gradient(90deg, #6366f1, #8b5cf6)';

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: bg }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-slate-500 mt-1 text-right">{pct}%</div>
      )}
    </div>
  );
}
