const { spawnSync, spawn } = require('child_process');
const fs = require('fs');

// Replace these with the appropriate values for your server and repository
const serverName = 'debiannext';
const repositoryPath = './LeetCode-Generator-Discord-Bot';
const branchName = 'main';

setInterval(() => {
  console.log('Checking for changes...');

  // Save the current commit ID to a file
  const currentCommitId = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryPath }).stdout.toString().trim();
  fs.writeFileSync('commit-id.txt', currentCommitId);

  // Check if the previous commit ID matches the current commit ID
  const previousCommitId = fs.readFileSync('commit-id.txt', 'utf-8').trim();
  if (previousCommitId !== currentCommitId) {
    console.log('Updating server...');

    // Use PM2 to stop the server
    const stopProcess = spawn('pm2', ['stop', serverName]);

    stopProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Failed to stop server. Exit code: ${code}`);
        return;
      }

      // Use Git to pull the latest changes
      const gitProcess = spawn('git', ['pull', 'origin', branchName], { cwd: repositoryPath });

      gitProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Failed to pull latest changes. Exit code: ${code}`);
          return;
        }

        // Save the new commit ID to a file
        const newCommitId = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryPath }).stdout.toString().trim();
        fs.writeFileSync('commit-id.txt', newCommitId);

        // Use PM2 to restart the server
        const restartProcess = spawn('pm2', ['restart', serverName]);

        restartProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`Failed to restart server. Exit code: ${code}`);
            return;
          }

          console.log('Server updated successfully');
        });
      });
    });
  } else {
    console.log('Server is up to date');
  }
  console.log('Waiting for the next check...');
}, 60000); // 60000 milliseconds = 1 minute
