import { NoDailyProblemError } from '../../domain/errors';
import type { DailyProblem } from '../../domain/problem';
import type { Clock } from '../ports/clock';
import type { DailyProblemRepository } from '../ports/daily-problem-repository';
import type { ProblemCatalog } from '../ports/problem-catalog';

export class GetDailyProblem {
  constructor(
    private readonly dailyProblems: DailyProblemRepository,
    private readonly catalog: ProblemCatalog,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<DailyProblem> {
    const record = await this.dailyProblems.getOrAssignForDate(this.clock.today());
    if (!record) {
      throw new NoDailyProblemError();
    }

    const metadata = await this.catalog.getProblem(record.url, record.type);
    return { id: record.id, ...metadata };
  }
}
