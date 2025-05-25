# Stage 1: Build the application
FROM oven/bun:1 as builder

WORKDIR /app

COPY package.json bun.lock ./
COPY tsconfig*.json ./
COPY src ./src/
COPY nest-cli.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Build the application
RUN bun run build

# Stage 2: Run the application
FROM oven/bun:1 as runner

WORKDIR /app

# Copy production dependencies and build output from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env* ./

# Expose ports for TCP and gRPC (adjust if your .env uses different ports or if you have others)
EXPOSE 3001
EXPOSE 5000

# Command to run the production build
CMD ["bun", "run", "start:prod"]
