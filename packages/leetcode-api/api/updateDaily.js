const { getCurrentFormattedDate } = require('../src/helpers/timeHandler');
const { skipDailyProblem } = require('../src/services/problems-req');

export default function handler (req, res) {
    try {
        skipDailyProblem();
        res.status(200).send(`[${getCurrentFormattedDate()}] Daily Problem Updated Succesfully`);
    } catch (error) {
        res.status(500).send(`[${getCurrentFormattedDate()}] Daily Problem Update Failed\n
        ${error}`);
    }
};
