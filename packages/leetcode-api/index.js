const express = require('express');
const app = express();

const settings = require('./src/config/api-settings-example.json');
const PORT = process.env.PORT || settings.port;

const problemRoutes = require('./src/routes/problems');
const dailyRoutes = require('./src/routes/daily');

// Simple Logger
let currTime = new Date().toLocaleString();
app.use((req, res, next) => {
    console.log(
        `[${currTime}]: [${req.method}] http://localhost:50520${req.url} | Domain: "${req.hostname}" | IP: "${req.ip}`
    );
    next();
});

// Routes Configuration
app.use('/problems', problemRoutes);
app.use('/daily', dailyRoutes);

// Create a home route
app.get('/', (req, res) => {
    res.send('Welcome to LeetCode API');
});

app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}/`)
);
