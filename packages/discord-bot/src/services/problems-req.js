// Modules import
const problems = require('../data/leetcode-data.json').stat_status_pairs;
const database = require('../database');
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
 * @returns {Promise<Object>} - The problem details:
 *
 * { `title`, `type`, `difficulty`, `link` }
 */
async function getDailyProblem() {
    const dailyRow = await database.getNextDailyProblem();
    if (!dailyRow) return null;

    const problemInfo = getProblemByUrl(dailyRow.url);
    problemInfo.type = dailyRow.type;
    problemInfo.dbId = dailyRow.id; // Keep track for skipping

    return problemInfo;
}

/**
 * Skip the daily problem and update the list
 */
async function skipDailyProblem() {
    const dailyRow = await database.getNextDailyProblem();
    if (dailyRow) {
        await database.markDailyProblemCompleted(dailyRow.id);
        return 'Daily problem skipped and marked as completed in DB.';
    }
    return 'No more daily problems to skip.';
}

/**
 * Get Current Progress List
 * @returns {Promise<Number>} Count of problems left
 */
async function getCurrentProgressList() {
    // Stubbed for now, ideally count where is_completed = 0
    return 150;
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
