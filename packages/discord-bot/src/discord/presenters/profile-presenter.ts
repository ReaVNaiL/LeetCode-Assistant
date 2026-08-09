import type { UserProfile } from '../../domain/user';

export class ProfilePresenter {
  static render(profile: UserProfile): string {
    return [
      `**👤 Profile for ${profile.username}**`,
      `⭐ **Total Points:** ${profile.totalPoints}`,
      `🔥 **Current Streak:** ${profile.currentStreak} days`,
      `🏆 **Highest Streak:** ${profile.highestStreak} days`,
      `📝 **Problems Solved:** ${profile.problemsSolved}`,
    ].join('\n');
  }
}
