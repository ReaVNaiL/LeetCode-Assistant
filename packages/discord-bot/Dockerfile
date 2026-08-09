FROM node:24-alpine AS build

WORKDIR /app
COPY package.json ./
COPY packages/discord-bot/package.json ./packages/discord-bot/package.json
RUN npm install --workspace=packages/discord-bot

COPY packages/discord-bot ./packages/discord-bot
RUN npm run build --workspace=discord-bot

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/bot-database.sqlite
ENV DAILY_LIST_PATH=/app/packages/discord-bot/src/data/daily-list.json

COPY package.json ./
COPY packages/discord-bot/package.json ./packages/discord-bot/package.json
RUN npm install --omit=dev --workspace=packages/discord-bot

COPY --from=build /app/packages/discord-bot/dist ./packages/discord-bot/dist
COPY --from=build /app/packages/discord-bot/src/data ./packages/discord-bot/src/data

WORKDIR /app/packages/discord-bot
CMD ["node", "dist/main.js"]
