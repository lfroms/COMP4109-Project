import React from 'react';
import type { AppProps } from 'next/app';
import { SocketContextProvider } from 'components';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketContextProvider>
      <Component {...pageProps} />
    </SocketContextProvider>
  );
}
