import type { Client } from 'discord.js';
import cron from 'node-cron';
import type { LeetCodeApplication } from '../application/leetcode-application';
import type { AppConfig } from '../config/app-config';
import { DailyProblemPresenter } from '../discord/presenters/daily-problem-presenter';
import type { PresenceService } from '../discord/presence-service';

interface JobDependencies {
  client: Client;
  app: LeetCodeApplication;
  config: AppConfig;
  presence: PresenceService;
}

export function registerJobs(dependencies: JobDependencies): void {
  const { client, app, config, presence } = dependencies;

  cron.schedule(
    config.cronSchedule,
    async () => {
      try {
        const channel = await client.channels.fetch(config.channelId);
        if (!channel || !('send' in channel) || typeof channel.send !== 'function') {
          console.error(`Configured CHANNEL_ID ${config.channelId} is not sendable.`);
          return;
        }

        const problem = await app.getDailyProblem();
        await channel.send({
          content: DailyProblemPresenter.render(problem, true),
          allowedMentions: { parse: ['everyone'] },
        });
        await presence.update();
        console.log(`Daily problem posted for ${new Date().toISOString()}.`);
      } catch (error) {
        console.error('Daily problem job failed:', error);
      }
    },
    { timezone: config.timeZone },
  );

  cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        const resetCount = await app.resetMissedStreaks();
        console.log(`Reset ${resetCount} missed streak(s).`);
      } catch (error) {
        console.error('Missed-streak reset job failed:', error);
      }
    },
    { timezone: config.timeZone },
  );
}
