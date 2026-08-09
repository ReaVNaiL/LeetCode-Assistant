export interface UserStats {
  discordId: string;
  username: string;
  totalPoints: number;
  currentStreak: number;
  highestStreak: number;
  lastSubmissionDate: string | null;
}

export interface UserProfile extends UserStats {
  problemsSolved: number;
}

export interface LeaderboardEntry {
  username: string;
  totalPoints: number;
  currentStreak: number;
}
