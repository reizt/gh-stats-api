import express from 'express';

const app = express();

app.get('/api', (req, res) => {
  res.send('Hello World!!!!!');
});

app.get('/api/nested', (req, res) => {
  res.send('Nested Hello World!!!!!');
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

export default app;
