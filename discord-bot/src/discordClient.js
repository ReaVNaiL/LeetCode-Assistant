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
            GatewayIntentBits.GuildMessageReactions
        ]
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);

        // Set the bot status
        SetBotStatus(client, 'Being a menace to society...');

        // Set the bot commands for all guilds
        SetBotCommands(client);
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        if (commandName === 'get-my-daily') {
            await interaction.reply('Here is your daily Problem!');
        } else if (commandName === 'get-company-problems') {
            // Display the problem url
            const company = options.getString('company');
            await interaction.reply(`Here are the problems for ${company}!`);
        } else if (commandName === 'leaderboard') {
            await interaction.reply('Here is the leaderboard!');
        } else if (commandName === 'help') {
            await interaction.reply('Here is the help!');
        } else if (commandName === 'get-my-problem') {
            await interaction.reply('Here is your problem!');
        } else if (commandName === 'show-solution') {
            await interaction.reply('Here is the solution!');
        }
    });

    return client;
}

const discordClient = InitializeClient();

exports.discordClient = discordClient;
