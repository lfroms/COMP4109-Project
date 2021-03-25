import { Server, Socket } from 'socket.io';
import { Conversation } from '../../models/Conversation';
import { Message } from '../../models/Message';
import { User } from '../../models/User';
import { SocketEvent } from '../../types';
import { log } from '../../helpers';

export default function send(io: Server, socket: Socket) {
  socket.on(
    SocketEvent.MESSAGE,
    async (messagePayload: EncryptedMessagePayload, conversationId: string) => {
      const conversation = await Conversation.findOne(conversationId);
      if (!conversation) {
        log(`Could not find conversation with id ${conversationId}`, { severity: 'error' });

        return;
      }

      const user = await User.findOne(messagePayload.senderId);
      if (!user) {
        log(`Could not find user with id ${messagePayload.senderId}`, { severity: 'error' });

        return;
      }

      const message = new Message();
      message.sender = user;
      message.content = JSON.stringify(messagePayload.data);
      message.conversation = conversation;
      message.hmac = JSON.stringify(messagePayload.mac);
      await message.save();

      // TODO: Remove this once we can autojoin all participants.
      socket.join(conversationId);

      io.sockets.in(conversationId).emit(SocketEvent.MESSAGE, messagePayload);
    }
  );
}
