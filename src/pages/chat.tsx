import React from 'react';
import { useConnectToSocketOnce } from 'hooks';

export default function Chat() {
  useConnectToSocketOnce();

  return (
    <div>
      <h1>Welcome to the generic chat page!</h1>
      <p>You might want to add a chat ID so you get into a room (Ex: ../chat/someValue)</p>
    </div>
  );
}
