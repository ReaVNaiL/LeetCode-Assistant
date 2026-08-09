import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { LeetCodeApplication } from '../../application/leetcode-application';
import { ProfilePresenter } from '../presenters/profile-presenter';
import type { DiscordCommand } from './command';

export class ProfileCommand implements DiscordCommand {
  readonly name = 'profile';
  readonly data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your LeetCode points and streak profile.');

  constructor(private readonly app: LeetCodeApplication) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const profile = await this.app.getUserProfile(interaction.user.id);
    if (!profile) {
      await interaction.reply('You do not have a profile yet. Use `/submit` to create one.');
      return;
    }
    await interaction.reply(ProfilePresenter.render(profile));
  }
}
