import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/card';

const verifyEmailSearchSchema = z.object({
  token: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailPage,
  validateSearch: verifyEmailSearchSchema,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Potwierdzamy adres email...');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Brakuje tokenu potwierdzajacego.');
      return;
    }

    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;
    let isActive = true;

    verifyEmail(token)
      .then(() => {
        if (!isActive) return;
        setStatus('success');
        setMessage('Email potwierdzony. Przekierowujemy do dashboardu...');
        setTimeout(() => {
          navigate({ to: '/dashboard' });
        }, 1200);
      })
      .catch((error: Error) => {
        if (!isActive) return;
        setStatus('error');
        setMessage(error.message);
      });

    return () => {
      isActive = false;
    };
  }, [navigate, token, verifyEmail]);

  const Icon = status === 'success' ? CheckCircle2 : status === 'error' ? XCircle : Loader2;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <Icon
            className={`h-12 w-12 ${
              status === 'success'
                ? 'text-emerald-600'
                : status === 'error'
                ? 'text-red-600'
                : 'animate-spin text-slate-700'
            }`}
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {status === 'success'
                ? 'Email potwierdzony'
                : status === 'error'
                ? 'Nie udalo sie potwierdzic emaila'
                : 'Potwierdzanie emaila'}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{message}</p>
          </div>

          {status === 'error' && (
            <Link
              to="/auth"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white no-underline transition hover:bg-slate-800"
            >
              Wroc do logowania
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
