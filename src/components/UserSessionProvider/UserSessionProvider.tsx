import React, { createContext } from 'react';
import { useSessionStorage } from 'hooks';
import { StorageKey } from 'types';

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
  const { set: setUserId, remove: clearUserId, value: userId } = useSessionStorage(
    StorageKey.USER_ID
  );

  function signIn(username: string, password: string) {
    setUserId(username);
    console.log(password);
  }

  function signOut() {
    clearUserId();
  }

  return (
    <UserSessionContext.Provider value={{ userId, signIn, signOut }}>
      {children}
    </UserSessionContext.Provider>
  );
}
