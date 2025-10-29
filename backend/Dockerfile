# Multi-stage build för optimal Docker image

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Kopiera package files
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build (om ni har TypeScript eller behöver builda)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm ci
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Skapa non-root user för säkerhet
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Kopiera dependencies från deps stage
COPY --from=deps /app/node_modules ./node_modules

# Kopiera applikationskod
COPY . .

# Ändra ägare till non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponera port
EXPOSE 3000

# Miljövariabler
ENV NODE_ENV=production

# Health check (Render kommer att använda detta)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
	CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Starta applikationen
CMD ["node", "server.js"]

