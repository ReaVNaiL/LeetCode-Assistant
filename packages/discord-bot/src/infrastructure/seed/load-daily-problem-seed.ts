import fs from 'node:fs';
import type { DailyProblemSeed } from '../database/migrations';

export function loadDailyProblemSeed(filePath: string): DailyProblemSeed[] {
  if (!fs.existsSync(filePath)) {
    console.warn(
      `Curated daily list not found at ${filePath}. Existing DB data can still be used.`,
    );
    return [];
  }

  const raw: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('daily-list.json must be an object mapping LeetCode URLs to problem types.');
  }

  return Object.entries(raw).map(([url, type]) => {
    if (typeof type !== 'string') {
      throw new Error(`Invalid daily-list.json type for ${url}. Expected a string.`);
    }
    return { url, type };
  });
}
