//import { useConversation } from 'hooks';
import { Conversation } from '../../models/Conversation';
import { Server, Socket } from 'socket.io';
import { ConversationCreatePayload, SocketEvent } from '../../types';

export default function createConversation(_io: Server, socket: Socket) {
  socket.on(SocketEvent.CREATE_CONVERSATION, async (payload: ConversationCreatePayload) => {

    // TODO: Add users to conversation using payload info
    console.log(payload);

    const conversation = new Conversation();
    conversation.participants = [];
    conversation.messages = [];
    conversation.save();

    const addedConversation = await Conversation.find({ order: { id: "DESC" }, take: 1});
    const conversationId = addedConversation[0].id.toString();

    socket.join(conversationId);
    socket.emit("conversationId", conversationId);

    // TODO: Join all participants to the conversation.
  });
}
