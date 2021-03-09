import { useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';

export default function useJoinChat() {
  const socketRef = useRef<typeof Socket>();

  function sendUserId(userName: string) {
    socketRef.current?.emit('register_user', userName);
  }

  function sendRoomId(chatId: string) {
    socketRef.current?.emit('join_room', chatId);
  }

  useEffect(() => {
    // Create a socket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    // Disconnect from the socket
    return () => {
      socketRef.current?.disconnect();
    };
  });

  return [sendRoomId, sendUserId];
}
