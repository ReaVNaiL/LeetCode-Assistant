import path from 'node:path';

export interface AppConfig {
  discordToken: string;
  channelId: string;
  cronSchedule: string;
  timeZone: string;
  pointsPerSubmission: number;
  databasePath: string;
  dailyListPath: string;
}

function parsePositiveInteger(value: string | undefined, fallback: number, key: string): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive integer.`);
  }
  return parsed;
}

function validateTimeZone(value: string): string {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date());
    return value;
  } catch {
    throw new Error(`Invalid TIMEZONE value: ${value}`);
  }
}

const PACKAGE_ROOT = path.resolve(__dirname, '../..');

export function loadConfig(env: NodeJS.ProcessEnv, baseDir = PACKAGE_ROOT): AppConfig {
  const token = env.TOKEN?.trim() || env.DISCORD_TOKEN?.trim();
  if (!token) {
    throw new Error('TOKEN (or DISCORD_TOKEN) environment variable is required.');
  }

  const channelId = env.CHANNEL_ID?.trim() || env.DISCORD_CHANNEL_ID?.trim();
  if (!channelId) {
    throw new Error('CHANNEL_ID (or DISCORD_CHANNEL_ID) environment variable is required.');
  }

  const timeZone = validateTimeZone(env.TIMEZONE?.trim() || 'UTC');

  return {
    discordToken: token,
    channelId,
    cronSchedule: env.CRON_SCHEDULE?.trim() || '0 11 * * *',
    timeZone,
    pointsPerSubmission: parsePositiveInteger(
      env.POINTS_PER_SUBMISSION,
      10,
      'POINTS_PER_SUBMISSION',
    ),
    databasePath: path.resolve(
      baseDir,
      env.DATABASE_PATH?.trim() || './src/data/bot-database.sqlite',
    ),
    dailyListPath: path.resolve(
      baseDir,
      env.DAILY_LIST_PATH?.trim() || './src/data/daily-list.json',
    ),
  };
}
