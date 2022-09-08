const express = require('express');
const app = express();
const PORT = 50520;

// Add JSON body parsing middleware
app.use(express.json());

// Create logger for each request to the server with Error handling
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}]: [${req.method}] ${req.url == '/' ? 'https://localhost:50520' : req.url}`);
    next();
});

app.listen(
    PORT,
    () => console.log(`Server listening on port: ${PORT}`)
)
