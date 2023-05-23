# LeetCode Assistant

<p>
    <img width=435 height=325 src="https://user-images.githubusercontent.com/59776018/226667773-83eead6e-054c-4ac0-9137-b82ead5b8980.png"/>
</p>

LeetCode Assistant is a powerful tool designed to help programmers prepare for technical interviews. It consists of a Discord bot that assigns LeetCode problems daily and an API that generates LeetCode problems based on their difficulty level. The bot not only assigns problems but also provides a variety of features to help users make the most out of their LeetCode practice.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Packages](#packages)
  - [discord-bot](#discord-bot)
  - [leetcodeapi](#leetcodeapi)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

The LeetCode Assistant is designed with a variety of features to streamline and enhance your LeetCode practice:

- **Daily Problem Assignment**: The bot assigns daily LeetCode problems, helping users maintain a consistent practice schedule.
- **Difficulty-Based Problem Generation**: The API can generate a list of problems based on the difficulty level, allowing users to focus their practice on specific difficulty tiers.
- **Top Problems**: The bot provides the top 10 problems based on the frequency of the problems being asked in the past, helping users focus on commonly asked questions.
- **Random Problem Generation**: The bot can provide a random problem based on the difficulty level, adding variety to the users' practice routine.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js >= 10.13.0
- npm >= 6.4.1
- git >= 2.0.0

### Installation

1. Clone the repository:

    ```
    git clone https://github.com/ReaVNaiL/LeetCode-Generator-Discord-Bot/
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Install Lerna globally:

    ```
    npm install -g lerna
    ```

4. Install the dependencies for each package using Lerna:

    ```
    lerna bootstrap
    ```

5. Create a `.env` file in the root directory and add the following variables:

    ```
    discord_token=<your discord bot token>
    ```

## Packages

The bot's code is divided into two main packages: `discord-bot` and `leetcodeapi`.

### Discord-Bot

This package contains the code for the Discord bot itself. It uses axios for making HTTP requests, discord.js for interacting with Discord, dotenv for managing environment variables, node-cron for scheduling tasks, and pm2 for managing the application process.

> :warning: **Note**: The bot is using a date system to keep track of daily problems. At the time, this is hard coded, eventually I will allow users to set their own problem list, so they can start from the beginning of the list.

Snapshot of the bot in action:
- Assigning a daily problem:

- Generating a random problem:


### LeetCode-Api

This package contains the code for the LeetCode problem generation API. It uses axios for making HTTP requests, express for managing the server, express-winston for logging, and webpack for bundling the application.

> See [API Endpoints](packages/leetcode-api/README.md) for more information on the API.

> :notebook: **Note**: The API is hosted on Vercel. If you wish to host the API yourself, you will need to create a Vercel account and deploy the API to Vercel.
> Click [here](https://vercel.com/docs) for more information on how to deploy to Vercel.

## Usage

You can use various Lerna commands to manage the bot and the API:

- `lerna bootstrap`: Installs all dependencies for all packages.
- `lerna run <script>`: Run an npm script in each package that contains that script.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
