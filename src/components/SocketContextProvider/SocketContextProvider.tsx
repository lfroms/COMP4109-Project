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
  const { token, userId } = useUserSession();

  useEffect(() => {
    if (!token) {
      socket.emit(SocketEvent.DEREGISTER_CONNECTION);

      if (socket.io.opts.query) {
        socket.io.opts.query['token'] = undefined;
      }

      socket.close();

      return;
    }

    if (socket.io.opts.query) {
      if (socket.io.opts.query['token'] !== token) {
        socket.close();
        socket.io.opts.query['token'] = token;
        socket.open();
      }
    }
  }, [token]);

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
