import { Server, Socket } from 'socket.io';
import { Message } from '../../models/Message';
import { Conversation } from '../../models/Conversation';
import { SocketEvent } from '../../types';

interface MessagePayload {
  senderId: string;
  data: string;
}

export default function sendMessage(io: Server, socket: Socket) {
  socket.on(SocketEvent.MESSAGE, async (messagePayload: MessagePayload, conversationId: string) => {
    const conversation = await Conversation.find({ where: { id: conversationId } });

    const message = new Message();
    message.conversation = conversation[0];
    message.content = messagePayload.data;
    message.save();

    io.sockets.in(conversationId).emit(SocketEvent.MESSAGE, messagePayload);
  });
}
