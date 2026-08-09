import type { Problem } from '../../domain/problem';

export interface BonusProblemProvider {
  getBonusProblem(): Promise<Problem>;
}
