import type { Problem } from '../../domain/problem';

export interface ProblemCatalog {
  getProblem(url: string, type: string): Promise<Problem>;
}
