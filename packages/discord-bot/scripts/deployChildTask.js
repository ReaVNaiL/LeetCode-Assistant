/* eslint-disable */
const { spawn } = require('child_process');
const cron = require('node-cron');
const path = require('path');
const config = require('../src/config');

const DAILY_SCHEDULE = '0 0 * * *'; // Run once daily at midnight
const SCRIPT_PATH = path.join(__dirname, 'git_pull_and_restart_pm2.sh');

function executeDeploymentSchedule() {
    if (!config.enableAutoDeploy) {
        console.log('Auto-deployment schedule is disabled (ENABLE_AUTO_DEPLOY != true).');
        return;
    }

    const task = cron.schedule(DAILY_SCHEDULE, () => {
        console.log('Running git pull and pm2 restart...');

        // spawn the child process
        const child = spawn('bash', [SCRIPT_PATH]);

        // handle the output and errors
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        child.on('error', (err) => {
            console.error(`Failed to start deploy script: ${err.message}`);
        });
    });

    // start the task
    task.start();
}

exports.executeDeploymentSchedule = executeDeploymentSchedule;

