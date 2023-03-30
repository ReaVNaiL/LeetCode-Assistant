const express = require('express');
const router = express.Router();

const dailyIndexer = require('../services/daily-indexer');

router.get('/', (req, res) => {
    res.send(dailyIndexer.getDailyProblem());
});

router.get('/type', (req, res) => {
    res.send(dailyIndexer.getDailyProblemType());
});

router.get('/count', (req, res) => {
    const count = dailyIndexer.getCurrentProgressList();
    res.send({ count });
});

router.get('/link', (req, res) => {
    const link = dailyIndexer.getDailyProblemLink();
    res.send({ link });
});

router.get('/bonus', async (req, res) => {
    const bonus = await dailyIndexer.getBonusProblem();
    res.send(bonus);
});


module.exports = router;