import 'dotenv/config';
import { LeetCodeApplication } from './application/leetcode-application';
import { GetBonusProblem } from './application/use-cases/get-bonus-problem';
import { GetDailyProblem } from './application/use-cases/get-daily-problem';
import { GetDailyProgress } from './application/use-cases/get-daily-progress';
import { GetLeaderboard } from './application/use-cases/get-leaderboard';
import { GetUserProfile } from './application/use-cases/get-user-profile';
import { ResetMissedStreaks } from './application/use-cases/reset-missed-streaks';
import { SkipDailyProblem } from './application/use-cases/skip-daily-problem';
import { SubmitSolution } from './application/use-cases/submit-solution';
import { loadConfig } from './config/app-config';
import { createCommandRegistry } from './discord/create-command-registry';
import { createDiscordClient } from './discord/create-discord-client';
import { InteractionRouter } from './discord/interaction-router';
import { PresenceService } from './discord/presence-service';
import { registerClientEvents } from './discord/register-client-events';
import { migrateDatabase } from './infrastructure/database/migrations';
import { SqliteDailyProblemRepository } from './infrastructure/database/sqlite-daily-problem-repository';
import { SqliteDatabase } from './infrastructure/database/sqlite-database';
import { SqliteProgressRepository } from './infrastructure/database/sqlite-progress-repository';
import { LeetCodeBonusProblemProvider } from './infrastructure/leetcode/leetcode-bonus-problem-provider';
import { LeetCodeProblemCatalog } from './infrastructure/leetcode/leetcode-problem-catalog';
import { loadDailyProblemSeed } from './infrastructure/seed/load-daily-problem-seed';
import { SystemClock } from './infrastructure/time/system-clock';
import { registerJobs } from './jobs/register-jobs';

async function main(): Promise<void> {
  const config = loadConfig(process.env);
  const seed = loadDailyProblemSeed(config.dailyListPath);
  const database = SqliteDatabase.open(config.databasePath);

  try {
    migrateDatabase(database, seed);

    const clock = new SystemClock(config.timeZone);
    const dailyProblems = new SqliteDailyProblemRepository(database);
    const progress = new SqliteProgressRepository(database);
    const catalog = new LeetCodeProblemCatalog();
    const bonusProvider = new LeetCodeBonusProblemProvider(catalog);

    const app = new LeetCodeApplication(
      new GetDailyProblem(dailyProblems, catalog, clock),
      new GetBonusProblem(bonusProvider),
      new SkipDailyProblem(dailyProblems, catalog, clock),
      new SubmitSolution(dailyProblems, catalog, progress, clock, config.pointsPerSubmission),
      new GetLeaderboard(progress),
      new GetUserProfile(progress),
      new GetDailyProgress(dailyProblems),
      new ResetMissedStreaks(progress, clock),
    );

    const client = createDiscordClient();
    const presence = new PresenceService(client, app);
    const commands = createCommandRegistry(app, presence);
    const router = new InteractionRouter(commands);

    registerClientEvents({ client, router, presence, commands });
    registerJobs({ client, app, config, presence });

    let shuttingDown = false;
    const shutdown = async (signal: string): Promise<void> => {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;
      console.log(`Received ${signal}; shutting down.`);
      client.destroy();
      database.close();
    };

    process.once('SIGINT', () => {
      void shutdown('SIGINT').finally(() => process.exit(0));
    });
    process.once('SIGTERM', () => {
      void shutdown('SIGTERM').finally(() => process.exit(0));
    });

    await client.login(config.discordToken);
  } catch (error) {
    try {
      database.close();
    } catch (closeError) {
      console.error('Failed to close database after startup error:', closeError);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
