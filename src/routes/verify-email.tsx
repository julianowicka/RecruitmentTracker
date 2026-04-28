import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/card';

const verifyEmailSearchSchema = z.object({
  token: z.string().optional().catch(undefined),
  status: z.enum(['success', 'error']).optional().catch(undefined),
  message: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailPage,
  validateSearch: verifyEmailSearchSchema,
});

function VerifyEmailPage() {
  const { token, status: statusFromUrl, message: messageFromUrl } = Route.useSearch();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Potwierdzamy adres email...');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (statusFromUrl) {
      setStatus(statusFromUrl);
      setMessage(
        messageFromUrl ||
          (statusFromUrl === 'success'
            ? 'Email potwierdzony. Mozesz sie teraz zalogowac.'
            : 'Potwierdzenie emaila nie powiodlo sie')
      );
      return;
    }

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
    const timeout = window.setTimeout(() => {
      if (!isActive) return;
      setStatus('error');
      setMessage('Potwierdzenie trwa zbyt dlugo. Odswiez strone albo sprobuj zalogowac sie za chwile.');
    }, 15000);

    verifyEmail(token)
      .then(() => {
        if (!isActive) return;
        window.clearTimeout(timeout);
        setStatus('success');
        setMessage('Email potwierdzony. Przekierowujemy do dashboardu...');
        setTimeout(() => {
          navigate({ to: '/dashboard' });
        }, 1200);
      })
      .catch((error: Error) => {
        if (!isActive) return;
        window.clearTimeout(timeout);
        setStatus('error');
        setMessage(error.message);
      });

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [messageFromUrl, navigate, statusFromUrl, token, verifyEmail]);

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

          {status !== 'loading' && (
            <Link
              to="/auth"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white no-underline transition hover:bg-slate-800"
            >
              Przejdz do logowania
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
