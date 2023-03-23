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

function getProblemByUrl(problemUrl, type) {
    const linkSlug = problemUrl.split('/')[4];
    let dailyProblem = {
        title: '',
        type: type,
        difficulty: 0,
        link: problemUrl
    };

    // Note: This is a synchronous function, but it's okay because it's only called once.
    problems.forEach((problem, index) => {
        const problemSlug = problem['stat']['question__title_slug'];
        if (problemSlug === linkSlug) {
            dailyProblem['difficulty'] = problem['difficulty']['level'];
            dailyProblem['title'] = problem['stat']['question__title'];
            return dailyProblem;
        }
    });

    // Replace the difficulty number with the string
    switch (dailyProblem['difficulty']) {
        case 1:
            dailyProblem['difficulty'] = 'Easy';
            break;
        case 2:
            dailyProblem['difficulty'] = 'Medium';
            break;
        case 3:
            dailyProblem['difficulty'] = 'Hard';
            break;
        default:
            dailyProblem['difficulty'] = 'Unknown';
            break;
    }

    return dailyProblem;
}

function arrangeProblemSets() {
    problemList = [[], [], []];
    completedProblemList = [[], [], []];

    problems.forEach(function (element) {
        let newProblem = createBaseModel(element);

        // Follow arr index for each diff level.
        let arrIndex = newProblem.difficulty - 1;

        // Add to correct array and sort it on each iteration.
        if (newProblem.isCompleted) {
            completedProblemList[arrIndex].push(newProblem);
            sortArray(completedProblemList, arrIndex);
        } else {
            problemList[arrIndex].push(newProblem);
            sortArray(problemList, arrIndex);
        }
    });

    generateSortedJsonFile('leetcode-data-sorted.json', {
        completedProblemList,
        problemList
    });

    return { completedProblemList, problemList };
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
        isCompleted: problemSet.status == 'ac' ? true : false,
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

function sortArray(arr, index) {
    arr[index].sort((a, b) => {
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
    getProblemByUrl
};
