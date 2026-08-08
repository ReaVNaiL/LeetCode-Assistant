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

## Discord Bot Setup (Required First Step)

Before running the application, you need to create a Discord bot and get your `TOKEN` and `CHANNEL_ID`.

1. **Create the Bot Application:**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Click **New Application** and give it a name.
   - Go to the **Bot** tab and click **Add Bot**.
   - Under the Bot tab, click **Reset Token** and copy your `TOKEN`. Save this somewhere safe.

2. **Invite the Bot to Your Server:**
   - Go to the **OAuth2 > URL Generator** tab.
   - Check the `bot` and `applications.commands` scopes.
   - Under Bot Permissions, check `Send Messages`, `Read Message History`, and `Add Reactions`.
   - Copy the generated URL, paste it into your browser, and authorize the bot to your server.

3. **Get Your Channel ID:**
   - In Discord, go to **User Settings > Advanced** and enable **Developer Mode**.
   - Right-click the channel where you want the bot to post daily problems and select **Copy Channel ID**. This is your `CHANNEL_ID`.

### Quickstart with Docker Compose (Zero Build / Painless)

1. Download `docker-compose.yml` and `.env.example`:
   ```bash
   curl -O https://raw.githubusercontent.com/ReaVNaiL/LeetCode-Generator-Discord-Bot/main/docker-compose.yml
   curl -O https://raw.githubusercontent.com/ReaVNaiL/LeetCode-Generator-Discord-Bot/main/.env.example
   mv .env.example .env
   ```

2. Edit `.env` and set your secrets:
   ```env
   TOKEN=your_discord_bot_token_here
   CHANNEL_ID=your_discord_channel_id_here
   ```

3. Launch pre-built containers:
   ```bash
   docker compose up -d
   ```

> 💡 **Customizing Setup:** If you want to override ports or settings locally without editing `docker-compose.yml`, copy `docker-compose.override.yml.example` to `docker-compose.override.yml`. It is automatically gitignored.

---

### Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` in `packages/discord-bot`:
   ```env
   TOKEN=your_discord_bot_token_here
   CHANNEL_ID=your_discord_channel_id_here
   LEETCODE_API_URL=http://localhost:50520
   ```

3. Start services:
   - Start API: `npm run start --workspace=leetcodeapi`
   - Start Bot: `npm run start --workspace=discord-bot`

## Packages

The bot's code is divided into two main packages: `discord-bot` and `leetcodeapi`.

### Discord-Bot

This package contains the code for the Discord bot itself. It uses axios for making HTTP requests, discord.js for interacting with Discord, dotenv for managing environment variables, node-cron for scheduling tasks, and pm2 for managing the application process.

> :warning: **Note**: The bot is using a date system to keep track of daily problems. At the time, this is hard coded, eventually I will allow users to set their own problem list, so they can start from the beginning of the list.

Snapshot of the bot in action:
- Assigning a daily problem:
<p>
    <img width=335 height=325 src="https://github.com/ReaVNaiL/LeetCode-Assistant/assets/59776018/7839bbed-9574-4e37-a494-4f39c596f850"/>
</p>

- Example Bot Offline:
<p>
    <img width=335 height=335 src="https://github.com/ReaVNaiL/LeetCode-Assistant/assets/59776018/e3cf5b5c-3585-4d1b-8e47-a12a7c1ea948"/>
</p>


### LeetCode-Api

This package contains the code for the LeetCode problem generation API. It uses axios for making HTTP requests, express for managing the server, express-winston for logging, and webpack for bundling the application.

> See [API Endpoints](packages/leetcode-api/README.md) for more information on the API.

> :notebook: **Note**: The API is hosted on Vercel. If you wish to host the API yourself, you will need to create a Vercel account and deploy the API to Vercel.
> Click [here](https://vercel.com/docs) for more information on how to deploy to Vercel.

## Usage

This project uses npm workspaces to manage the monorepo:

- `npm install`: Installs all dependencies for all packages.
- `npm run <script> --workspaces`: Run an npm script in each package that contains that script.
- `npm run start --workspace=discord-bot`: Start the Discord bot.
- `npm run start --workspace=leetcodeapi`: Start the API server.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
