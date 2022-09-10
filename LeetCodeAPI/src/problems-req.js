const problems = require("../data/leetcode-data.json").stat_status_pairs;
const problemCount = problems.length;

// index 0 = easy, 1 = medium, 2 = hard;
let problemList = [[], [], []]

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

function createBaseModel(problemSet) {
    let problemId = problemSet.stat.question_id;
    let problemName = problemSet.stat.question__title;

    return [
        {
            name: problemName,
            problemId: problemId,
            difficulty: problemSet.difficulty.level,
            progress: problemSet.progress,
            isCompleted: problemSet.status == "ac" ? true : false,
            questionUrl: problemSet.stat.question__title_slug,
            isNewQuestion: problemSet.stat.is_new_question,
        },
    ];
}

module.exports.printElement = printElement;
module.exports.sortByDifficulty = sortByDifficulty;
