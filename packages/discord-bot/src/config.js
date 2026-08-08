require('dotenv').config();

const config = {
    token: process.env.TOKEN || process.env.DISCORD_TOKEN || '',
    channelId: process.env.CHANNEL_ID || process.env.DISCORD_CHANNEL_ID || '',
    apiUrl: (process.env.LEETCODE_API_URL || 'http://leetcode-api:50520').replace(/\/$/, ''),
    cronSchedule: process.env.CRON_SCHEDULE || '0 11 * * *',
    adminPasscode: process.env.ADMIN_PASSCODE || '',
    enableAutoDeploy: process.env.ENABLE_AUTO_DEPLOY === 'true'
};

if (!config.token) {
    console.warn('[CONFIG WARNING] TOKEN environment variable is missing.');
}
if (!config.channelId) {
    console.warn('[CONFIG WARNING] CHANNEL_ID environment variable is missing.');
}

module.exports = config;
