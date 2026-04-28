import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Clapperboard, LayoutDashboard, Lightbulb, LogOut, Menu, Settings, Tv2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/auth';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/channels', label: 'Canais', icon: Tv2 },
  { to: '/trends', label: 'Tendências', icon: Lightbulb },
  { to: '/scripts', label: 'Roteiros', icon: Clapperboard },
  { to: '/productions', label: 'Produções', icon: UploadCloud },
  { to: '/publishing', label: 'Publicação', icon: UploadCloud },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

export function AppShell() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const sidebar = (
    <aside className="w-72 bg-slate-900 p-4 text-slate-100">
      <h1 className="mb-6 text-xl font-semibold">Editorial Automation</h1>
      <nav className="space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 rounded px-3 py-2 ${location.pathname === to ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen">
          <div className="hidden md:block">{sidebar}</div>
          {open && <div className="fixed inset-0 z-50 md:hidden">{sidebar}</div>}
          <main className="flex-1 p-6">
            <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow dark:bg-slate-900">
              <button onClick={() => setOpen((v) => !v)} className="md:hidden">
                <Menu />
              </button>
              <div className="text-sm">{user?.email}</div>
              <div className="flex gap-2">
                <button onClick={() => setDark((v) => !v)} className="rounded bg-slate-200 px-3 py-2 text-sm dark:bg-slate-700">
                  {dark ? 'Claro' : 'Escuro'}
                </button>
                <button onClick={() => void logout()} className="flex items-center gap-1 rounded bg-rose-500 px-3 py-2 text-white">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </header>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
