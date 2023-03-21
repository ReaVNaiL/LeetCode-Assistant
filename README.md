# LeetCode-Generator-Discord-Bot
Discord Bot that will assign leetcode problems daily.
<p>
    <img width=435 height=325 src="https://user-images.githubusercontent.com/59776018/226667773-83eead6e-054c-4ac0-9137-b82ead5b8980.png"/>
</p>

1. Discord Bot that will assign leetcode problems daily.
2. An API that will generate leetcode problems based on the difficulty level:
    - Provides a list of problems based on the difficulty level.
    - Provides top 10 problems based on the frequency of the problem being asked in the past.
    - Provides a random problem based on the difficulty level.

# Table of Contents
- [LeetCode-Generator-Discord-Bot](#leetcode-generator-discord-bot)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
- [Getting Started with Lerna](#getting-started-with-lerna)
  - [Terminology](#terminology)
  - [Important Commands](#important-commands)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)


# Getting Started

1. Clone the repository

    ```bash
    git clone https://github.com/ReaVNaiL/LeetCode-Generator-Discord-Bot/
    ```
2. Install dependencies

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following variables

    ```bash
    discord_token=<your discord bot token>
    ```

# Getting Started with Lerna
`Lerna` is a tool that optimizes the workflow around managing multi-package repositories with git and npm.
- Packages are linked together and can depend on one another.
- Changes are synchronized across linked packages.
- Lerna can version packages and publish them to npm.

## Terminology
- **Repository** - A repository is a directory or storage space where your projects can live. It can be local to your computer or a remote location like GitHub.
- **Package** - A package is a directory or file that is discoverable by npm. It contains a package.json file with metadata relevant to the project. A package can be as small as a single module or as large as a collection of related packages that work together.
- **Version** - A version is a unique identifier for a specific release of a package. Versions are assigned and managed by npm.

## Important Commands
- `lerna bootstrap` - Installs all dependencies for all packages.
- `lerna clean` - Removes the node_modules directory from all packages.
- `lerna run <script>` - Run an npm script in each package that contains that script.
- `lerna run <script> --scope <package>` - Run an npm script in a specific package.
- `lerna run <script> --ignore <package>` - Run an npm script in all packages except a specific package.

## Prerequisites
- Node.js >= 10.13.0
- npm >= 6.4.1
- git >= 2.0.0

## Installation

1. Install Lerna globally
    
    ```bash 
    npm install -g lerna
    ```

2. Install the dependencies for each package using Lerna:
    
    ```bash
    lerna bootstrap
    ```

3. 
