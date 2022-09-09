const express = require('express');
const app = express();
const PORT = 50520;

let courses = {
    1: {
        id : 1,
        name : "course1"
    },
    2: {
        id : 2,
        name : "course2"
    },
};

// Add JSON body parsing middleware
app.use(express.json());

// Test endpoint
app.get("/test/:testvar", (req, res) => {
    res.send(`${JSON.stringify(courses)}`);
    // res.send(`Hello World! Your number is ${req.params.testvar}`);
});

// Create logger for each request to the server with Error handling
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}]: [${req.method}] ${req.url == '/' ? 'https://localhost:50520' : req.url}`);
    next();
});

app.listen(
    PORT,
    () => console.log(`Server listening on https://localhost:${PORT}/`)
)
