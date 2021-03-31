import React, { createContext, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useUserSession } from 'hooks';
import { SocketEvent } from 'types';

const SOCKET_SERVER_URL = '/';

const socket = socketIOClient(SOCKET_SERVER_URL, {
  autoConnect: false,
  query: {},
});
export const SocketContext = createContext<SocketIOClient.Socket>(socket);

interface Props {
  children: React.ReactNode;
}

export default function SocketContextProvider({ children }: Props) {
  const { user } = useUserSession();

  useEffect(() => {
    if (!user) {
      socket.emit(SocketEvent.DEREGISTER_CONNECTION);

      if (socket.io.opts.query) {
        socket.io.opts.query['token'] = undefined;
      }

      socket.close();

      return;
    }

    if (socket.io.opts.query && socket.io.opts.query['token'] !== user.token) {
      socket.close();
      socket.io.opts.query['token'] = user.token;
      socket.open();

      const connectionRegistrationPayload: ConnectionRegisterPayload = {
        userId: user.id,
      };

      socket.emit(SocketEvent.REGISTER_CONNECTION, connectionRegistrationPayload);
    }
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
