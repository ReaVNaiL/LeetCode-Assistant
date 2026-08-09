import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { LeetCodeApplication } from '../../application/leetcode-application';
import { BonusProblemPresenter } from '../presenters/bonus-problem-presenter';
import type { DiscordCommand } from './command';

export class BonusCommand implements DiscordCommand {
  readonly name = 'get-bonus-problem';
  readonly data = new SlashCommandBuilder()
    .setName('get-bonus-problem')
    .setDescription("Get LeetCode's active daily challenge as a bonus problem.");

  constructor(private readonly app: LeetCodeApplication) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const problem = await this.app.getBonusProblem();
    await interaction.reply(BonusProblemPresenter.render(problem));
  }
}
