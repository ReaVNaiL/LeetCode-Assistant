const express = require("express");
const app = express();

const settings = require("./data/api-settings.json");
const PORT = settings.port;

const problemRoutes = require("./routes/problems");

// Simple Logger
let currTime = new Date().toLocaleString();
app.use((req, res, next) => {
    console.log(`[${currTime}]: [${req.method}] http://localhost:50520${req.url} | Domain: "${req.hostname}" | IP: "${req.ip}`);
    next();
});


/* TEST */
const helper = require("./src/problems-req");
helper.sortByDifficulty();
/* TEST */

// Routes Configuration
app.use("/problems", problemRoutes);

app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}/`)
);
