import { Server, Socket } from 'socket.io';
import { Message, SocketEvent } from '../../types';
import { log } from '../../helpers';

export default function joinRoom(io: Server) {
  io.on('connection', (socket: Socket) => {
    let currentRoom: string | null = null;

    socket.on(SocketEvent.JOIN_CONVERSATION, (conversationId: string) => {
      currentRoom = conversationId;
      socket.join(conversationId);

      log('Joined room');
    });

    socket.on(SocketEvent.MESSAGE, (message: Message) => {
      if (!currentRoom) {
        log('Attempted to send message without a room.', { severity: 'error' });

        return;
      }

      io.sockets.in(currentRoom).emit(SocketEvent.MESSAGE, message);
    });
  });
}
