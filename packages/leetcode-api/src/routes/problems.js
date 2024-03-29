// Import Modules
const settings = require('../config/api-settings-example.json');
const axios = require('axios');
const express = require('express');
const router = express.Router();

// Import problems logic.
const problems = require('../services/problems-req');

// Get URL for given Index Problem
router.get('/search', (req, res) => {
    let data = {};

    if (req.query.index) {
        data = problems.printElement(req.query.index);
    } else if (req.query.link) {
        data = problems.getProblemByUrl(req.query.link);
    }
    res.send(`${JSON.stringify(data)}`);
});

// Get Direct Problem List
router.get('/refresh', (req, res) => {
    let session = req.query.userSession;
    axios
        .request({
            url: 'https://leetcode.com/api/problems/all/',
            method: 'get',
            headers: {
                Cookie:
                    session == 'enabled'
                        ? `LEETCODE_SESSION=${settings.LEETCODE_SESSION};`
                        : ``
            }
        })
        .then((response) => {
            res.send(response.data);
        });
});

router.get('/all', (req, res) => {
    res.send(problems.arrangeProblemSets());
});

// Always export the router so it can be accessed in the main index.js file
module.exports = router;
