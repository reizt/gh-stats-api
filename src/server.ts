import express from 'express';

const app = express();

app.get('/api', (req, res) => {
  res.send('Hello World!!!!!');
});

app.get('/api/nested', (req, res) => {
  res.send('Nested Hello World!!!!!');
});

const router = express.Router();
router.get('/bar', (req, res) => {
  res.send('Bar!!!!!');
});

app.use('/api/foo', router);

export default app;
