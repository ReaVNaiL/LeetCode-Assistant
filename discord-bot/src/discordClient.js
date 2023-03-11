/* eslint-disable no-console */
const { Client, GatewayIntentBits } = require('discord.js');
const commands = require('./data/commands.json');
const { SetBotStatus } = require('./settings/botStatus');

function InitializeClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
        ],
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);

        SetBotStatus(client, 'Being a menace to society...');

        const lcCommands = commands.map((command) => ({
            name: command.name.toLowerCase(),
            description: command.description,
            options: command.options,
        }));

        client.guilds.cache.forEach(async (guild) => {
            await guild.commands.set(lcCommands);
        });
    });

    return client;
}

const discordClient = InitializeClient();

exports.discordClient = discordClient;
