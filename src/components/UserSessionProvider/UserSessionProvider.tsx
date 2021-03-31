import React, { createContext, useMemo } from 'react';
import { useStorageState } from 'react-storage-hooks';
import { StorageObj } from 'react-storage-hooks/dist/common';
import { StorageKey } from 'types';
import jwtDecode, { JwtPayload } from 'jwt-decode';

interface UserMetadata {
  id: number;
  username: string;
  fullName: string;
  token: string;
  privateKey: string;
}

interface UserSession {
  user?: UserMetadata;
  signIn: (username: string, password: string, pemContents: string) => Promise<boolean>;
  signOut: () => void;
}

export const UserSessionContext = createContext<UserSession>({
  signIn: () => new Promise(() => {}),
  signOut: () => {},
});

interface Props {
  children: React.ReactNode;
}

export default function UserSessionContextProvider({ children }: Props) {
  // Need to force the storage object to undefined so that SSR doesn't fail.
  // This code should continue to work when the app is mounted in the client.
  const ssrLocalStorage = (typeof localStorage !== 'undefined'
    ? localStorage
    : undefined) as StorageObj;

  const [token, setToken] = useStorageState<string | undefined>(
    ssrLocalStorage,
    StorageKey.TOKEN,
    undefined
  );

  const [privateKey, setPrivateKey] = useStorageState<string | undefined>(
    ssrLocalStorage,
    StorageKey.PRIVATE_KEY,
    undefined
  );

  async function signIn(username: string, password: string, pemContents: string) {
    const response = await fetch(`/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const jsonResponse = (await response.json()) as API.JSONResponse<API.AuthenticationResponse>;

    if (!jsonResponse.data || jsonResponse.error != null) {
      return false;
    }

    setToken(jsonResponse.data.token);
    setPrivateKey(pemContents);

    return true;
  }

  function signOut() {
    setToken(undefined);
    setPrivateKey(undefined);
  }

  const userMetadata = useMemo<UserMetadata | undefined>(() => {
    if (!token || !privateKey) {
      return undefined;
    }

    const decodedToken = jwtDecode<JwtPayload>(token);

    if (!decodedToken.sub) {
      return undefined;
    }

    return {
      id: parseInt(decodedToken.sub),
      username: decodedToken['username'],
      fullName: decodedToken['name'],
      token,
      privateKey,
    };
  }, [token, privateKey]);

  return (
    <UserSessionContext.Provider value={{ user: userMetadata, signIn, signOut }}>
      {children}
    </UserSessionContext.Provider>
  );
}
