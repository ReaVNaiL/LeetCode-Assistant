import type { ProblemCatalog } from '../../application/ports/problem-catalog';
import {
  getLeetCodeSlug,
  normalizeDifficulty,
  titleFromLeetCodeUrl,
  type Problem,
} from '../../domain/problem';
import { postLeetCodeGraphql } from './leetcode-http';

interface QuestionData {
  question: {
    title: string;
    difficulty: string;
  } | null;
}

const QUESTION_QUERY = `
    query QuestionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            title
            difficulty
        }
    }
`;

export class LeetCodeProblemCatalog implements ProblemCatalog {
  private readonly cache = new Map<string, Problem>();

  async getProblem(url: string, type: string): Promise<Problem> {
    const slug = getLeetCodeSlug(url);
    const cacheKey = `${url}|${type}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    if (slug) {
      try {
        const data = await postLeetCodeGraphql<QuestionData>(QUESTION_QUERY, {
          titleSlug: slug,
        });

        if (data.question) {
          const problem: Problem = {
            title: data.question.title,
            url,
            type,
            difficulty: normalizeDifficulty(data.question.difficulty),
          };
          this.cache.set(cacheKey, problem);
          return problem;
        }
      } catch (error) {
        console.warn(`LeetCode metadata lookup failed for ${slug}:`, error);
      }
    }

    const fallback: Problem = {
      title: titleFromLeetCodeUrl(url),
      url,
      type,
      difficulty: 'Unknown',
    };
    this.cache.set(cacheKey, fallback);
    return fallback;
  }
}
