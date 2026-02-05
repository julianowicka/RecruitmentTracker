// Note categories
export const NOTE_CATEGORIES = {
  GENERAL: 'general',
  COMPANY_RESEARCH: 'company_research',
  TECHNICAL_QUESTIONS: 'technical_questions',
  INTERVIEW_PREP: 'interview_prep',
  FOLLOW_UPS: 'follow_ups',
  DECISION_FACTORS: 'decision_factors',
} as const;

export type NoteCategory = typeof NOTE_CATEGORIES[keyof typeof NOTE_CATEGORIES];

// Category labels
export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  [NOTE_CATEGORIES.GENERAL]: 'Ogólne',
  [NOTE_CATEGORIES.COMPANY_RESEARCH]: 'Research firmy',
  [NOTE_CATEGORIES.TECHNICAL_QUESTIONS]: 'Pytania techniczne',
  [NOTE_CATEGORIES.INTERVIEW_PREP]: 'Przygotowanie',
  [NOTE_CATEGORIES.FOLLOW_UPS]: 'Follow-ups',
  [NOTE_CATEGORIES.DECISION_FACTORS]: 'Decyzja',
};

// Category icons (emoji)
export const NOTE_CATEGORY_ICONS: Record<NoteCategory, string> = {
  [NOTE_CATEGORIES.GENERAL]: '📝',
  [NOTE_CATEGORIES.COMPANY_RESEARCH]: '💼',
  [NOTE_CATEGORIES.TECHNICAL_QUESTIONS]: '🔧',
  [NOTE_CATEGORIES.INTERVIEW_PREP]: '📋',
  [NOTE_CATEGORIES.FOLLOW_UPS]: '💡',
  [NOTE_CATEGORIES.DECISION_FACTORS]: '🎯',
};

// Category descriptions
export const NOTE_CATEGORY_DESCRIPTIONS: Record<NoteCategory, string> = {
  [NOTE_CATEGORIES.GENERAL]: 'Ogólne notatki',
  [NOTE_CATEGORIES.COMPANY_RESEARCH]: 'Kultura, benefity, tech stack firmy',
  [NOTE_CATEGORIES.TECHNICAL_QUESTIONS]: 'Pytania które dostałeś na rozmowie',
  [NOTE_CATEGORIES.INTERVIEW_PREP]: 'Co przygotować przed rozmową',
  [NOTE_CATEGORIES.FOLLOW_UPS]: 'Co zrobić po rozmowie',
  [NOTE_CATEGORIES.DECISION_FACTORS]: 'Plusy i minusy, faktory decyzyjne',
};

