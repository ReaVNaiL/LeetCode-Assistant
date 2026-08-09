import type { ApplicationCommandDataResolvable, ChatInputCommandInteraction } from 'discord.js';

export interface DiscordCommand {
  readonly name: string;
  readonly data: ApplicationCommandDataResolvable;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
