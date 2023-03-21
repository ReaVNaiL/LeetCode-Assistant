const cron = require('node-cron');
const { ActivityType } = require('discord.js');

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
                state: `${count}/150`,
                timestamps: {
                    start: Date.now()
                }
            }
        ],
        status: 'dnd'
    });
}

/**
 * Create Task to update the bot status
 * @param {Client} client - The Discord client object
 * @param {Number} count - The current progress count
 * @param {Number} intervalMinutes - The interval in minutes to update the status
 */
function scheduleStatusUpdate(client, count, intervalMinutes = 5) {
    cron.schedule(`*/${intervalMinutes} * * * *`, () => {
        SetCountBotStatus(client, count);
    });
}

module.exports = {
    SetBotStatus,
    SetCountBotStatus,
    scheduleStatusUpdate
};
