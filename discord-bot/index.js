const config = require('./config/bot-credentials.json');
const { discordClient } = require('./src/discordClient.js');

// Stop the bot
discordClient.loging(config.token);