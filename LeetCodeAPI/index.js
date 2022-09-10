const problems = require('./src/problems-req');
const express = require('express');
const app = express();
const PORT = 50520;

// Test endpoint
app.get("/user/stats/:index", (req, res) => {
    let data = problems.printElement(req.params.index);
    res.send(`${JSON.stringify(data)}`);
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
