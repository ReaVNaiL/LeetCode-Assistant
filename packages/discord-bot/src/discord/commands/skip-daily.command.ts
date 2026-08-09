import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from 'discord.js';
import type { LeetCodeApplication } from '../../application/leetcode-application';
import { DailyProblemPresenter } from '../presenters/daily-problem-presenter';
import type { PresenceService } from '../presence-service';
import type { DiscordCommand } from './command';

export class SkipDailyCommand implements DiscordCommand {
  readonly name = 'skip-daily';
  readonly data = new SlashCommandBuilder()
    .setName('skip-daily')
    .setDescription("Skip today's curated problem and assign the next one.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

  constructor(
    private readonly app: LeetCodeApplication,
    private readonly presence: PresenceService,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: 'You need Manage Server permission to skip the daily problem.',
        ephemeral: true,
      });
      return;
    }

    const replacement = await this.app.skipDailyProblem();
    await interaction.reply(
      `Skipped the previous assignment.\n\n${DailyProblemPresenter.render(replacement)}`,
    );
    await this.presence.update().catch((error) => {
      console.error('Failed to update presence after skipping daily problem:', error);
    });
  }
}
