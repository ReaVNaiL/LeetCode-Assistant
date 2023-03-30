const problems = require('../data/daily-list.json');
const problemReq = require('./problems-req');
const axios = require('axios');

// Global variables
const START_DATE = new Date('2023-03-21'); // Possibly change this to the date of the first problem
const TOTAL_PROBLEMS = 150;

/// HELPERS
function getProblemIndex(today, startDate) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor((today - startDate) / msPerDay);
    return daysDifference % TOTAL_PROBLEMS;
}

function getProblemForToday(onlyLink = false) {
    const today = new Date();
    const problemIndex = getProblemIndex(today, START_DATE);
    return onlyLink
        ? Object.keys(problems)[problemIndex]
        : problems[Object.keys(problems)[problemIndex]];
}

/// EXPORTS
function getDailyProblemType() {
    return getProblemForToday();
}

function getDailyProblemLink() {
    return getProblemForToday(true);
}

/**
 * Get a problem from the list of problems, and request the API for the problem details
 * @returns {Object} - The problem details:
 *
 * { `title`, `type`, `difficulty`, `link` }
 */
function getDailyProblem() {
    const problemLink = getDailyProblemLink();
    const problemType = getDailyProblemType();

    return problemReq.getProblemByUrl(problemLink, problemType);
}

/**
 * Get Current Progress List
 * @returns {Object} Count of problems left
 */
function getCurrentProgressList() {
    const today = new Date();
    return getProblemIndex(today, START_DATE);
}

async function getBonusProblem() {
    // Getting the bonus problem from leetcode.com
    const body = {
        query: '{ activeDailyCodingChallengeQuestion { link } }'
    };

    const response = await axios.post('https://leetcode.com/graphql', body);

    if (response.status === 200) {
        // get the link from the response
        const link = response.data.data.activeDailyCodingChallengeQuestion.link;

        return problemReq.getProblemByUrl(`https://leetcode.com${link}`, '???');
    }

    return { link: 'Error' };
}

module.exports = {
    getDailyProblemType,
    getDailyProblemLink,
    getDailyProblem,
    getCurrentProgressList,
    getBonusProblem
};
