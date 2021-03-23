import { Server, Socket } from 'socket.io';
import { Message } from '../../models/Message';
import { Conversation } from '../../models/Conversation';
import { SocketEvent } from '../../types';
import { log } from '../../helpers';

export default function sendMessage(io: Server, socket: Socket) {
  socket.on(
    SocketEvent.MESSAGE,
    async (messagePayload: EncryptedMessagePayload, conversationId: string) => {
      const conversation = await Conversation.findOne(conversationId);

      if (!conversation) {
        log(`Could not find conversation with id ${conversationId}`, { severity: 'error' });

        return;
      }

      const message = new Message();
      message.conversation = conversation;
      message.content = JSON.stringify(messagePayload.data);
      await message.save();

      // TODO: Remove this once we can autojoin all participants.
      socket.join(conversationId);

      io.sockets.in(conversationId).emit(SocketEvent.MESSAGE, messagePayload);
    }
  );
}
