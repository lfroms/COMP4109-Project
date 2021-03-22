import { SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useCreateConversation() {
  const socket = useSocketContext();

  function createConversation(payload: ConversationCreatePayload) {
    console.log(payload);

    return new Promise(resolve => {
      socket.emit(SocketEvent.CREATE_CONVERSATION, payload, (conversationId: number) => {
        resolve(conversationId);
      });
    });
  }

  return createConversation;
}
