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
});

api.get('/top-langs', async (req, res) => {
  try {
    const { userName, limit } = querySchema.parse(req.query);
    const langs = await fetchTopLangs({ userName, limit });
    const svg = renderTopLangs(langs);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/api', api);

export default app;
