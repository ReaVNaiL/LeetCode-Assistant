const { ActivityType } = require('discord.js');
const axios = require('axios');

function SetBotStatus(client, status) {
    client.user.setPresence({
        activities: [
            {
                name: status,
                type: ActivityType.Streaming,
                url: 'https://www.youtube.com/watch?v=QH2-TGUlwu4'
            }
        ],
        status: 'online'
    });
}

/**
 * Set the bot status to show the current progress
 * @param {Client} client - The Discord client object
 * @param {Number} count - The current progress count
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Client|Discord.js Client}
 */
function SetCountBotStatus(client, count) {
    const status = `Progress ${count}/150`;
    client.user.setPresence({
        activities: [
            {
                name: status,
                type: ActivityType.Playing,
                details: 'Progress',
                state: `${count}`,
                timestamps: {
                    start: Date.now()
                }
            }
        ],
        status: 'online'
    });
}

/**
 * Update the bot status count
 * @returns {Object} Count of problems  solved
 */
async function updateStatusCount(client) {
    const response = await axios.get(
        'https://leetcode-api.klenir.com/daily/count'
    );

    SetCountBotStatus(client, response.data.count);

    return response.data;
}

module.exports = {
    SetBotStatus,
    SetCountBotStatus,
    updateStatusCount
};
