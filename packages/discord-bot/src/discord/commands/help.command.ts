import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { DiscordCommand } from './command';

export class HelpCommand implements DiscordCommand {
  readonly name = 'help';
  readonly data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show supported LeetCode Assistant commands.');

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(
      [
        '**LeetCode Assistant commands**',
        "`/get-my-daily` — today's curated assignment",
        '`/get-bonus-problem` — LeetCode active daily challenge',
        '`/submit` — log one scoring submission for today',
        '`/profile` — your points and streaks',
        '`/leaderboard` — top server participants',
        "`/skip-daily` — Manage Server only; replace today's assignment",
      ].join('\n'),
    );
  }
}
