const axios = require('axios');

async function requestBonusProblem() {
    const bonusInfo = await axios.get(
        'https://leetcode-api.klenir.com/daily/bonus'
    );

    return bonusInfo.data;
}

module.exports = {
    requestBonusProblem
};
