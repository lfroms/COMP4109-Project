import React, { createContext, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useUserSession } from 'hooks';
import { SocketEvent } from 'types';

const SOCKET_SERVER_URL = 'http://localhost:3000';

const socket = socketIOClient(SOCKET_SERVER_URL, {
  autoConnect: false,
  query: {},
});
export const SocketContext = createContext<SocketIOClient.Socket>(socket);

interface Props {
  children: React.ReactNode;
}

export default function SocketContextProvider({ children }: Props) {
  const { userId } = useUserSession();

  useEffect(() => {
    if (!userId) {
      socket.emit(SocketEvent.DEREGISTER_CONNECTION);

      if (socket.io.opts.query) {
        socket.io.opts.query['token'] = undefined;
      }

      socket.close();

      return;
    }

    if (socket.io.opts.query) {
      socket.close();
      socket.io.opts.query['token'] = userId;
      socket.open();
    }
  }, [userId]);

  useEffect(() => {
    socket.on(SocketEvent.CONNECT, () => {
      if (!userId) {
        return;
      }

      const connectionRegistrationPayload: ConnectionRegisterPayload = {
        userId,
      };

      socket.emit(SocketEvent.REGISTER_CONNECTION, connectionRegistrationPayload);
    });
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
