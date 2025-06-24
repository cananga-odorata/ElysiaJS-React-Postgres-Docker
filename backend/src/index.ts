import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { todos } from './db/schema';
import { eq, asc } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: { todos } });

const app = new Elysia()
    .use(cors())
    .get('/todos', () => db.query.todos.findMany({ orderBy: [asc(todos.id)] }))
    .post('/todos', async ({ body }) => {
        const [newTodo] = await db.insert(todos).values(body).returning();
        return newTodo;
    }, {
        body: t.Object({ task: t.String() })
    })
    .put('/todos/:id', async ({ params, body }) => {
        const [updatedTodo] = await db.update(todos).set(body).where(eq(todos.id, Number(params.id))).returning();
        return updatedTodo;
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Object({ completed: t.Boolean() })
    })
    .delete('/todos/:id', ({ params }) =>
        db.delete(todos).where(eq(todos.id, Number(params.id))), {
        params: t.Object({ id: t.String() })
    })
    .listen(3000);

console.log(`💧 Drizzle Backend is running at ${app.server?.hostname}:${app.server?.port}`);