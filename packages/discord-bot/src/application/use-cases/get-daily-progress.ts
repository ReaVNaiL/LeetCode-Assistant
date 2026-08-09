import type { DailyProgress } from '../../domain/problem';
import type { DailyProblemRepository } from '../ports/daily-problem-repository';

export class GetDailyProgress {
  constructor(private readonly dailyProblems: DailyProblemRepository) {}

  execute(): Promise<DailyProgress> {
    return this.dailyProblems.getProgress();
  }
}
