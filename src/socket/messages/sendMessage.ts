import { Server, Socket } from 'socket.io';
import { Message, SocketEvent } from '../../types';

export default function sendMessage(io: Server, socket: Socket) {
  socket.on(SocketEvent.MESSAGE, (message: Message, conversationId: string) => {
    io.sockets.in(conversationId).emit(SocketEvent.MESSAGE, message);
  });
}
