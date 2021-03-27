import React from 'react';
import type { AppProps } from 'next/app';
import { Frame, SocketContextProvider, UserSessionProvider } from 'components';

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <UserSessionProvider>
      <SocketContextProvider>
        <Frame visible={router.pathname !== '/' && router.pathname !== '/register'}>
          <Component {...pageProps} />
        </Frame>
      </SocketContextProvider>
    </UserSessionProvider>
  );
}
