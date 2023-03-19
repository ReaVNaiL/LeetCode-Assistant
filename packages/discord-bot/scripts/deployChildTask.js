/* eslint-disable */
const { spawn } = require("child_process");
const cron = require("node-cron");

// define the task to run every 24 hours
function executeDeploymentSchedule() {
  const task = cron.schedule("*/1 * * * *", () => {
    console.log("Running git pull and pm2 restart...");

    // spawn the child process
    const child = spawn("bash", [
      "./LeetCode-Generator-Discord-Bot/packages/discord-bot/scripts/git_pull_and_restart_pm2.sh",
    ]);

    // handle the output and errors
    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });

  // start the task
  task.start();
}

exports.executeDeploymentSchedule = executeDeploymentSchedule;
