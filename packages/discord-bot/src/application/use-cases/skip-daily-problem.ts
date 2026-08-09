import { NoDailyProblemError } from '../../domain/errors';
import type { DailyProblem } from '../../domain/problem';
import type { Clock } from '../ports/clock';
import type { DailyProblemRepository } from '../ports/daily-problem-repository';
import type { ProblemCatalog } from '../ports/problem-catalog';

export class SkipDailyProblem {
  constructor(
    private readonly dailyProblems: DailyProblemRepository,
    private readonly catalog: ProblemCatalog,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<DailyProblem> {
    const replacement = await this.dailyProblems.skipForDate(this.clock.today());
    if (!replacement) {
      throw new NoDailyProblemError();
    }

    const metadata = await this.catalog.getProblem(replacement.url, replacement.type);
    return { id: replacement.id, ...metadata };
  }
}
