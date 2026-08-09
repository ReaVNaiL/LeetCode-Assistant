import type { LeaderboardEntry } from '../../domain/user';

const MEDALS = ['🥇', '🥈', '🥉'];

export class LeaderboardPresenter {
  static render(entries: readonly LeaderboardEntry[]): string {
    if (entries.length === 0) {
      return 'The leaderboard is empty. Be the first to use `/submit`.';
    }

    const rows = entries.map((entry, index) => {
      const medal = MEDALS[index] ?? '🏅';
      return `${medal} **${entry.username}** — ${entry.totalPoints} pts (🔥 ${entry.currentStreak})`;
    });

    return ['**🏆 LeetCode Assistant Leaderboard 🏆**', '', ...rows].join('\n');
  }
}
