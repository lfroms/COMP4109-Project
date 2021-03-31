import React from 'react';
import type { AppProps } from 'next/app';

import { Frame, SocketContextProvider, UserSessionProvider } from 'components';

import '../styles/global.scss';
import '../fonts/inter/inter.css';

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <UserSessionProvider>
      <SocketContextProvider>
        <Frame
          visible={
            router.pathname !== '/' &&
            router.pathname !== '/register' &&
            router.pathname !== '/logout'
          }
        >
          <Component {...pageProps} />
        </Frame>
      </SocketContextProvider>
    </UserSessionProvider>
  );
}
