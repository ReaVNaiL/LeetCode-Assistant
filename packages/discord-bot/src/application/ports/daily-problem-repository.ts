import type { DailyProgress } from '../../domain/problem';

export interface DailyProblemRecord {
  id: number;
  url: string;
  type: string;
}

export interface DailyProblemRepository {
  getOrAssignForDate(date: string): Promise<DailyProblemRecord | null>;
  skipForDate(date: string): Promise<DailyProblemRecord | null>;
  getProgress(): Promise<DailyProgress>;
}
