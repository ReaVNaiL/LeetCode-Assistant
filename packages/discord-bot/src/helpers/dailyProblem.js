// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');
const problemList = require('../data/daily-list.json');

/**
 * This function is used to build the string for the daily problem
 * @param {Object} interaction - The interaction object
 */
async function dailyProblemStringBuilder(
    interaction,
    problemTitle,
    problemType,
    problemDifficulty,
    problemLink
) {
    await interaction.reply({
        content: `
    :wave:Here is your Daily Problem! @everyone:white_check_mark:
**:small_blue_diamond:  ${problemTitle}**
**:small_blue_diamond: Problem Type:**  ${problemType}
**:small_blue_diamond: Difficulty:**    ${problemDifficulty}
**:small_blue_diamond: Problem Link :mag::**    ${problemLink}
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
 */
async function getDailyProblem() {
    const problemLink = Object.keys(problemList)[0];
    const problemReq = await requestProblemInfo(problemLink);
    const problemInfo = problemReq.data;

    // Remove the problem from the list after 24 hours
    setTimeout(() => {
        delete problemList[problemLink];
    }, 86400000);

    problemInfo.type = problemList[problemLink];

    return problemInfo;
}

exports.dailyProblemStringBuilder = dailyProblemStringBuilder;
exports.getDailyProblem = getDailyProblem;
