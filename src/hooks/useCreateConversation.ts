import { ConversationCreatePayload, SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useCreateConversation() {
  const socket = useSocketContext();

  function createConversation(payload: ConversationCreatePayload) {
    return new Promise((resolve, _reject) => {
      socket.emit(SocketEvent.CREATE_CONVERSATION, payload, (conversationId: number) => {
        resolve(conversationId);
      });
    });
  }

  return createConversation;
}
