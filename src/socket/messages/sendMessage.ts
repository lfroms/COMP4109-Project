import { Server, Socket } from 'socket.io';
import { Message } from '../../models/Message';
import { Conversation } from '../../models/Conversation';
import { SocketEvent } from '../../types';

export default function sendMessage(io: Server, socket: Socket) {
  socket.on(SocketEvent.MESSAGE, async (messagePayload: MessagePayload, conversationId: string) => {
    const conversation = await Conversation.findOne(conversationId);
    if (!conversation) {
      return;
    }

    const message = new Message();
    message.conversation = conversation;
    message.content = messagePayload.data;
    await message.save();

    io.sockets.in(conversationId).emit(SocketEvent.MESSAGE, messagePayload);
  });
}
