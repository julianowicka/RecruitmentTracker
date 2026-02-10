// Helper functions dla tagów

export const PREDEFINED_TAGS = [
  'Remote',
  'Hybrid',
  'On-site',
  'Urgent',
  'High Priority',
  'Dream Job',
  'Backup',
  'Entry Level',
  'Senior',
  'Management',
  'Startup',
  'Corporation',
  'Interesting Tech',
];

export function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return [];
  try {
    return JSON.parse(tagsString);
  } catch {
    return [];
  }
}

export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}

// Kolory dla tagów
export const TAG_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-yellow-100 text-yellow-700',
  'bg-indigo-100 text-indigo-700',
  'bg-red-100 text-red-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-cyan-100 text-cyan-700',
];

export function getTagColor(tag: string, index: number): string {
  // Hash tag name do konsystentnego koloru
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
}


