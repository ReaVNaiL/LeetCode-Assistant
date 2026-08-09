import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { LeetCodeApplication } from '../../application/leetcode-application';
import { DailyProblemPresenter } from '../presenters/daily-problem-presenter';
import type { PresenceService } from '../presence-service';
import type { DiscordCommand } from './command';

export class DailyCommand implements DiscordCommand {
  readonly name = 'get-my-daily';
  readonly data = new SlashCommandBuilder()
    .setName('get-my-daily')
    .setDescription("Get today's curated LeetCode problem.");

  constructor(
    private readonly app: LeetCodeApplication,
    private readonly presence: PresenceService,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const problem = await this.app.getDailyProblem();
    await interaction.reply(DailyProblemPresenter.render(problem));
    await this.presence.update().catch((error) => {
      console.error('Failed to update presence after daily assignment:', error);
    });
  }
}
