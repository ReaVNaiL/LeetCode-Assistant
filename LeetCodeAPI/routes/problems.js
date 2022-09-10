// Import Express
const express = require('express');
const router = express.Router();

// Test endpoint
router.get("/user/stats/:index", (req, res) => {
    let data3 = printElement(req.params.index);
    res.send(`${JSON.stringify(data3)}`);
});


