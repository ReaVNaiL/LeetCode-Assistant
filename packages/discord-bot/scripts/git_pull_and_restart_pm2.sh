#!/bin/bash

# change to the directory where the git repository is located
cd ~/LeetCode-Generator-Discord-Bot

# pull changes from the remote repository
git pull

# check if there were any changes
if [ "$(git diff --shortstat)" != "" ]; then
  # Restart the PM2 instance
  pm2 startOrRestart ecosystem.config.js
  pm2 show LeetCode-Bot
fi

pm2 startOrRestart ecosystem.config.js
 pm2 show LeetCode-Bot