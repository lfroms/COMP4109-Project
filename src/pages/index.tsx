import React from 'react';
import { useConnectToSocketOnce } from 'hooks';

export default function App() {
  useConnectToSocketOnce();

  return <p>Hello, World!</p>;
}
