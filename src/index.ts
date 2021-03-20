import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import { Server } from 'http';

import { createConnection } from 'typeorm';
import 'reflect-metadata';

import { ping } from './routes';
import { conversations } from './routes';
import { logRequest } from './middleware';
import { initialize as initializeSocketConnection } from './socket';

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT ?? 3000;

const app = next({ dev });
const requestHandler = app.getRequestHandler();

app
  .prepare()
  .then(createConnection)
  .then(() => {
    const server = express();

    // Middleware
    server.use(bodyParser.json());
    server.use(logRequest);

    // Routes
    server.use(ping);
    server.use(conversations);

    // Route everything else to NextJS frontend
    server.get('*', (req, res) => {
      return requestHandler(req, res);
    });

    // Wrap server and initialize socket
    const httpServer = new Server(server);
    initializeSocketConnection(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  });
