import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../../types';

export default function joinConversation(_io: Server, socket: Socket) {
  socket.on(SocketEvent.JOIN_CONVERSATION, (conversationId: string) => {
    socket.join(conversationId);
  });
}
