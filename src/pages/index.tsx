import React, { useState } from 'react';
import { useConnectToSocketOnce } from 'hooks';

export default function Index() {
  useConnectToSocketOnce();

  const [chatID, setChatID] = useState('');

  const inputText = (
    <input
      id="chatID"
      type="text"
      onChange={elem => setChatID(elem.currentTarget.value)}
      value={chatID}
    />
  );

  const joinButton = <button onClick={joinRoom}>Join</button>;

  function joinRoom() {
    setChatID('');
  }

  return (
    <div>
      <h1>Welcome to CryptoChat!</h1>
      <div>
        <p>Enter the room to join below:</p>
        {inputText}
        {joinButton}
      </div>
    </div>
  );
}
