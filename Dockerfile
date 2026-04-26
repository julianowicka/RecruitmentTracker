# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL=/app/data/sqlite.db

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
RUN mkdir -p /app/data

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3001/api/health', (r) => { if (r.statusCode !== 200) throw new Error('unhealthy'); })"

CMD ["npm", "run", "start"]


