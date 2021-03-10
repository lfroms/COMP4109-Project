import { SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useJoinChat() {
  const socket = useSocketContext();

  function joinConversation(conversationId: string) {
    socket.emit(SocketEvent.JOIN_CONVERSATION, conversationId);
  }

  return joinConversation;
}
