import type { Problem } from '../../domain/problem';

export class BonusProblemPresenter {
  static render(problem: Problem): string {
    return [
      '💣 **Bonus challenge**',
      '',
      `👀 **${problem.title}**`,
      `🔹 **Problem Type:** ${problem.type}`,
      `🔹 **Difficulty:** ${problem.difficulty}`,
      `🔹 **Problem Link:** ${problem.url}`,
    ].join('\n');
  }
}
