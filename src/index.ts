import { Hono } from 'hono';
import { handler } from './handler';

const app = new Hono();
app.get('/', async (c) => c.text('Hello, World!'));
app.get('/langs', async (c) => handler(c.req.raw));

export default app;
