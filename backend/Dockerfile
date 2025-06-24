# ใช้ Bun เป็น base image
FROM oven/bun:1

# ตั้งค่า working directory
WORKDIR /app

# Copy package.json และ lock file
COPY package.json bun.lockb* ./

# ติดตั้ง dependencies
RUN bun install --frozen-lockfile

# Copy โค้ดที่เหลือ
COPY . .

# เปิด Port 3000 ของ Elysia
EXPOSE 3000

# รัน dev server
CMD [ "bun", "run", "dev" ]