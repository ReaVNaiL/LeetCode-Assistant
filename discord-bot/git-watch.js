const { exec } = require('child_process');

const pm2EnvFile = '~/environment.config.js';

let prevCommit = null;

function checkForChanges() {
  exec('git fetch', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    const latestCommit = stdout.trim();
    if (prevCommit !== null && prevCommit !== latestCommit) {
      console.log('Changes detected!');
      exec('git pull', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
        } else {
          console.log(stdout);
          console.log('Git pull successful.');
          exec(`pm2 startOrRestart ${pm2EnvFile}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error: ${error.message}`);
            } else {
              console.log(stdout);
              console.log('PM2 startOrRestart successful.');
            }
          });
        }
      });
    } else {
      console.log('No changes detected.');
    }
    prevCommit = latestCommit;
  });
}

module.exports = { checkForChanges };
