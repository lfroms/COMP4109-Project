import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { printNewConnection } from './generic';
// import { sendNewMessage } from './messaging';
import { joinRoom } from './chatRooms';
import { userRegister } from './user';

export default function initialize(server: Server) {
  const io = new SocketIOServer(server);

  // Initialize socket events
  printNewConnection(io);
  // sendNewMessage(io);
  joinRoom(io);
  userRegister(io);
}
