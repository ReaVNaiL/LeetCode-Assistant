<p align="center">
  <img alt="LeetCode Display" src="https://github.com/user-attachments/assets/48f14613-c5dd-472b-933b-ad78ce8356e2" />
</p>

<h1 align="center">LeetCode Assistant</h1>


<p align="center">
  <strong>Daily LeetCode practice for Discord.</strong><br />
  Curated problems, scheduled posts, submissions, streaks, profiles, leaderboards, and bonus challenges.
</p>

<p align="center">
  <a href="https://github.com/ReaVNaiL/LeetCode-Assistant/actions/workflows/eslint.yml"><img src="https://github.com/ReaVNaiL/LeetCode-Assistant/actions/workflows/eslint.yml/badge.svg?branch=main" alt="Validate" /></a>
  <a href="https://github.com/ReaVNaiL/LeetCode-Assistant/actions/workflows/docker-publish.yml"><img src="https://github.com/ReaVNaiL/LeetCode-Assistant/actions/workflows/docker-publish.yml/badge.svg?branch=main" alt="Docker Publish" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-24.15%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 24.15+" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://github.com/ReaVNaiL/LeetCode-Assistant/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ReaVNaiL/LeetCode-Assistant?style=flat-square" alt="License" /></a>
  <a href="https://github.com/ReaVNaiL/LeetCode-Assistant/stargazers"><img src="https://img.shields.io/github/stars/ReaVNaiL/LeetCode-Assistant?style=flat-square" alt="GitHub Stars" /></a>
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#commands">Commands</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#configuration">Configuration</a> ·
  <a href="#development">Development</a> ·
  <a href="#contributing">Contributing</a>
</p>

---

## About

LeetCode Assistant is a Discord bot built to make technical interview practice a daily habit. It assigns one problem from a curated LeetCode sequence, posts the assignment automatically, and keeps track of participation through points and streaks.

The bot also includes user profiles, a server leaderboard, an administrator-controlled daily skip, and a bonus command that fetches LeetCode's active daily coding challenge.

## Features

- **Daily problem assignment** — one curated problem is assigned per local calendar day.
- **Scheduled posts** — automatically posts the daily problem to a configured Discord channel.
- **Stable daily selection** — repeated requests on the same day return the same assignment.
- **Submissions and points** — users can log their solution and earn configurable points once per day.
- **Streak tracking** — maintains current and highest solving streaks.
- **Profiles and leaderboard** — exposes personal stats and server rankings.
- **Bonus challenge** — fetches LeetCode's active daily challenge separately from the curated sequence.
- **Persistent state** — SQLite preserves assignments, submissions, points, and streaks across restarts.
- **Docker support** — runs locally or as a persistent Docker Compose service.

## Preview

<table>
  <tr>
    <td align="center"><strong>Daily problem</strong></td>
    <td align="center"><strong>Bot status</strong></td>
  </tr>
  <tr>
    <td align="center">
      <img width="335" src="https://github.com/ReaVNaiL/LeetCode-Assistant/assets/59776018/7839bbed-9574-4e37-a494-4f39c596f850" alt="LeetCode Assistant daily problem" />
    </td>
    <td align="center">
      <img width="335" src="https://github.com/ReaVNaiL/LeetCode-Assistant/assets/59776018/e3cf5b5c-3585-4d1b-8e47-a12a7c1ea948" alt="LeetCode Assistant bot status" />
    </td>
  </tr>
</table>

## Commands

| Command | Description | Permission |
| --- | --- | --- |
| `/get-my-daily` | Returns today's curated LeetCode assignment. | Everyone |
| `/get-bonus-problem` | Returns LeetCode's active daily coding challenge. | Everyone |
| `/submit` | Records a code snippet or submission link for today's problem. | Everyone |
| `/profile` | Shows your points, current streak, highest streak, and solved count. | Everyone |
| `/leaderboard` | Shows the top users by total points. | Everyone |
| `/skip-daily` | Replaces today's assignment with the next curated problem. | Manage Server |
| `/help` | Lists the supported commands. | Everyone |

> [!NOTE]
> `/submit` records participation. The bot does not execute pasted code or verify that a LeetCode submission was accepted.

## Quick Start

### Requirements

