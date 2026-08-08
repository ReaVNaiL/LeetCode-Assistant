// Modules import
const problems = require('../data/leetcode-data.json').stat_status_pairs;
const dailyProblemList = require('../data/daily-list.json');
const problemCount = problems.length;
const fs = require('fs');

// index 0 = easy, 1 = medium, 2 = hard;
let problemList = [[], [], []];
let completedProblemList = [[], [], []];

function printElement(index) {
    let lcProblem = '';
    if (index >= 0 && index < problemCount) {
        lcProblem = problems[index];
        let newProblem = createBaseModel(lcProblem);
        return newProblem;
    }
    return 'Problem not found, please try a different index.';
}

const DIFFICULTY_LABELS = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

function getProblemByUrl(problemUrl, type) {
    const linkSlug = problemUrl.split('/')[4];
    const match = problems.find(
        (p) => p.stat.question__title_slug === linkSlug
    );

    return {
        title: match ? match.stat.question__title : '',
        type,
        difficulty: match
            ? DIFFICULTY_LABELS[match.difficulty.level] || 'Unknown'
            : 'Unknown',
        link: problemUrl
    };
}

function arrangeProblemSets() {
    problemList = [[], [], []];
    completedProblemList = [[], [], []];

    problems.forEach((element) => {
        const newProblem = createBaseModel(element);
        const arrIndex = newProblem.difficulty - 1;
        const targetList = newProblem.isCompleted
            ? completedProblemList
            : problemList;
        targetList[arrIndex].push(newProblem);
    });

    [problemList, completedProblemList].forEach((list) =>
        list.forEach((bucket) => sortArray(bucket))
    );

    generateSortedJsonFile('leetcode-data-sorted.json', {
        completedProblemList,
        problemList
    });

    return { completedProblemList, problemList };
}

/**
 * Get a problem from the list of problems, and request the API for the problem details
 * @returns {Object} - The problem details:
 *
 * { `title`, `type`, `difficulty`, `link` }
 */
function getDailyProblem() {
    const problemLink = Object.keys(dailyProblemList)[0];
    const problemInfo = getProblemByUrl(problemLink);

    problemInfo.type = dailyProblemList[problemLink];

    return problemInfo;
}

/**
 * Skip the daily problem and update the list
 */
function skipDailyProblem() {
    delete dailyProblemList[Object.keys(dailyProblemList)[0]];
    // get file path
    const filePath = require.resolve('../data/daily-list.json');

    // save the new list to the file
    fs.writeFile(filePath, JSON.stringify(dailyProblemList, null, 4), (err) => {
        if (err) return err;
        else return 'Daily problem list updated.';
    });
}

/**
 * Get Current Progress List
 * @returns {Object} Count of problems left
 */
function getCurrentProgressList() {
    return 150 - Object.keys(dailyProblemList).length;
}

///
/// Helper Functions
///
function createBaseModel(problemSet) {
    let problemId = problemSet.stat.question_id;
    let problemName = problemSet.stat.question__title;

    return {
        name: problemName,
        problemId: problemId,
        difficulty: problemSet.difficulty.level,
        progress: problemSet.progress,
        isCompleted: problemSet.status === 'ac',
        questionUrl: problemSet.stat.question__title_slug,
        isNewQuestion: problemSet.stat.is_new_question,
        paidOnly: problemSet.paid_only
    };
}

function generateSortedJsonFile(filename, jsonContent) {
    let path = `./src/data/${filename}`;
    fs.writeFile(path, JSON.stringify(jsonContent, null, 4), function (err) {
        if (err) console.log(err);
        else console.log(`File written succesfully: ${filename}.`);
    });
}

function sortArray(bucket) {
    bucket.sort((a, b) => {
        if (a.difficulty === b.difficulty) {
            return a.name.localeCompare(b.name);
        }
        return a.difficulty - b.difficulty;
    });
}
///
/// End Of Helper Functions
///

module.exports = {
    printElement,
    arrangeProblemSets,
    getProblemByUrl,
    skipDailyProblem,
    getCurrentProgressList
};
