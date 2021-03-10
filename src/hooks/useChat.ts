import { useEffect, useState } from 'react';
import { Message, SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useChat(): [Message[], (m: Message) => void] {
  const socket = useSocketContext();

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on(SocketEvent.MESSAGE, (message: Message) => {
      setMessages(previousMessages => [...previousMessages, message]);
    });
  }, []);

  function sendMessage(message: Message) {
    socket.emit(SocketEvent.MESSAGE, message);
  }

  return [messages, sendMessage];
}
