import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/subjects':  'My Subjects',
  '/schedule':  'Study Schedule',
  '/progress':  'Progress & Stats',
  '/settings':  'Settings',
};

const PAGE_SUBTITLES = {
  '/dashboard': 'Your daily overview and quick actions',
  '/subjects':  'Track and manage all your study subjects',
  '/schedule':  'AI-generated weekly plan tailored to your goals',
  '/progress':  'Insights into your study habits and growth',
  '/settings':  'Customize your account and study preferences',
};

export default function AppShell() {
  const { pathname } = useLocation();
  const title    = PAGE_TITLES[pathname]    || 'StudyAI';
  const subtitle = PAGE_SUBTITLES[pathname] || '';

  // On desktop: sidebar starts expanded; on mobile: collapsed
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>

      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar (hidden on mobile unless drawer open) ── */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 flex-shrink-0
      `}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 pb-24 lg:pb-8 page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <BottomNav />
    </div>
  );
}
