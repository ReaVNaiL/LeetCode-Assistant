/* eslint-disable no-console */
const axios = require('axios');
const cron = require('node-cron');
const problemList = require('../data/daily-list.json');
const { getCurrentFormattedDate } = require('./timeHandler');

const CRON_SCHEDULE = '0 12 * * *';

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
    isEveryOne = false
) {
    await interaction.reply({
        content: `
    :wave: ${isEveryOne ? '@everyone' : ''} Here is the daily problem for today!
**:small_blue_diamond:  ${problemTitle}**
**:small_blue_diamond: Problem Type:**  ${problemType}
**:small_blue_diamond: Difficulty:**  ${problemDifficulty}
**:small_blue_diamond: Problem Link :mag::**  ${problemLink}
    `,
        allowedMentions: { parse: ['everyone'] }
    });
}

/**
 * Send the request to the API to get the problem details
 * @param {String} problemLink - The link to the problem
 * @returns {Object} - The problem details
 */
async function requestProblemInfo(problemLink) {
    const problemInfo = await axios.get(
        `https://leetcode-api.klenir.com/problems/search?link=${problemLink}`
    );

    return problemInfo;
}

/**
 * Get a problem from the list of problems, and request the API for the problem details
 * @returns {Object} - The problem details:
 *
 * { `title`, `type`, `difficulty`, `link` }
 */
async function getDailyProblem() {
    const problemLink = Object.keys(problemList)[0];
    const problemReq = await requestProblemInfo(problemLink);
    const problemInfo = problemReq.data;

    problemInfo.type = problemList[problemLink];

    return problemInfo;
}

/**
 * Start the task to remove the problem from the list after 24 hours
 */
function removeProblemFromList() {
    cron.schedule(CRON_SCHEDULE, () => {
        delete problemList[Object.keys(problemList)[0]];
    });
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
            channel.send('Updating the daily problem...');
            const interaction = { channel };

            const daily = await getDailyProblem();
            await dailyProblemStringBuilder(
                interaction,
                daily.title,
                daily.type,
                daily.difficulty,
                daily.link,
                true
            );

            console.log(
                `[${getCurrentFormattedDate()}] Daily problem updated!`
            );
        }
    });
}

/**
 * Get Current Progress List
 * @returns {Object} - The problem list
 */
function getCurrentProgressList() {
    return 150 - Object.keys(problemList).length;
}

module.exports = {
    dailyProblemStringBuilder,
    getDailyProblem,
    removeProblemFromList,
    sendDailyProblemMessage,
    getCurrentProgressList
};
