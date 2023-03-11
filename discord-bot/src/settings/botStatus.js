const { ActivityType, ClientPresence } = require('discord.js');

function SetBotStatus(client, status) {
    client.user.setPresence({
        activities: [
            {
                name: status,
                type: ActivityType.Streaming,
                url: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
            },
        ],
        status: 'online',
    });
}

exports.SetBotStatus = SetBotStatus;