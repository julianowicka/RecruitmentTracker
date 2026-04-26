import { Link } from '@tanstack/react-router';
import { BriefcaseBusiness, LogIn, LogOut, UserCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <nav className="flex items-center gap-2 md:gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-extrabold text-slate-900 no-underline transition hover:bg-slate-100"
          >
            <BriefcaseBusiness size={18} />
            <span className="hidden sm:inline">Recruitment Tracker</span>
            <span className="sm:hidden">Tracker</span>
          </Link>

          <Link
            to="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-100 hover:text-slate-900"
            activeProps={{ className: 'rounded-full px-4 py-2 text-sm font-semibold text-slate-900 bg-slate-200/70 no-underline' }}
          >
            Dashboard
          </Link>

          <Link
            to="/applications"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-100 hover:text-slate-900"
            activeProps={{ className: 'rounded-full px-4 py-2 text-sm font-semibold text-slate-900 bg-slate-200/70 no-underline' }}
          >
            Aplikacje
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {!isLoading && user ? (
            <>
              <span className="hidden items-center gap-2 text-sm font-medium text-slate-700 md:inline-flex">
                <UserCircle className="h-4 w-4" />
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Wyloguj
              </button>
            </>
          ) : (
            !isLoading && (
              <Link
                to="/auth"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white no-underline transition hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4" />
                Zaloguj
              </Link>
            )
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
