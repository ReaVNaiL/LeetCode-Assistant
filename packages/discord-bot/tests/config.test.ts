import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { loadConfig } from '../src/config/app-config';

test('config resolves package-relative defaults and typed values', () => {
  const baseDir = path.resolve('/tmp/leetcode-discord-bot');
  const config = loadConfig(
    {
      TOKEN: 'token',
      CHANNEL_ID: 'channel',
      TIMEZONE: 'America/New_York',
      POINTS_PER_SUBMISSION: '25',
    },
    baseDir,
  );

  assert.equal(config.discordToken, 'token');
  assert.equal(config.channelId, 'channel');
  assert.equal(config.timeZone, 'America/New_York');
  assert.equal(config.pointsPerSubmission, 25);
  assert.equal(config.databasePath, path.resolve(baseDir, './src/data/bot-database.sqlite'));
  assert.equal(config.dailyListPath, path.resolve(baseDir, './src/data/daily-list.json'));
});

test('config rejects missing required credentials', () => {
  assert.throws(() => loadConfig({ CHANNEL_ID: 'channel' }, '/tmp/app'), /TOKEN .* is required/);
  assert.throws(() => loadConfig({ TOKEN: 'token' }, '/tmp/app'), /CHANNEL_ID .* is required/);
});

test('config rejects invalid timezones and point values', () => {
  assert.throws(
    () =>
      loadConfig(
        {
          TOKEN: 'token',
          CHANNEL_ID: 'channel',
          TIMEZONE: 'Not/A_Timezone',
        },
        '/tmp/app',
      ),
    /Invalid TIMEZONE/,
  );

  assert.throws(
    () =>
      loadConfig(
        {
          TOKEN: 'token',
          CHANNEL_ID: 'channel',
          POINTS_PER_SUBMISSION: '0',
        },
        '/tmp/app',
      ),
    /positive integer/,
  );
});
