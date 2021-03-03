import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';

import { ping } from './routes';
import { logRequest } from './middleware';

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT ?? 3000;

const app = next({ dev });
const requestHandler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(bodyParser.json());
  server.use(logRequest);

  // Routes
  server.use(ping);

  // Route everything else to NextJS frontend
  server.get('*', (req, res) => {
    return requestHandler(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
