import { fetchTopLangs } from '#/core/fetch-top-langs';
import { renderTopLangs } from '#/core/render-top-langs';
import express from 'express';
import { z } from 'zod';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = express.Router();

const querySchema = z.object({
  userName: z.coerce.string(),
  limit: z.coerce.number().int().optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

const handleError = (err: any, res: express.Response) => {
  if (err instanceof z.ZodError) {
    console.log(err.issues);
    res.status(400).send('Bad Request');
    return;
  } else if (err instanceof Error) {
    console.log(err.message);
  } else {
    console.log(err);
  }
  res.status(500).send('Internal Server Error');
};

api.get('/top-langs.svg', async (req, res) => {
  try {
    const { userName, limit, theme } = querySchema.parse(req.query);
    const langs = await fetchTopLangs({ userName, limit: limit ?? 10 });
    const svg = await renderTopLangs({ userName, langs, theme: theme ?? 'light', output: 'svg' });
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    handleError(err, res);
  }
});

api.get('/top-langs.html', async (req, res) => {
  try {
    const { userName, limit, theme } = querySchema.parse(req.query);
    const langs = await fetchTopLangs({ userName, limit: limit ?? 10 });
    const html = await renderTopLangs({ userName, langs, theme: theme ?? 'light', output: 'html' });
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    handleError(err, res);
  }
});

app.use('/api', api);

export default app;
