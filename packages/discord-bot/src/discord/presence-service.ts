import { ActivityType, type Client } from 'discord.js';
import type { LeetCodeApplication } from '../application/leetcode-application';

export class PresenceService {
  constructor(
    private readonly client: Client,
    private readonly app: LeetCodeApplication,
  ) {}

  async update(): Promise<void> {
    if (!this.client.user) {
      return;
    }

    const progress = await this.app.getDailyProgress();
    this.client.user.setPresence({
      activities: [
        {
          name: `Progress ${progress.used}/${progress.total}`,
          type: ActivityType.Playing,
        },
      ],
      status: 'online',
    });
  }
}
