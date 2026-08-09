import type { Client, Interaction } from 'discord.js';
import type { InteractionRouter } from './interaction-router';
import type { PresenceService } from './presence-service';
import { registerGuildCommands } from './register-commands';
import type { DiscordCommand } from './commands/command';

interface ClientEventDependencies {
  client: Client;
  router: InteractionRouter;
  presence: PresenceService;
  commands: ReadonlyMap<string, DiscordCommand>;
}

export function registerClientEvents(dependencies: ClientEventDependencies): void {
  const { client, router, presence, commands } = dependencies;

  client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag ?? 'unknown user'}.`);
    try {
      await registerGuildCommands(client, commands);
      await presence.update();
    } catch (error) {
      console.error('Discord ready initialization failed:', error);
    }
  });

  client.on('interactionCreate', (interaction: Interaction) => {
    void router.route(interaction);
  });
}
