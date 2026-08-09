import type { Interaction } from 'discord.js';
import { BonusProblemUnavailableError, NoDailyProblemError } from '../domain/errors';
import type { DiscordCommand } from './commands/command';

function userFacingError(error: unknown): string {
  if (error instanceof NoDailyProblemError || error instanceof BonusProblemUnavailableError) {
    return error.message;
  }
  return 'There was an error while executing this command.';
}

export class InteractionRouter {
  constructor(private readonly commands: ReadonlyMap<string, DiscordCommand>) {}

  async route(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = this.commands.get(interaction.commandName);
    if (!command) {
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[COMMAND_ERROR] ${interaction.commandName}:`, error);
      const payload = { content: userFacingError(error), ephemeral: true } as const;

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload);
      } else {
        await interaction.reply(payload);
      }
    }
  }
}
