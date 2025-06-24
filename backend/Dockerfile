FROM oven/bun:1
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000
CMD sh -c "bun run db:migrate && bun run src/index.ts"