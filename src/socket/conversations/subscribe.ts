import { Server, Socket } from 'socket.io';
import { User } from '../../models/User';
import { SocketEvent } from '../../types';
import { log } from '../../helpers';

export default function subscribe(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.SUBSCRIBE_TO_CONVERSATIONS,
    async (payload: ConversationsSubscribePayload) => {
      const { userId } = payload;

      const user = await User.findOne(userId, { relations: ['conversations'] });

      if (!user) {
        log(`Could not subscribe user ${userId} as the user could not be found`, {
          severity: 'error',
        });

        return;
      }

      const conversationIds = user.conversations.map(conversation => conversation.id);

      conversationIds.forEach(id => {
        log(`Subscribing user ${userId} to conversation ${id}`, { title: 'Subscription' });
        socket.join(id.toString());
      });
    }
  );
}
