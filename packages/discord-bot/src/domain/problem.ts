export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Unknown';

export interface Problem {
  title: string;
  url: string;
  type: string;
  difficulty: ProblemDifficulty;
}

export interface DailyProblem extends Problem {
  id: number;
}

export interface DailyProgress {
  used: number;
  total: number;
}

export function normalizeDifficulty(value: string | undefined): ProblemDifficulty {
  if (value === 'Easy' || value === 'Medium' || value === 'Hard') {
    return value;
  }
  return 'Unknown';
}

export function getLeetCodeSlug(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const problemsIndex = parts.indexOf('problems');
    return problemsIndex >= 0 ? (parts[problemsIndex + 1] ?? null) : null;
  } catch {
    return null;
  }
}

export function titleFromLeetCodeUrl(url: string): string {
  const slug = getLeetCodeSlug(url);
  if (!slug) {
    return 'Unknown Problem';
  }

  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}
