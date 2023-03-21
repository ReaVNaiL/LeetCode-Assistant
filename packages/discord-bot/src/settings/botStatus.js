const { ActivityType } = require('discord.js');
const { getCurrentProgressList } = require('../helpers/dailyProblem');

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

function SetCountBotStatus(client) {
    const status = `Progress ${getCurrentProgressList} / 150`;
    client.user.setPresence({
        activities: [
            {
                name: status,
                type: ActivityType.Custom
            }
        ],
        status: 'online'
    });
}

module.exports = {
    SetBotStatus,
    SetCountBotStatus
};