- [Node.js](https://nodejs.org/) **24.15.0 or newer** for local development
- npm
- A Discord application and bot token
- A Discord channel ID for scheduled daily posts
- `packages/discord-bot/src/data/daily-list.json`

### Docker Compose

Docker Compose is the simplest way to run the bot as a persistent service.

```bash
git clone https://github.com/ReaVNaiL/LeetCode-Assistant.git
cd LeetCode-Assistant
cp .env.example .env
```

Configure `.env`:

```env
TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_daily_problem_channel_id_here
CRON_SCHEDULE=0 11 * * *
TIMEZONE=UTC
POINTS_PER_SUBMISSION=10
```

Start the bot:

```bash
docker compose up -d --build
```

Follow logs:

```bash
docker compose logs -f discord-bot
```

Stop the service:

```bash
docker compose down
```

The SQLite database is stored in the `leetcode-bot-data` Docker volume, so normal container rebuilds do not erase user progress.

### Local Development

```bash
git clone https://github.com/ReaVNaiL/LeetCode-Assistant.git
cd LeetCode-Assistant
npm install
cp packages/discord-bot/.env.example packages/discord-bot/.env
npm run validate
npm run dev
```

A local bot environment can look like this:

```env
TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_daily_problem_channel_id_here
CRON_SCHEDULE=0 11 * * *
TIMEZONE=America/New_York
POINTS_PER_SUBMISSION=10
DATABASE_PATH=./src/data/bot-database.sqlite
DAILY_LIST_PATH=./src/data/daily-list.json
```

For a production-style local run:

```bash
npm run build
npm start
```

## Discord Setup

<details>
<summary><strong>Create and invite the Discord bot</strong></summary>

### 1. Create the application

1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select **New Application** and choose a name.
3. Open the **Bot** section and create the bot user if necessary.
4. Reset/copy the bot token and store it securely.

> [!IMPORTANT]
> Never commit the Discord bot token to Git. Keep it in `.env` or your deployment platform's secret store.

### 2. Generate an invite

Open **OAuth2 → URL Generator** and select:

- `bot`
- `applications.commands`

Grant the bot permission to view the target channel, send messages, and use application commands. Open the generated URL and authorize the bot for your server.

### 3. Get the channel ID

1. In Discord, open **User Settings → Advanced**.
2. Enable **Developer Mode**.
3. Right-click the channel that should receive daily problems.
4. Select **Copy Channel ID**.
5. Set that value as `CHANNEL_ID`.

The runtime only requests the Discord `Guilds` gateway intent.

</details>

## Configuration

Configuration is loaded from environment variables and validated during startup.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `TOKEN` | Yes | — | Discord bot token. |
| `CHANNEL_ID` | Yes | — | Channel used for scheduled daily posts. |
| `CRON_SCHEDULE` | No | `0 11 * * *` | Cron expression for the daily post. |
| `TIMEZONE` | No | `UTC` | IANA timezone used for daily assignments, schedules, and streak dates. |
| `POINTS_PER_SUBMISSION` | No | `10` | Points awarded for the first scoring submission of the day. |
| `DATABASE_PATH` | No | `./src/data/bot-database.sqlite` | SQLite database path for local execution. |
| `DAILY_LIST_PATH` | No | `./src/data/daily-list.json` | Path to the curated problem sequence. |

`DISCORD_TOKEN` and `DISCORD_CHANNEL_ID` are accepted as fallback names for `TOKEN` and `CHANNEL_ID`.

### Scheduling

The default schedule:

```env
CRON_SCHEDULE=0 11 * * *
TIMEZONE=UTC
```

posts at 11:00 AM UTC every day.

For 9:00 AM Eastern time:

```env
CRON_SCHEDULE=0 9 * * *
TIMEZONE=America/New_York
```

The same timezone is used when deciding which calendar day a submission belongs to.

## Daily Problem List

The curated sequence lives at:

```text
packages/discord-bot/src/data/daily-list.json
```

The file maps LeetCode problem URLs to a category/type. Entry order defines the initial progression order.

```json
{
  "https://leetcode.com/problems/two-sum/": "Array",
  "https://leetcode.com/problems/valid-parentheses/": "Stack",
  "https://leetcode.com/problems/merge-two-sorted-lists/": "Linked List"
}
```

At startup, the list seeds SQLite when the `daily_problems` table is empty. Once the database has been initialized, existing persisted progression is not overwritten automatically.

Problem title and difficulty are resolved from LeetCode when an assignment is displayed. If metadata lookup fails, the stored assignment remains unchanged and the bot falls back to information derived from the problem URL.

## Daily Assignments and Streaks

The first request for a calendar date assigns the next available curated problem in SQLite. Every request for that same local date returns the same assignment.

```text
Monday    -> Problem 1
Tuesday   -> Problem 2
Wednesday -> Problem 3
```

`/skip-daily` marks the current assignment as consumed and assigns the next available problem to the same date. The command requires Discord's **Manage Server** permission.

A user's first `/submit` for the day awards points and updates streak state. Additional submissions on the same day can be detected as duplicates and do not award another scoring submission. Missing a calendar day breaks the current streak; the highest streak is preserved.

## Data and Persistence

Local state is stored in SQLite at:

```text
packages/discord-bot/src/data/bot-database.sqlite
```

The database stores:

| Data | Purpose |
| --- | --- |
| Users | Discord identity, points, current streak, highest streak, last submission date |
| Submissions | Submitted content, daily problem, timestamp, and awarded points |
| Daily problems | Curated progression and persisted daily assignments |

SQLite foreign keys and WAL mode are enabled during startup.

> [!WARNING]
> Back up `bot-database.sqlite` before manual schema changes or migrations. When using Docker, avoid `docker compose down -v` unless you intentionally want to delete the persisted database volume.

## Development

The repository uses npm workspaces. Run development commands from the repository root.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Discord bot with TypeScript watch mode. |
| `npm run build` | Compile TypeScript to `dist`. |
| `npm start` | Run the compiled application. |
| `npm run typecheck` | Run TypeScript checking without emitting files. |
| `npm run lint` | Run ESLint. |
| `npm run lint:fix` | Apply available ESLint fixes. |
| `npm run test` | Run the regression test suite. |
| `npm run format` | Format TypeScript and JSON with Prettier. |
| `npm run format:check` | Check formatting without modifying files. |
| `npm run validate` | Run typecheck, lint, tests, and build. |

Before opening a pull request, run:

```bash
npm run validate
```

### Continuous Integration

The `Validate` GitHub Actions workflow runs on pushes and pull requests targeting `main` and checks:

```text
typecheck -> lint -> test -> build
```

The `Publish Discord Bot Image` workflow builds the bot image and publishes it to GitHub Container Registry on pushes to `main`, version tags matching `v*`, or a manual workflow dispatch.

Published image:

```text
ghcr.io/reavnail/leetcode-discord-bot:latest
```

## Repository Layout

```text
LeetCode-Assistant/
├── .github/
│   └── workflows/             # CI validation and container publishing
├── packages/
│   └── discord-bot/
│       ├── src/
│       │   ├── application/   # Bot operations and use cases
│       │   ├── config/        # Environment configuration
│       │   ├── data/          # Curated problem data and local SQLite state
│       │   ├── discord/       # Slash commands, routing, and message formatting
│       │   ├── domain/        # Problem, user, submission, and streak rules
│       │   ├── infrastructure/# SQLite, LeetCode HTTP, time, and seed adapters
│       │   ├── jobs/          # Scheduled daily post and streak reset
│       │   └── main.ts        # Application entry point
│       ├── tests/
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

For most contributions:

- Add or modify slash commands in `packages/discord-bot/src/discord/commands/`.
- Change Discord output in `packages/discord-bot/src/discord/presenters/`.
- Change bot behavior in `packages/discord-bot/src/application/use-cases/`.
- Change persistence in `packages/discord-bot/src/infrastructure/database/`.
- Add regression coverage in `packages/discord-bot/tests/`.

## Troubleshooting

<details>
<summary><strong>Slash commands do not appear</strong></summary>

Confirm that the bot was invited with the `applications.commands` scope, successfully logged in, and is a member of the server. Commands are registered per guild when the client becomes ready, so restart the bot after changing command definitions.

</details>

<details>
<summary><strong>Scheduled posts run at the wrong time</strong></summary>

Check both values together:

```env
CRON_SCHEDULE=0 11 * * *
TIMEZONE=America/New_York
```

`CRON_SCHEDULE` defines the clock time. `TIMEZONE` defines which timezone that clock time belongs to.

</details>

<details>
<summary><strong>The bot cannot find the daily problem list</strong></summary>

Confirm that this file exists:

```text
packages/discord-bot/src/data/daily-list.json
```

or set `DAILY_LIST_PATH` to the correct location.

</details>

<details>
<summary><strong>LeetCode title or difficulty is unavailable</strong></summary>

Problem metadata is retrieved when an assignment is displayed. A temporary LeetCode request failure does not advance or replace the persisted daily assignment; the bot falls back to metadata derived from the URL where possible.

</details>

## Contributing

Contributions are welcome. Create a feature branch, keep changes focused, add or update tests for behavior changes, and run the validation suite before opening a pull request.

```bash
npm run validate
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

## License

LeetCode Assistant is available under the [MIT License](LICENSE).

---

<div align="center">

Built with [TypeScript](https://www.typescriptlang.org/), [discord.js](https://discord.js.org/), SQLite, and Docker.

[Report a bug](https://github.com/ReaVNaiL/LeetCode-Assistant/issues) · [Request a feature](https://github.com/ReaVNaiL/LeetCode-Assistant/issues)

</div>
