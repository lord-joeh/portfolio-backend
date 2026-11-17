# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache wget


RUN chown -R node:node /app

COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

# Provide an option for passing env vars
ENV NODE_ENV=production
ENV PORT=3000

USER node

EXPOSE 3000

CMD ["node", "dist/main"]
