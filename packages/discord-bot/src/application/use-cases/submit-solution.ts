import { NoDailyProblemError } from '../../domain/errors';
import { projectSubmission } from '../../domain/streak-policy';
import type { SubmissionResult } from '../../domain/submission';
import type { Clock } from '../ports/clock';
import type { DailyProblemRepository } from '../ports/daily-problem-repository';
import type { ProblemCatalog } from '../ports/problem-catalog';
import type { ProgressRepository } from '../ports/progress-repository';

export interface SubmitSolutionCommand {
  discordId: string;
  username: string;
  solution: string;
}

export class SubmitSolution {
  constructor(
    private readonly dailyProblems: DailyProblemRepository,
    private readonly catalog: ProblemCatalog,
    private readonly progress: ProgressRepository,
    private readonly clock: Clock,
    private readonly pointsPerSubmission: number,
  ) {}

  async execute(command: SubmitSolutionCommand): Promise<SubmissionResult> {
    const today = this.clock.today();
    const dailyRecord = await this.dailyProblems.getOrAssignForDate(today);
    if (!dailyRecord) {
      throw new NoDailyProblemError();
    }

    const currentUser = await this.progress.findUser(command.discordId);
    const projection = projectSubmission({
      currentUser,
      discordId: command.discordId,
      username: command.username,
      today,
      points: this.pointsPerSubmission,
    });

    if (projection.duplicate) {
      return {
        pointsAwarded: 0,
        currentStreak: projection.user.currentStreak,
        totalPoints: projection.user.totalPoints,
        duplicate: true,
      };
    }

    const problem = await this.catalog.getProblem(dailyRecord.url, dailyRecord.type);
    const commitResult = await this.progress.commitSubmission({
      user: projection.user,
      dailyProblemId: dailyRecord.id,
      problemName: problem.title,
      codeSnippet: command.solution,
      submissionDate: today,
      createdAt: this.clock.now().toISOString(),
      pointsAwarded: projection.pointsAwarded,
    });

    if (commitResult === 'duplicate') {
      const latest = await this.progress.findUser(command.discordId);
      return {
        pointsAwarded: 0,
        currentStreak: latest?.currentStreak ?? projection.user.currentStreak,
        totalPoints: latest?.totalPoints ?? projection.user.totalPoints,
        duplicate: true,
      };
    }

    return {
      pointsAwarded: projection.pointsAwarded,
      currentStreak: projection.user.currentStreak,
      totalPoints: projection.user.totalPoints,
      duplicate: false,
    };
  }
}
