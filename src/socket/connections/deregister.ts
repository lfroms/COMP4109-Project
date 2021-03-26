import { Server, Socket } from 'socket.io';
import { Connection } from '../../models/Connection';
import { log } from '../../helpers';
import { SocketEvent } from '../../types';

export default function deregister(_io: Server, socket: Socket) {
  async function perform() {
    log(`De-registering any users associated with connection ${socket.id}`, {
      title: 'Connection registration',
    });

    socket.rooms.forEach(room => {
      socket.leave(room);
    });

    Connection.delete({ socketId: socket.id });
  }

  socket.on(SocketEvent.DISCONNECT, perform);
  socket.on(SocketEvent.DEREGISTER_CONNECTION, perform);
}
