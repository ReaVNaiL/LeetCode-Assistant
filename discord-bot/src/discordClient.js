/* eslint-disable no-console */
const { Client, GatewayIntentBits } = require('discord.js');
const { sendDailyProblem } = require('./helpers/dailyProblem');

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
        SetBotStatus(client, 'Nyan Cat :3');

        // Set the bot commands for all guilds
        SetBotCommands(client);
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName, options } = interaction;

        if (commandName === 'get-my-daily') {
            // TODO NOTE: This is a placeholder for now
            await sendDailyProblem(
                interaction,
                'Two Sum',
                'Easy',
                'https://leetcode.com/problems/two-sum/'
            );
        }

        if (commandName === 'get-company-problems') {
            // TODO TEST: Testing input validation
            const company = options.getString('company');
            await interaction.reply(`Here are the problems for ${company}!`);
        }

        if (commandName === 'leaderboard') {
            await interaction.reply('*NOT IMPLEMENTED*');
        } else if (commandName === 'help') {
            await interaction.reply('*NOT IMPLEMENTED*');
        } else if (commandName === 'get-my-problem') {
            await interaction.reply('*NOT IMPLEMENTED*');
        } else if (commandName === 'show-solution') {
            await interaction.reply('*NOT IMPLEMENTED*');
        }
    });

    return client;
}

const discordClient = InitializeClient();

exports.discordClient = discordClient;
