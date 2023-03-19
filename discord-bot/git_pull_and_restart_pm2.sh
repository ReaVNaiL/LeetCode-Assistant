#!/bin/bash

# change to the directory where the git repository is located
cd ~/LeetCode-Generator-Discord-Bot

# pull changes from the remote repository
git pull

# check if there were any changes
if [ "$(git diff --shortstat)" != "" ]; then
  # if there were changes, restart the pm2 instance
  pm2 startOrRestart app.js
fi
