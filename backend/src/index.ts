// backend/src/index.ts

import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import postgres from 'postgres';

const sql = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

console.log('Backend is starting...');

const app = new Elysia()
    .use(cors())

    // --- FIX: เราจะใช้ Response.json() เพื่อให้แน่ใจว่าเป็น JSON response เสมอ ---

    // R: Read all todos
    .get('/todos', async () => {
        const todos = await sql`SELECT * FROM todos ORDER BY id ASC`;
        // บังคับให้ response เป็น JSON และตั้งค่า Header ถูกต้อง
        return new Response(JSON.stringify(todos), {
            headers: { 'Content-Type': 'application/json' },
        });
    })

    // C: Create a new todo
    .post('/todos', async ({ body }) => {
        const [newTodo] = await sql`
      INSERT INTO todos (task, completed)
      VALUES (${body.task}, false)
      RETURNING *
    `;
        return new Response(JSON.stringify(newTodo), {
            headers: { 'Content-Type': 'application/json' },
        });
    }, {
        body: t.Object({
            task: t.String()
        })
    })

    // U: Update a todo (toggle completed status)
    .put('/todos/:id', async ({ params, body }) => {
        const [updatedTodo] = await sql`
      UPDATE todos
      SET completed = ${body.completed}
      WHERE id = ${params.id}
      RETURNING *
    `;
        return new Response(JSON.stringify(updatedTodo), {
            headers: { 'Content-Type': 'application/json' },
        });
    }, {
        params: t.Object({ id: t.Numeric() }),
        body: t.Object({ completed: t.Boolean() })
    })

    // D: Delete a todo
    .delete('/todos/:id', async ({ params }) => {
        await sql`
      DELETE FROM todos
      WHERE id = ${params.id}
    `;
        // สำหรับ Delete เราส่ง status ว่างๆ กลับไปก็พอ
        return new Response(null, { status: 204 });
    }, {
        params: t.Object({ id: t.Numeric() })
    })

    .listen(3000);

console.log(`🦊 Elysia is running at <span class="math-inline">\{app\.server?\.hostname\}\:</span>{app.server?.port}`);