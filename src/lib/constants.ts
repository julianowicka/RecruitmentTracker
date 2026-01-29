/**
 * Dostępne statusy aplikacji o pracę
 */
export const APPLICATION_STATUSES = {
  APPLIED: 'applied',
  HR_INTERVIEW: 'hr_interview',
  TECH_INTERVIEW: 'tech_interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
} as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[keyof typeof APPLICATION_STATUSES];

/**
 * Etykiety dla statusów (do wyświetlania)
 */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Aplikowano',
  hr_interview: 'Rozmowa HR',
  tech_interview: 'Rozmowa Techniczna',
  offer: 'Oferta',
  rejected: 'Odrzucone',
};

/**
 * Kolory dla statusów (do wyświetlania)
 */
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: '#3b82f6',
  hr_interview: '#8b5cf6',
  tech_interview: '#f59e0b',
  offer: '#10b981',
  rejected: '#ef4444',
};

