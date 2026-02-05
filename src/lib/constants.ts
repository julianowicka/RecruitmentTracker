
export const APPLICATION_STATUSES = {
  APPLIED: 'applied',
  HR_INTERVIEW: 'hr_interview',
  TECH_INTERVIEW: 'tech_interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
} as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[keyof typeof APPLICATION_STATUSES];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Aplikowano',
  hr_interview: 'Rozmowa HR',
  tech_interview: 'Rozmowa Techniczna',
  offer: 'Oferta',
  rejected: 'Odrzucone',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: '#3b82f6',
  hr_interview: '#8b5cf6',
  tech_interview: '#f59e0b',
  offer: '#10b981',
  rejected: '#ef4444',
};

// Note Categories
export const NOTE_CATEGORIES = {
  GENERAL: 'general',
  TECHNICAL: 'technical',
  COMPANY: 'company',
  INTERVIEW_PREP: 'interview_prep',
  FOLLOWUP: 'followup',
} as const;

export type NoteCategory = typeof NOTE_CATEGORIES[keyof typeof NOTE_CATEGORIES];

export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  general: 'Ogólne',
  technical: 'Pytania Techniczne',
  company: 'O Firmie',
  interview_prep: 'Przygotowanie',
  followup: 'Follow-up',
};

export const NOTE_CATEGORY_ICONS: Record<NoteCategory, string> = {
  general: '📝',
  technical: '🔧',
  company: '🏢',
  interview_prep: '📚',
  followup: '📧',
};

export const NOTE_CATEGORY_DESCRIPTIONS: Record<NoteCategory, string> = {
  general: 'Ogólne notatki o aplikacji',
  technical: 'Pytania techniczne z rozmów',
  company: 'Informacje o firmie, kulturze, benefitach',
  interview_prep: 'Co przygotować, tematy do omówienia',
  followup: 'Akcje do wykonania po rozmowie',
};

