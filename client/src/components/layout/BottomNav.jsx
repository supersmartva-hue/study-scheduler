import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, BarChart2, Settings } from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home',     activeColor: '#4f46e5' },
  { to: '/subjects',  icon: BookOpen,         label: 'Subjects', activeColor: '#059669' },
  { to: '/schedule',  icon: Calendar,         label: 'Schedule', activeColor: '#7c3aed' },
  { to: '/progress',  icon: BarChart2,        label: 'Progress', activeColor: '#0891b2' },
  { to: '/settings',  icon: Settings,         label: 'Settings', activeColor: '#d97706' },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 flex items-stretch"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {NAV.map(({ to, icon: Icon, label, activeColor }) => (
        <NavLink
          key={to}
          to={to}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-slate-400 transition-colors"
          style={({ isActive }) => isActive ? { color: activeColor } : {}}
        >
          {({ isActive }) => (
            <>
              <div className={`w-10 h-7 rounded-xl flex items-center justify-center transition-all duration-150 ${isActive ? 'bg-slate-100' : ''}`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-semibold leading-none ${isActive ? 'font-bold' : ''}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
