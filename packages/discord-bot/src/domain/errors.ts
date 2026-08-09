export class NoDailyProblemError extends Error {
  constructor() {
    super('No unused daily problems remain in the curated sequence.');
    this.name = 'NoDailyProblemError';
  }
}

export class BonusProblemUnavailableError extends Error {
  constructor(message = 'The bonus problem is temporarily unavailable.') {
    super(message);
    this.name = 'BonusProblemUnavailableError';
  }
}
