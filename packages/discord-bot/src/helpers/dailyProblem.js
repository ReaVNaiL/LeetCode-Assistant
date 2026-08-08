const cron = require('node-cron');
const { getCurrentFormattedDate } = require('./timeHandler');
const status = require('../settings/botStatus');
const emojis = require('../data/emojis.json');
const config = require('../config');
const problemsReq = require('../services/problems-req');
const dailyIndexer = require('../services/daily-indexer');

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

> 💡 **2026 Interview Discussion Prompts:**
> - What is the optimal Time and Space complexity?
> - What edge cases would you test for in a production environment?
> - If this logic was an API endpoint, how would you handle rate limiting or large inputs?
`;
    if (!inChannel) {
        await interaction.reply(output);
        const reply = await interaction.fetchReply();
        await reply.react(emojis.checkmark);
    }
    return output;
}

async function requestProblemInfo(client = null) {
    try {
        const problemInfo = problemsReq.getDailyProblem();
        if (client) await status.updateStatusCount(client);
        return problemInfo;
    } catch (error) {
        console.error('Failed to fetch daily problem:', error.message);
        return { title: 'Unavailable', type: 'N/A', difficulty: 'N/A', link: '#' };
    }
}

async function requestSkipDailyProblem() {
    return problemsReq.skipDailyProblem();
}

/**
 * Send the daily problem message to the channel every day at 12:00 PM
 * @param {Object} client - The Discord client
 * @param {String} CHANNEL_ID - The channel ID
 */
function sendDailyProblemMessage(client, CHANNEL_ID) {
    cron.schedule(config.cronSchedule, async () => {
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
