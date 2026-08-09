# LeetCode Assistant

A TypeScript Discord bot for a curated daily LeetCode sequence, streaks, points, profiles, leaderboards, and bonus challenges.

## Architecture

The runtime is intentionally split into domain, application, infrastructure, Discord, and scheduled-job layers. See `ARCHITECTURE.md` for the dependency rules and `MIGRATION.md` before replacing an older JavaScript installation.

## Requirements

Node.js 24.15+ is required. The bot also requires a Discord application token, a channel ID for scheduled daily posts, and the curated `packages/discord-bot/src/data/daily-list.json` file from the existing project.

## Local setup

```bash
cp packages/discord-bot/.env.example packages/discord-bot/.env
npm install
npm run validate
npm run dev
```

Required environment variables are `TOKEN` and `CHANNEL_ID`. `TIMEZONE` defaults to `UTC`, `CRON_SCHEDULE` defaults to `0 11 * * *`, and successful first submissions for a local calendar date award 10 points by default.

## Commands

`/get-my-daily` returns the assignment for the current local calendar date. Repeated calls return the same assignment.

`/get-bonus-problem` returns LeetCode's active daily challenge as a bonus problem.

`/submit` records one scoring submission per user per local calendar date. It preserves streak and point invariants transactionally in SQLite.

`/profile` shows the invoking user's points, current/highest streak, and logged submission count.

`/leaderboard` displays the top users by points.

`/skip-daily` is restricted to members with Manage Server permission. It consumes the current assignment and replaces it with the next curated problem for the same date.

`/help` lists the supported commands.

## Docker

```bash
cp .env.example .env
docker compose up -d --build
```

Docker stores SQLite state in a named volume and does not bake the database into the image.

## Validation

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run validate` runs the full sequence.

## Important behavior

A `/submit` records participation; it does not verify whether arbitrary pasted code actually passes LeetCode. That behavior is unchanged conceptually from the prior implementation and is isolated behind `SubmitSolution`, so a real verifier can be added later without changing Discord command routing or persistence architecture.

## License

MIT.
