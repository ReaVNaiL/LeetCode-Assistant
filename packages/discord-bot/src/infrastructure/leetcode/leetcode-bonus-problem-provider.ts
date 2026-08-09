import type { BonusProblemProvider } from '../../application/ports/bonus-problem-provider';
import { BonusProblemUnavailableError } from '../../domain/errors';
import type { Problem } from '../../domain/problem';
import type { ProblemCatalog } from '../../application/ports/problem-catalog';
import { postLeetCodeGraphql } from './leetcode-http';

interface ActiveDailyData {
  activeDailyCodingChallengeQuestion: {
    link: string;
  } | null;
}

const ACTIVE_DAILY_QUERY = `
    query ActiveDailyChallenge {
        activeDailyCodingChallengeQuestion {
            link
        }
    }
`;

export class LeetCodeBonusProblemProvider implements BonusProblemProvider {
  constructor(private readonly catalog: ProblemCatalog) {}

  async getBonusProblem(): Promise<Problem> {
    try {
      const data = await postLeetCodeGraphql<ActiveDailyData>(ACTIVE_DAILY_QUERY);
      const link = data.activeDailyCodingChallengeQuestion?.link;
      if (!link) {
        throw new BonusProblemUnavailableError();
      }

      const url = new URL(link, 'https://leetcode.com').toString();
      return this.catalog.getProblem(url, 'LeetCode Daily');
    } catch (error) {
      if (error instanceof BonusProblemUnavailableError) {
        throw error;
      }
      throw new BonusProblemUnavailableError();
    }
  }
}
