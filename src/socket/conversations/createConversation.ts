import { Conversation } from '../../models/Conversation';
import { Server, Socket } from 'socket.io';
import { PersonalConversationKey } from '../../models/PersonalConversationKey';
import { User } from '../../models/User';
import { SocketEvent } from '../../types';

export default function createConversation(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.CREATE_CONVERSATION,
    async (payload: ConversationCreatePayload, callback) => {
      // TODO: Add users to conversation using payload info
      console.log(payload);

      const conversation = new Conversation();
      conversation.participants = [];
      conversation.messages = [];
      await conversation.save();
      //created one user
      const userExample = new User();
      userExample.conversations = [conversation];
      userExample.name = 'khaled';
      userExample.password = '4109';
      userExample.publicKey = payload.publicEncryptionKey;
      await userExample.save();
      //created one PCK
      const personalConversationKey = new PersonalConversationKey();
      personalConversationKey.conversation = conversation;
      personalConversationKey.user = userExample;
      personalConversationKey.value = payload.personalConversationKey;
      await personalConversationKey.save();

      socket.join(conversation.id.toString());

      callback(conversation.id);
      // TODO: Join all participants to the conversation.
    }
  );
}
