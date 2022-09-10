const bot = require('./src/bot.js');
const express = require('express');
const app = express();
const PORT = 50520;
const data = require("./src/leetcode-data.json");

function printElement(index){
    lcProblem = data.stat_status_pairs[index].stat.question__title_slug;
    console.log(lcProblem);
    return `https://www.leetcode.com/problems/${lcProblem}`;
};

// Test endpoint
app.get("/user/stats/:index", (req, res) => {
    let data3 = printElement(req.params.index);
    res.send(`${JSON.stringify(data3)}`);
});

// Create logger for each request to the server with Error handling
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}]: [${req.method}] ${req.url == '/' ? 'http://localhost:50520' : req.url}`);
    next();
});

app.listen(
    PORT,
    () => console.log(`Server listening on http://localhost:${PORT}/`)
)
