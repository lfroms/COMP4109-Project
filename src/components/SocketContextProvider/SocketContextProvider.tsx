import React, { createContext } from 'react';
import socketIOClient from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';

export const SocketContext = createContext<SocketIOClient.Socket | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

const socketClient = socketIOClient(SOCKET_SERVER_URL);

export default function SocketContextProvider({ children }: Props) {
  return <SocketContext.Provider value={socketClient}>{children}</SocketContext.Provider>;
}
