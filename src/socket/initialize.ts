import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { printNewConnection } from './generic';
import { joinRoom } from './chatRooms';
import { userRegister } from './user';

export default function initialize(server: Server) {
  const io = new SocketIOServer(server);

  printNewConnection(io);
  joinRoom(io);
  userRegister(io);
}
