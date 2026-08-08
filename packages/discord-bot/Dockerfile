FROM node:18-alpine

WORKDIR /app

# Copy root workspace manifests
COPY package*.json ./
COPY packages/discord-bot/package*.json ./packages/discord-bot/

# Install dependencies for discord-bot package
RUN npm ci --omit=dev --workspace=packages/discord-bot

# Copy Bot source code
COPY packages/discord-bot ./packages/discord-bot

WORKDIR /app/packages/discord-bot

CMD ["node", "index.js"]
