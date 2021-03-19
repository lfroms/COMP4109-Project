import { useEffect, useState } from 'react';
import { SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useConversation(
  conversationId: string
): [MessagePayload[], (m: MessagePayload) => void] {
  const socket = useSocketContext();

  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    socket.on(SocketEvent.MESSAGE, (message: MessagePayload) => {
      setMessages(previousMessages => [...previousMessages, message]);
    });
  }, []);

  function sendMessage(message: MessagePayload) {
    socket.emit(SocketEvent.MESSAGE, message, conversationId);
  }

  return [messages, sendMessage];
}
