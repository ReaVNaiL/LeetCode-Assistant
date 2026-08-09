import type { Client, Guild } from 'discord.js';
import type { DiscordCommand } from './commands/command';

export async function registerGuildCommands(
  client: Client,
  commands: ReadonlyMap<string, DiscordCommand>,
): Promise<void> {
  const payload = [...commands.values()].map((command) => command.data);
  await Promise.all(client.guilds.cache.map((guild: Guild) => guild.commands.set(payload)));
  console.log(`Registered ${payload.length} commands in ${client.guilds.cache.size} guild(s).`);
}
