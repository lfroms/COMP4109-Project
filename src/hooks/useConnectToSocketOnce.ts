import { useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';

export default function useConnectToSocketOnce() {
  const socketRef = useRef<typeof Socket>();

  useEffect(() => {
    // Create a socket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    // Disconnect from the socket
    return () => {
      socketRef.current?.disconnect();
    };
  });
}
