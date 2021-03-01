import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';

const dev = process.env.NODE_ENV !== 'production';
const PORT = 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  server.get('/api', (_req, res) => {
    return res.json({ message: 'Hello, World!' });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
