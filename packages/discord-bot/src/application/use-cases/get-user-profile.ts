import type { UserProfile } from '../../domain/user';
import type { ProgressRepository } from '../ports/progress-repository';

export class GetUserProfile {
  constructor(private readonly progress: ProgressRepository) {}

  execute(discordId: string): Promise<UserProfile | null> {
    return this.progress.getProfile(discordId);
  }
}
