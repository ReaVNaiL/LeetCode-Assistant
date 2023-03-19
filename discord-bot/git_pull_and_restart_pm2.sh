#!/bin/bash

# change to the directory where the git repository is located
cd ~/LeetCode-Generator-Discord-Bot

# pull changes from the remote repository
git pull

# check if there were any changes
if [[ -n $(git status --porcelain | grep "^UU") ]]; then
  # If there are merge conflicts, display an error message and exit
  echo "ERROR: Merge conflicts detected. Please resolve them manually and try again."
  exit 1
fi

# Restart the PM2 instance
pm2 startOrRestart ecosystem.config.js
