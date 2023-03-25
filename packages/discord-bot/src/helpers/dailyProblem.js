/* eslint-disable no-console */
const axios = require('axios');
const cron = require('node-cron');
const { getCurrentFormattedDate } = require('./timeHandler');
const status = require('../settings/botStatus');

const CRON_SCHEDULE = '0 14 * * *'; // 2:00 PM

/**
 * This function is used to build the string for the daily problem
 * @param {Object} interaction - The interaction object
 * @param {String} problemTitle - The title of the problem
 * @param {String} problemType - The type of the problem
 * @param {String} problemDifficulty - The difficulty of the problem
 * @param {String} problemLink - The link to the problem
 * @param {Boolean} isEveryOne - If the message should mention everyone
 */
async function dailyProblemStringBuilder(
    interaction,
    problemTitle,
    problemType,
    problemDifficulty,
    problemLink,
    isEveryOne = false,
    inChannel = false
) {
    const output = `
:wave: ${isEveryOne ? '@here' : ''} Here is the daily problem for today!
:eyes: **${problemTitle}** :eyes:
**:small_blue_diamond: Problem Type:**  ${problemType}
**:small_blue_diamond: Difficulty:**  ${problemDifficulty}
**:small_blue_diamond: Problem Link :mag::**  ${problemLink}
`;
    if (!inChannel) {
        await interaction.reply(output);
    }
    return output;
}

/**
 * Send the request to the API to get the problem details
 * @param {String} problemLink - The link to the problem
 * @returns {Object} - The problem details
 */
async function requestProblemInfo(client = null) {
    const problemInfo = await axios.get(
        'https://leetcode-api.klenir.com/daily'
    );

    // Set the bot status optionally
    if (client) await status.updateStatusCount(client);

    return problemInfo.data;
}

async function requestSkipDailyProblem() {
    return axios.post('https://leetcode-api.klenir.com/problems/daily/skip');
}

/**
 * Send the daily problem message to the channel every day at 12:00 PM
 * @param {Object} client - The Discord client
 * @param {String} CHANNEL_ID - The channel ID
 */
function sendDailyProblemMessage(client, CHANNEL_ID) {
    cron.schedule(CRON_SCHEDULE, async () => {
        const channel = client.channels.cache.get(CHANNEL_ID);

        if (channel) {
            const daily = await requestProblemInfo(client);
            const output = await dailyProblemStringBuilder(
                channel,
                daily.title,
                daily.type,
                daily.difficulty,
                daily.link,
                true,
                true
            );

            channel.send(`Updating the daily problem...\n${output}`);

            console.log(
                `[${getCurrentFormattedDate()}] Daily problem updated!`
            );
        }
    });
}

module.exports = {
    dailyProblemStringBuilder,
    requestProblemInfo,
    sendDailyProblemMessage,
    requestSkipDailyProblem
};
