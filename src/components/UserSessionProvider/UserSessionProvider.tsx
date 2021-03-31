import React, { createContext } from 'react';
import { useSessionStorage } from 'hooks';
import { StorageKey } from 'types';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/router';

interface UserSession {
  userId?: number;
  fullName?: string;
  username?: string;
  token?: string;
  signIn: (username: string, password: string) => Promise<boolean>;
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
  const router = useRouter();
  const { set: setToken, remove: clearToken, value: token } = useSessionStorage(StorageKey.TOKEN);

  async function signIn(username: string, password: string) {
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

    return true;
  }

  function signOut() {
    clearToken();
    router.push('/');
  }

  const decodedJwt = token ? jwtDecode<JwtPayload>(token) : undefined;
  const userId = decodedJwt?.sub ? parseInt(decodedJwt.sub) : undefined;
  const fullName = decodedJwt?.['name'];
  const username = decodedJwt?.['username'];

  return (
    <UserSessionContext.Provider value={{ token, userId, fullName, username, signIn, signOut }}>
      {children}
    </UserSessionContext.Provider>
  );
}
