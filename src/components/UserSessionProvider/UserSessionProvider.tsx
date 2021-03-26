import React, { createContext, useEffect } from 'react';
import { useSessionStorage, useSocketContext } from 'hooks';
import { SocketEvent, StorageKey } from 'types';

interface UserSession {
  userId?: number;
  signIn: (username: string, password: string) => void;
  signOut: () => void;
}

export const UserSessionContext = createContext<UserSession>({
  signIn: () => {},
  signOut: () => {},
});

interface Props {
  children: React.ReactNode;
}

export default function UserSessionContextProvider({ children }: Props) {
  const socket = useSocketContext();
  const { set: setUserId, remove: clearUserId, value: userId } = useSessionStorage(
    StorageKey.USER_ID
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    const connectionRegistrationPayload: ConnectionRegisterPayload = {
      userId,
    };

    socket.emit(SocketEvent.REGISTER_CONNECTION, connectionRegistrationPayload);
  }, [userId]);

  function signIn(username: string, password: string) {
    setUserId(username);
    console.log(password);
  }

  function signOut() {
    socket.emit(SocketEvent.DEREGISTER_CONNECTION);
    clearUserId();
  }

  return (
    <UserSessionContext.Provider value={{ userId, signIn, signOut }}>
      {children}
    </UserSessionContext.Provider>
  );
}
