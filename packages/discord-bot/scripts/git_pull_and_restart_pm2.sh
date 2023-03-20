#!/bin/bash

# change to the directory where the git repository is located
cd ~/LeetCode-Generator-Discord-Bot

# pull changes from the remote repository
git pull

# check if there were any changes
if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]; then
  # Restart the PM2 instance
  pm2 start LeetCode-Bot
fi

pm2 start LeetCode-Bot
