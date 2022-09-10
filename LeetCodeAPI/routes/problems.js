// Import Express
const express = require("express");
const router = express.Router();

// Import problems logic.
const problems = require("../src/problems-req.js");

// Get URL for given Index Problem 
router.get("/title/:index", (req, res) => {
    let data = problems.printElement(req.params.index);
    res.send(`${JSON.stringify(data)}`);
});

// Always export the router so it can be accessed in the main index.js file
module.exports = router;