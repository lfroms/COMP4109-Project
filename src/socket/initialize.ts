import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { log } from '../helpers';

import { createConversation } from './conversations';
import { sendMessage } from './messages';

export default function initialize(server: Server) {
  const io = new SocketIOServer(server);

  io.on('connection', (socket: Socket) => {
    log('New socket connection', { title: 'SOCKET' });

    createConversation(io, socket);
    sendMessage(io, socket);
  });
}
