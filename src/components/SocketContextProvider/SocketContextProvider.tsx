import React, { createContext, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { useUserSession } from 'hooks';
import { SocketEvent } from 'types';

const SOCKET_SERVER_URL = 'http://localhost:3000';

const defaultSocket = socketIOClient(SOCKET_SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
});
export const SocketContext = createContext<SocketIOClient.Socket>(defaultSocket);

interface Props {
  children: React.ReactNode;
}

export default function SocketContextProvider({ children }: Props) {
  const { userId } = useUserSession();
  const socketClientRef = useRef<SocketIOClient.Socket>(defaultSocket);

  useEffect(() => {
    if (!userId) {
      socketClientRef.current?.close();

      return;
    }

    if (socketClientRef.current) {
      socketClientRef.current.close();
    }

    socketClientRef.current = socketIOClient(SOCKET_SERVER_URL, {
      autoConnect: true,
      reconnectionAttempts: 5,
      query: {
        token: userId,
      },
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const connectionRegistrationPayload: ConnectionRegisterPayload = {
      userId,
    };

    socketClientRef.current.emit(SocketEvent.REGISTER_CONNECTION, connectionRegistrationPayload);
  }, [userId]);

  return (
    <SocketContext.Provider value={socketClientRef.current}>{children}</SocketContext.Provider>
  );
}
