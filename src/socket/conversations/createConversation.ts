import { Conversation } from '../../models/Conversation';
import { Server, Socket } from 'socket.io';
import { User } from '../../models/User';
import { PersonalConversationKey } from '../../models/PersonalConversationKey';
import { SocketEvent } from '../../types';
import { log } from '../../helpers';

export default function createConversation(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.CREATE_CONVERSATION,
    async (payload: ConversationCreatePayload, callback) => {
      const { participantMetadata } = payload;

      const participantIds = participantMetadata.map(participant => participant.id);
      const participants = await User.findByIds(participantIds);

      const conversation = new Conversation();
      conversation.participants = participants;
      await conversation.save();

      participantMetadata.forEach(async participant => {
        const user = await User.findOne(participant.id);

        if (!user) {
          log('Not creating personal conversation key because the user was not found.', {
            severity: 'warning',
          });

          return;
        }

        const personalConversationKey = new PersonalConversationKey();
        personalConversationKey.user = user;
        personalConversationKey.conversation = conversation;
        personalConversationKey.value = participant.personalConversationKey;
        await personalConversationKey.save();
      });

      // TODO: Join all participants to the conversation, not just the current one.
      socket.join(conversation.id.toString());

      callback(conversation.id);
    }
  );
}
