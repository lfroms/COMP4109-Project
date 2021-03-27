import { Conversation } from '../../models/Conversation';
import { Server, Socket } from 'socket.io';
import { User } from '../../models/User';
import { Connection } from '../../models/Connection';
import { PersonalConversationKey } from '../../models/PersonalConversationKey';
import { SocketEvent } from '../../types';
import { log } from '../../helpers';

export default function create(io: Server, socket: Socket) {
  socket.on(
    SocketEvent.CREATE_CONVERSATION,
    async (payload: ConversationCreatePayload, callback) => {
      const { participantMetadata } = payload;

      const participantIds = participantMetadata.map(participant => participant.id);
      const participants = await User.findByIds(participantIds);

      const conversation = new Conversation();
      conversation.participants = participants;
      await conversation.save();

      participants.forEach(participant => {
        const metadata = participantMetadata.find(metadata => metadata.id === participant.id);

        if (!metadata) {
          log(`Could not set up user ${participant.id} for conversation ${conversation.id}`, {
            title: 'Participant setup',
            severity: 'error',
          });

          return;
        }

        savePersonalConversationKey(participant, conversation, metadata);
        notifyParticipant(participant, conversation, io);
      });

      callback(conversation.id);
    }
  );
}

async function savePersonalConversationKey(
  user: User,
  conversation: Conversation,
  metadata: ParticipantMetadata
) {
  const personalConversationKey = new PersonalConversationKey();
  personalConversationKey.user = user;
  personalConversationKey.conversation = conversation;
  personalConversationKey.value = metadata.personalConversationKey;
  personalConversationKey.hmacKey = metadata.hmac;
  await personalConversationKey.save();
}

async function notifyParticipant(user: User, conversation: Conversation, io: Server) {
  const connections = await Connection.find({ user });

  if (!connections) {
    return;
  }

  connections.forEach(connection => {
    io.sockets.sockets.get(connection.socketId)?.emit(SocketEvent.NOTIFY_CONVERSATIONS);
    io.sockets.sockets.get(connection.socketId)?.join(conversation.id.toString());
  });
}
