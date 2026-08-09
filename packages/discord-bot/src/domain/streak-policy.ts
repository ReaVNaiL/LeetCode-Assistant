import { daysBetween } from './local-date';
import type { UserStats } from './user';

export interface SubmissionProjection {
  duplicate: boolean;
  pointsAwarded: number;
  user: UserStats;
}

interface SubmissionInput {
  currentUser: UserStats | null;
  discordId: string;
  username: string;
  today: string;
  points: number;
}

export function projectSubmission(input: SubmissionInput): SubmissionProjection {
  const { currentUser, discordId, username, today, points } = input;

  if (!currentUser) {
    return {
      duplicate: false,
      pointsAwarded: points,
      user: {
        discordId,
        username,
        totalPoints: points,
        currentStreak: 1,
        highestStreak: 1,
        lastSubmissionDate: today,
      },
    };
  }

  if (currentUser.lastSubmissionDate === today) {
    return {
      duplicate: true,
      pointsAwarded: 0,
      user: { ...currentUser, username },
    };
  }

  const consecutive =
    currentUser.lastSubmissionDate !== null &&
    daysBetween(currentUser.lastSubmissionDate, today) === 1;
  const currentStreak = consecutive ? currentUser.currentStreak + 1 : 1;

  return {
    duplicate: false,
    pointsAwarded: points,
    user: {
      ...currentUser,
      username,
      totalPoints: currentUser.totalPoints + points,
      currentStreak,
      highestStreak: Math.max(currentUser.highestStreak, currentStreak),
      lastSubmissionDate: today,
    },
  };
}
