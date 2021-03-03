import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { printNewConnection } from './generic';

export default function initialize(server: Server) {
  const io = new SocketIOServer(server);

  // Initialize socket events
  printNewConnection(io);
}
