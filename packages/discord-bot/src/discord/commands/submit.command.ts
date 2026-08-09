import {
  SlashCommandBuilder,
  type SlashCommandStringOption,
  type ChatInputCommandInteraction,
} from 'discord.js';
import type { LeetCodeApplication } from '../../application/leetcode-application';
import type { DiscordCommand } from './command';

export class SubmitCommand implements DiscordCommand {
  readonly name = 'submit';
  readonly data = new SlashCommandBuilder()
    .setName('submit')
    .setDescription("Log your solution for today's daily problem.")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName('solution')
        .setDescription('Paste a code snippet or LeetCode submission link.')
        .setRequired(true)
        .setMaxLength(4000),
    );

  constructor(private readonly app: LeetCodeApplication) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const solution = interaction.options.getString('solution', true);
    const result = await this.app.submitSolution({
      discordId: interaction.user.id,
      username: interaction.user.username,
      solution,
    });

    if (result.duplicate) {
      await interaction.reply({
        content: `You already logged a submission today. Current streak: 🔥 ${result.currentStreak}.`,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply(
      [
        `🎉 **Nice work, ${interaction.user.username}!**`,
        `You earned **${result.pointsAwarded} points**.`,
        '',
        `🔥 **Current Streak:** ${result.currentStreak} days`,
        `⭐ **Total Points:** ${result.totalPoints}`,
      ].join('\n'),
    );
  }
}
