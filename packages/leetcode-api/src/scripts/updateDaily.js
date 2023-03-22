const { getCurrentFormattedDate } = require('../helpers/timeHandler');
const { skipDailyProblem } = require('../services/problems-req');

export default function handler (req, res) {
    try {
        skipDailyProblem();
        res.status(200).send(`[${getCurrentFormattedDate()}] Daily Problem Updated Succesfully`);
    } catch (error) {
        console.error(`[${getCurrentFormattedDate()}] Daily Problem Update Failed\n
        ${error}`, error);
        res.status(500).send('Daily Problem Update Failed');
    }
};
