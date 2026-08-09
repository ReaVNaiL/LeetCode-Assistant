import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { LeetCodeApplication } from '../../application/leetcode-application';
import { LeaderboardPresenter } from '../presenters/leaderboard-presenter';
import type { DiscordCommand } from './command';

export class LeaderboardCommand implements DiscordCommand {
  readonly name = 'leaderboard';
  readonly data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the top LeetCode Assistant participants.');

  constructor(private readonly app: LeetCodeApplication) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const entries = await this.app.getLeaderboard(10);
    await interaction.reply(LeaderboardPresenter.render(entries));
  }
}
