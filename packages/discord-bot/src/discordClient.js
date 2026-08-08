/* eslint-disable no-console */
const { Client, GatewayIntentBits } = require('discord.js');
const dailyHandler = require('./helpers/dailyProblem');
const bonusHandler = require('./helpers/bonusProblem');
const statusHandler = require('./settings/botStatus');
const config = require('./config');
const CoreService = require('./services/core-service');

const { getCurrentFormattedDate } = require('./helpers/timeHandler');
const { SetBotCommands } = require('./settings/botCommands');

/* GLOBALS */
const CHANNEL_ID = config.channelId; // #daily-leetcode channel

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
        return;
    }

    if (commandName === 'skip-daily') {
        const passcode = options.getString('passcode');
        if (passcode === config.adminPasscode) {
            // const dailyResponse = await dailyHandler.requestSkipDailyProblem();
            // await interaction.reply(dailyResponse.data);
            await interaction.reply(
                'You are not authorized to use this command!'
            );
        } else {
            await interaction.reply('Incorrect passcode!');
        }
        return;
    }

    if (commandName === 'get-company-problems') {
        const company = options.getString('company');
        await interaction.reply(`Here are the problems for ${company}!`);
        return;
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
        return;
    }

    if (commandName === 'leaderboard') {
        try {
            const topUsers = await CoreService.getLeaderboard();
            if (topUsers.length === 0) {
                await interaction.reply('The leaderboard is currently empty. Be the first to `/submit` a solution!');
                return;
            }
            let boardStr = '**🏆 Server LeetCode Leaderboard 🏆**\n\n';
            topUsers.forEach((u, i) => {
                let medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
                boardStr += `${medal} **${u.username}** — ${u.total_points} pts (Streak: 🔥 ${u.current_streak})\n`;
            });
            await interaction.reply(boardStr);
        } catch (err) {
            console.error(err);
            await interaction.reply('Error fetching leaderboard.');
        }
        return;
    }

    if (commandName === 'profile') {
        try {
            const user = await CoreService.getUserProfile(interaction.user.id);
            if (!user) {
                await interaction.reply('You don\'t have a profile yet! Use `/submit` to log your first problem.');
                return;
            }
            const profileStr = `
**👤 Profile for ${user.username}**
**:star: Total Points:** ${user.total_points}
**🔥 Current Streak:** ${user.current_streak} days
**🏆 Highest Streak:** ${user.highest_streak} days
**📝 Problems Solved:** ${user.problems_solved}
            `;
            await interaction.reply(profileStr);
        } catch (err) {
            console.error(err);
            await interaction.reply('Error fetching profile.');
        }
        return;
    }

    if (commandName === 'submit') {
        try {
            const solution = options.getString('solution');
            
            const result = await CoreService.submitSolution(
                interaction.user.id,
                interaction.user.username,
                solution
            );

            if (result.isDuplicate) {
                await interaction.reply(`You've already submitted a solution today! Keep up the great work. (Streak: 🔥 ${result.newStreak})`);
            } else {
                await interaction.reply(`🎉 **Awesome job, ${interaction.user.username}!**\nYou earned **${result.points} points** for completing today's problem!\n\n**🔥 Current Streak:** ${result.newStreak} days\n**⭐ Total Points:** ${result.totalPoints}`);
            }
        } catch (err) {
            console.error(err);
            await interaction.reply('Error logging your submission. Please try again.');
        }
        return;
    }

    if (commandName === 'help') {
        await interaction.reply('*NOT IMPLEMENTED*');
        return;
    }

    if (commandName === 'show-solution') {
        await interaction.reply('*NOT IMPLEMENTED*');
        return;
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

    // Reset missed streaks every day at midnight
    const cron = require('node-cron');
    cron.schedule('0 0 * * *', async () => {
        try {
            const resetCount = await database.resetMissedStreaks();
            console.log(`[${getCurrentFormattedDate()}] Reset streaks for ${resetCount} users.`);
        } catch (err) {
            console.error('Failed to reset missed streaks:', err);
        }
    });

    return client;
}

const discordClient = InitializeClient();

exports.discordClient = discordClient;
