import { createFileRoute, Link } from '@tanstack/react-router';
import {
  BellDot,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  ChevronRight,
  Filter,
  NotebookPen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Route = createFileRoute('/')({
  component: Home,
});

const features: { icon: LucideIcon; title: string; description: string; tone: string }[] = [
  {
    icon: BriefcaseBusiness,
    title: 'Aplikacje',
    description: 'Dodawaj oferty, edytuj szczegoly i trzymaj pelna historie procesu.',
    tone: 'from-cyan-500/20 to-cyan-500/5',
  },
  {
    icon: ChartColumnIncreasing,
    title: 'Statusy',
    description: 'Sledz etapy rekrutacji i szybko wychwytuj to, co wymaga reakcji.',
    tone: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    icon: NotebookPen,
    title: 'Notatki',
    description: 'Zapisuj informacje po rozmowach i planuj kolejne kroki.',
    tone: 'from-amber-500/20 to-amber-500/5',
  },
  {
    icon: Filter,
    title: 'Filtrowanie',
    description: 'Przeszukuj i segmentuj aplikacje, by szybciej podejmowac decyzje.',
    tone: 'from-fuchsia-500/20 to-fuchsia-500/5',
  },
];

function Home() {
  const { user } = useAuth();
  const primaryTarget = user ? '/applications' : '/auth';
  const secondaryTarget = user ? '/dashboard' : '/auth';

  return (
    <section className="relative overflow-hidden px-6 py-12 md:px-10 md:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute right-0 top-28 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sky-300/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="animate-fade-up rounded-3xl border border-white/50 bg-white/75 p-8 shadow-[0_20px_90px_-40px_rgba(8,47,73,0.45)] backdrop-blur-md md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-sm font-semibold text-cyan-900">
              <BellDot size={16} />
              Twoj panel rekrutacji
            </span>
            <h1 className="text-balance text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Recruitment Tracker
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-slate-600 md:text-xl">
              Zarzadzaj aplikacjami o prace, notatkami i statusem kazdej rozmowy w jednym, czytelnym widoku.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to={primaryTarget}
                search={user ? undefined : { mode: 'register' }}
                className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white no-underline shadow-lg shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {user ? 'Przejdz do aplikacji' : 'Załóż konto'}
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to={secondaryTarget}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 no-underline transition duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
              >
                {user ? 'Otworz dashboard' : 'Zaloguj sie'}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delayMs={index * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  tone,
  delayMs,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
  delayMs: number;
}) {
  return (
    <article
      className="animate-fade-up group rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-35px_rgba(2,6,23,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 ${tone}`}>
        <Icon className="text-slate-800" size={22} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </article>
  );
}
