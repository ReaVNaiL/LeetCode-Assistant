const problems = require("../data/leetcode-data.json").stat_status_pairs;
const problemCount = problems.length;

function printElement(index) {
    let lcProblem = "";
    if (index >= 0 && index < problemCount) {
        lcProblem = problems[index].stat.question__title_slug;
        console.log(lcProblem);
        return `https://www.leetcode.com/problems/${lcProblem}`;
    }
    console.log("Index out of range");
    return "Problem not found, please try a different index.";
}

module.exports.printElement = printElement;
