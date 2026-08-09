import type { Problem } from '../../domain/problem';
import type { BonusProblemProvider } from '../ports/bonus-problem-provider';

export class GetBonusProblem {
  constructor(private readonly provider: BonusProblemProvider) {}

  execute(): Promise<Problem> {
    return this.provider.getBonusProblem();
  }
}
