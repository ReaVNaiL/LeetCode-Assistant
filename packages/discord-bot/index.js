const config = require('./config/bot-credentials.json');
const { discordClient } = require('./src/discordClient');
// const { executeDeploymentSchedule } = require('./scripts/deployChildTask');

// Start the deployment schedule
// executeDeploymentSchedule();

// Stop the bot
discordClient.login(config.testToken);
