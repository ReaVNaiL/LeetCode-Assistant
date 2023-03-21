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
    const status = `Progress ${getCurrentProgressList()}/150`;
    client.user.setPresence({
        activities: [
            {
                name: status,
                type: ActivityType.Playing,
                details: 'Progress',
                state: `${getCurrentProgressList()}/150`,
                timestamps: {
                    start: Date.now()
                }
            }
        ],
        status: 'dnd'
    });
}

module.exports = {
    SetBotStatus,
    SetCountBotStatus
};
