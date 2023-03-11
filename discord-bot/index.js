const config = require('./config/bot-credentials.json');
const { client } = require('./discordClient.js');

// Stop the bot
client.destroy(config.token);