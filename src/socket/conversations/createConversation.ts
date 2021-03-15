import { Server, Socket } from 'socket.io';
import { ConversationCreatePayload, SocketEvent } from '../../types';

export default function createConversation(_io: Server, socket: Socket) {
  socket.on(SocketEvent.CREATE_CONVERSATION, (payload: ConversationCreatePayload) => {
    // TODO: Create the conversation in the database and retrieve id.

    // TODO: Replace `id` below with record id from database.
    socket.join(payload.id);

    // TODO: Join all participants to the conversation.
  });
}
