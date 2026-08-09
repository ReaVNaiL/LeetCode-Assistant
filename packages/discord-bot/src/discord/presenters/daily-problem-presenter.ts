import type { DailyProblem } from '../../domain/problem';

export class DailyProblemPresenter {
  static render(problem: DailyProblem, mentionHere = false): string {
    const mention = mentionHere ? '@here ' : '';
    return [
      `${mention}Here is the daily problem for today!`,
      '',
      `👀 **${problem.title}**`,
      `🔹 **Problem Type:** ${problem.type}`,
      `🔹 **Difficulty:** ${problem.difficulty}`,
      `🔹 **Problem Link:** ${problem.url}`,
      '',
      '> 💡 **Interview discussion prompts**',
      '> • What are the optimal time and space complexities?',
      '> • Which edge cases would you test in production?',
      '> • If this were an API endpoint, how would you handle large inputs or rate limits?',
    ].join('\n');
  }
}
