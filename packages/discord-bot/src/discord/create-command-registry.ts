import type { LeetCodeApplication } from '../application/leetcode-application';
import { BonusCommand } from './commands/bonus.command';
import type { DiscordCommand } from './commands/command';
import { DailyCommand } from './commands/daily.command';
import { HelpCommand } from './commands/help.command';
import { LeaderboardCommand } from './commands/leaderboard.command';
import { ProfileCommand } from './commands/profile.command';
import { SkipDailyCommand } from './commands/skip-daily.command';
import { SubmitCommand } from './commands/submit.command';
import type { PresenceService } from './presence-service';

export function createCommandRegistry(
  app: LeetCodeApplication,
  presence: PresenceService,
): ReadonlyMap<string, DiscordCommand> {
  const commands: DiscordCommand[] = [
    new DailyCommand(app, presence),
    new BonusCommand(app),
    new SubmitCommand(app),
    new ProfileCommand(app),
    new LeaderboardCommand(app),
    new SkipDailyCommand(app, presence),
    new HelpCommand(),
  ];

  return new Map(commands.map((command) => [command.name, command]));
}
