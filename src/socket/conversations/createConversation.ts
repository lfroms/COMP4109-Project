import { Conversation } from '../../models/Conversation';
import { Server, Socket } from 'socket.io';
import { ConversationCreatePayload, SocketEvent } from '../../types';

export default function createConversation(_io: Server, socket: Socket) {
  socket.on(SocketEvent.CREATE_CONVERSATION, async (payload: ConversationCreatePayload, callback) => {
    // TODO: Add users to conversation using payload info
    console.log(payload);

    const conversation = new Conversation();
    conversation.participants = [];
    conversation.messages = [];
    await conversation.save();

    socket.join(conversation.id.toString());
    socket.emit('conversationId', conversation.id);

    callback(conversation.id);
    // TODO: Join all participants to the conversation.
  });
}
