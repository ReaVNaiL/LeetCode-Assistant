const express = require('express');
const router = express.Router();
const { getCurrentFormattedDate } = require('../helpers/timeHandler');
const { skipDailyProblem } = require('../services/problems-req');

router.get('/daily', (req, res) => {
    try {
        skipDailyProblem();
        res.status(200).send(
            `[${getCurrentFormattedDate()}] Daily Problem Updated Succesfully`
        );
    } catch (error) {
        res.status(500)
            .send(`[${getCurrentFormattedDate()}] Daily Problem Update Failed\n
        ${error}`);
    }
});

// Always export the router so it can be accessed in the main index.js file
module.exports = router;