# Stage 1: Build the frontend and backend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production execution environment
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/services ./services
COPY --from=builder /app/skills ./skills


EXPOSE 3000
CMD ["node", "dist/server.mjs"]