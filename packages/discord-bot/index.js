require('dotenv').config();
const { discordClient } = require('./src/discordClient');
const { executeDeploymentSchedule } = require('./scripts/deployChildTask');

// Start the deployment schedule
executeDeploymentSchedule();

// Stop the bot
discordClient.login(process.env.TOKEN);
