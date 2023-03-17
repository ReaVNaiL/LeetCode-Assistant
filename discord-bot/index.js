const config = require('./config/bot-credentials.json');
const { discordClient } = require('./src/discordClient');

// Stop the bot
discordClient.login(config.token);
