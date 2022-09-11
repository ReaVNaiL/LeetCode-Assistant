// Modules import
const problems = require("../data/leetcode-data.json").stat_status_pairs;
const problemCount = problems.length;
const fs = require("fs");

// index 0 = easy, 1 = medium, 2 = hard;
let problemList = [[], [], []];
let completedProblemList = [[], [], []];

function printElement(index) {
    let lcProblem = "";
    if (index >= 0 && index < problemCount) {
        lcProblem = problems[index];
        // return `https://www.leetcode.com/problems/${lcProblem}`;
        let newProblem = createBaseModel(lcProblem);
        return newProblem;
    }
    return "Problem not found, please try a different index.";
}

function arrangeProblemSets() {
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

    generateSortedJsonFile("leetcode-data-sorted.json", {
        completedProblemList,
        problemList,
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
        isCompleted: problemSet.status == "ac" ? true : false,
        questionUrl: problemSet.stat.question__title_slug,
        isNewQuestion: problemSet.stat.is_new_question,
        paidOnly: problemSet.paid_only
    };
}

function generateSortedJsonFile(filename, jsonContent) {
    let path = `./LeetCodeAPI/data/${filename}`;
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

module.exports.printElement = printElement;
module.exports.arrangeProblemSets = arrangeProblemSets;
