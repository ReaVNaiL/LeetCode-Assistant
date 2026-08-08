FROM node:18-alpine

WORKDIR /app

# Copy root workspace manifests
COPY package*.json ./
COPY packages/leetcode-api/package*.json ./packages/leetcode-api/

# Install dependencies for leetcode-api package
RUN npm ci --omit=dev --workspace=packages/leetcode-api

# Copy API source code
COPY packages/leetcode-api ./packages/leetcode-api

WORKDIR /app/packages/leetcode-api

EXPOSE 50520

CMD ["node", "index.js"]
