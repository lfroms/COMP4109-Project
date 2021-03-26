import { Server, Socket } from 'socket.io';
import { Conversation } from '../../models/Conversation';
import { Message } from '../../models/Message';
import { User } from '../../models/User';
import { SocketEvent } from '../../types';
import { log } from '../../helpers';

export default function send(io: Server, socket: Socket) {
  socket.on(SocketEvent.MESSAGE, async (payload: EncryptedMessagePayload) => {
    const conversation = await Conversation.findOne(payload.conversationId);

    if (!conversation) {
      log(`Could not find conversation with id ${payload.conversationId}`, { severity: 'error' });

      return;
    }

    const user = await User.findOne(payload.senderId);

    if (!user) {
      log(`Could not find user with id ${payload.senderId}`, { severity: 'error' });

      return;
    }

    const message = new Message();
    message.sender = user;
    message.content = JSON.stringify(payload.data);
    message.conversation = conversation;
    message.hmac = payload.hmac;
    await message.save();

    io.in(payload.conversationId.toString()).emit(SocketEvent.MESSAGE, payload);
  });
}
