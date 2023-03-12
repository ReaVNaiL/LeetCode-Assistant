/* eslint-disable no-console */
const { Client, GatewayIntentBits } = require('discord.js');

const { SetBotCommands } = require('./settings/botCommands');
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

        // Set the bot status
        SetBotStatus(client, 'Being a menace to society...');

        // Set the bot commands for all guilds
        SetBotCommands(client);
    });

    return client;
}

const discordClient = InitializeClient();

exports.discordClient = discordClient;
