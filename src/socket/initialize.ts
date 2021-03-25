import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

import {
  create as createConversation,
  subscribe as subscribeToConversations,
} from './conversations';
import { send as sendMessage } from './messages';

export default function initialize(server: Server) {
  const io = new SocketIOServer(server);

  io.on('connection', (socket: Socket) => {
    createConversation(io, socket);
    subscribeToConversations(io, socket);
    sendMessage(io, socket);
  });
}
