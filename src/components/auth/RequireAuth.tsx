import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../ui/card';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="h-36 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <LockKeyhole className="h-10 w-10 text-slate-700" />
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Zaloguj sie</h1>
              <p className="mt-2 text-sm text-slate-600">
                Ten widok jest dostepny po zalogowaniu lub utworzeniu konta.
              </p>
            </div>
            <Link
              to="/auth"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white no-underline transition hover:bg-slate-800"
            >
              Przejdz do logowania
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
