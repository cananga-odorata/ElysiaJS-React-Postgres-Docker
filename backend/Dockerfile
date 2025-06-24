# Stage 1: Install dependencies and build Prisma Client
FROM oven/bun:1 AS builder

# --- FIX: ใช้ apt-get ซึ่งเป็นคำสั่งที่ถูกต้องสำหรับ Image นี้ ---
RUN apt-get update && apt-get install -y --no-install-recommends openssl

WORKDIR /app
COPY package.json bun.lockb* ./
COPY prisma ./prisma/

RUN bun install --frozen-lockfile
RUN bunx prisma generate

# Stage 2: Create the final image
FROM oven/bun:1

# --- FIX: ติดตั้ง openssl ใน final image ด้วย ---
RUN apt-get update && apt-get install -y --no-install-recommends openssl

WORKDIR /app

# Copy สิ่งที่จำเป็นจาก stage แรก
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma/
COPY src ./src

EXPOSE 3000

# คำสั่งนี้ถูกต้องแล้ว ไม่ต้องแก้
CMD sh -c "bunx prisma migrate deploy && bun run src/index.ts"