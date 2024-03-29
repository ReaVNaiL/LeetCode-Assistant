/* eslint-disable no-console */
const { Client, GatewayIntentBits } = require('discord.js');
const dailyHandler = require('./helpers/dailyProblem');
const bonusHandler = require('./helpers/bonusProblem');
const statusHandler = require('./settings/botStatus');

const { getCurrentFormattedDate } = require('./helpers/timeHandler');
const { SetBotCommands } = require('./settings/botCommands');

/* GLOBALS */
const CHANNEL_ID = '1084131482123112559'; // #daily-leetcode channel

/**
 * Handles all incoming interactions from the Discord API.
 * @param {Interaction} interaction - The interaction object.
 * - This object contains all the information about the interaction, be it a command,
 *  a button, a select menu, etc.
 * @returns
 */
async function initializeBotInteractions(client, interaction) {
    console.log('\n----------------------------------------');
    console.log(`Request received from ${interaction.user.tag}!`);
    console.log(
        'Command name: ',
        interaction.commandName,
        '\nOptions: ',
        interaction.options ? interaction.options.data : 'No options'
    );

    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'get-my-daily') {
        const daily = await dailyHandler.requestProblemInfo(client);
        await dailyHandler.dailyProblemStringBuilder(
            interaction,
            daily.title,
            daily.type,
            daily.difficulty,
            daily.link
        );
    }

    if (commandName === 'skip-daily') {
        const passcode = options.getString('passcode');
        if (passcode === '4444') {
            // const dailyResponse = await dailyHandler.requestSkipDailyProblem();
            // await interaction.reply(dailyResponse.data);
            await interaction.reply(
                'You are not authorized to use this command!'
            );
        } else {
            await interaction.reply('Incorrect passcode!');
        }
    }

    if (commandName === 'get-company-problems') {
        // TODO TEST: Testing input validation
        const company = options.getString('company');
        await interaction.reply(`Here are the problems for ${company}!`);
    }

    if (commandName === 'get-bonus-problem') {
        const bonusProblem = await bonusHandler.requestBonusProblem();
        await bonusHandler.bonusProblemStringBuilder(
            interaction,
            bonusProblem.title,
            bonusProblem.type,
            bonusProblem.difficulty,
            bonusProblem.link,
            true
        );
    }

    if (commandName === 'leaderboard') {
        await interaction.reply('*NOT IMPLEMENTED*');
    } else if (commandName === 'help') {
        await interaction.reply('*NOT IMPLEMENTED*');
    } else if (commandName === 'show-solution') {
        await interaction.reply('*NOT IMPLEMENTED*');
    }

    console.log('Request processed!\n');
}

/**
 * Initializes the Discord client.
 * This function is called from index.js file, and is exported to be used in other files.
 * - Sets the bot status, and bot commands.
 * - Initializes the bot interactions.
 * @returns {Client} - The Discord client object.
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Client|Discord.js Client}
 */
function InitializeClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions
        ]
    });

    client.on('ready', async () => {
        console.log(
            `[${getCurrentFormattedDate()}] Logged in as ${client.user.tag}!`
        );

        // Set the bot status
        await statusHandler.updateStatusCount(client);

        // Set the bot commands for all guilds
        SetBotCommands(client);
    });

    // Initialize the bot interactions
    client.on('interactionCreate', async (interaction) => {
        try {
            await initializeBotInteractions(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    });

    // Update daily message every 24 hours
    dailyHandler.sendDailyProblemMessage(client, CHANNEL_ID);

    return client;
}

const discordClient = InitializeClient();

exports.discordClient = discordClient;
