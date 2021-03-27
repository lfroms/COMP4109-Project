import React, { createContext } from 'react';
import { useSessionStorage } from 'hooks';
import { StorageKey } from 'types';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/router';

interface UserSession {
  userId?: number;
  token?: string;
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

    console.log(username);
    console.log(password);

    //return boolean?
    return true;
  }

  function signOut() {
    clearToken();
    router.push('/');
  }

  const decodedJwt = token ? jwtDecode<JwtPayload>(token).sub : undefined;
  const userId = decodedJwt ? parseInt(decodedJwt) : undefined;

  return (
    <UserSessionContext.Provider value={{ token, userId, signIn, signOut }}>
      {children}
    </UserSessionContext.Provider>
  );
}
