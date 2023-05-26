#!/bin/bash

# change to the directory where the git repository is located
cd ~/LeetCode-Generator-Discord-Bot

# pull changes from the remote repository
git fetch

# check if there were any changes
if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]; then
  # Restart the PM2 instance
  git pull
fi

# change back to the original directory
cd -