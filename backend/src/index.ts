import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const app = new Elysia()
  .use(cors())
  .get('/todos', () => db.todo.findMany({ orderBy: { id: 'asc' } }))
  .post('/todos', ({ body }) => db.todo.create({ data: body }), {
    body: t.Object({ task: t.String(), description: t.String() })
  })
  .put('/todos/:id', ({ params, body }) =>
    db.todo.update({
      where: { id: Number(params.id) },
      data: body
    }), {
    params: t.Object({ id: t.String() }),
    body: t.Object({ completed: t.Boolean() })
  })
  .delete('/todos/:id', ({ params }) =>
    db.todo.delete({ where: { id: Number(params.id) } }), {
    params: t.Object({ id: t.String() })
  })
  .listen(3000);

console.log(`🦊 Prisma Backend is running at ${app.server?.hostname}:${app.server?.port}`);