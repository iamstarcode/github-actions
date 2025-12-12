# apps/express-api/Dockerfile

# ----------------------------
# 1️⃣ Base image
# ----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only necessary files
COPY package.json pnpm-lock.yaml ./
COPY src ./src

# Install only prod deps (assuming your build step compiles to dist)
RUN npm install -g pnpm && pnpm install --prod

# ----------------------------
# 2️⃣ Runtime image
# ----------------------------
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["pnpm", "start"]
