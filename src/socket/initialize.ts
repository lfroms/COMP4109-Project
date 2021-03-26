import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

import {
  create as createConversation,
  subscribe as subscribeToConversations,
} from './conversations';
import { send as sendMessage } from './messages';
import { deregister as deregisterConnection, register as registerConnection } from './connections';

export default function initialize(server: Server) {
  const io = new SocketIOServer(server);

  io.on('connection', (socket: Socket) => {
    registerConnection(io, socket);
    deregisterConnection(io, socket);

    createConversation(io, socket);
    subscribeToConversations(io, socket);

    sendMessage(io, socket);
  });
}
