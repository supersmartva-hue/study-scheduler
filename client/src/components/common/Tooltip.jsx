import { useState } from 'react';

const POSITIONS = {
  right:  'left-full ml-2.5 top-1/2 -translate-y-1/2',
  left:   'right-full mr-2.5 top-1/2 -translate-y-1/2',
  top:    'bottom-full mb-2 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
};

const ARROWS = {
  right:  'absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800',
  left:   'absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-800',
  top:    'absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800',
  bottom: 'absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800',
};

export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  if (!text) return <>{children}</>;

  return (
    <div
      className="relative inline-flex w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`absolute z-[200] pointer-events-none ${POSITIONS[position]}`}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))' }}>
          <div className="relative">
            <div
              className="px-3 py-1.5 text-[11px] font-medium text-white rounded-lg whitespace-nowrap max-w-[220px] leading-relaxed"
              style={{ background: '#1e293b' }}
            >
              {text}
            </div>
            <div className={ARROWS[position]} />
          </div>
        </div>
      )}
    </div>
  );
}
