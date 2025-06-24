// backend/drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema.ts',
    out: './drizzle',
    // --- FIX: เปลี่ยนจาก driver เป็น dialect และเปลี่ยนค่า "pg" เป็น "postgresql" ---
    dialect: 'postgresql',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
} satisfies Config;