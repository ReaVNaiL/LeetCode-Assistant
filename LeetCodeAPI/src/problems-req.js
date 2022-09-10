const data = require("./leetcode-data.json");

function printElement(index){
    lcProblem = data.stat_status_pairs[index].stat.question__title_slug;
    console.log(lcProblem);
    return `https://www.leetcode.com/problems/${lcProblem}`;
};

module.exports.printElement = printElement;