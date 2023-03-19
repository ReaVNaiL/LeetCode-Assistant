const config = require('./config/bot-credentials.json');
const { discordClient } = require('./src/discordClient');
const { checkForChanges } = require('./git-watch');

// Call checkForChanges every 15 seconds
setInterval(checkForChanges, 15000);


// Stop the bot
discordClient.login(config.token);
