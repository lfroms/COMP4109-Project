import { ConversationCreatePayload, SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useCreateConversation() {
  const socket = useSocketContext();

  function createConversation(payload: ConversationCreatePayload) {
    socket.emit(SocketEvent.CREATE_CONVERSATION, payload);
  }

  return createConversation;
}
