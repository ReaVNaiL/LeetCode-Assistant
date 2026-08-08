const express = require('express');
const app = express();

const config = require('./src/config');
const PORT = config.port;

const problemRoutes = require('./src/routes/problems');
const dailyRoutes = require('./src/routes/daily');
const jobRoutes = require('./src/routes/jobs');

// Simple Logger
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(
        `[${timestamp}]: [${req.method}] http://localhost:${PORT}${req.url} | Domain: "${req.hostname}" | IP: "${req.ip}`
    );
    next();
});

// Routes Configuration
app.use('/problems', problemRoutes);
app.use('/daily', dailyRoutes);
app.use('/jobs', jobRoutes);

// Create a home route
app.get('/', (req, res) => {
    res.send('Welcome to LeetCode API');
});

app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}/`)
);

