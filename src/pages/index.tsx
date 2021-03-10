import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  const [conversationId, setConversationId] = useState('');
  const [userId, setUserId] = useState('');

  const inputUserName = (
    <input type="text" onChange={elem => setUserId(elem.currentTarget.value)} value={userId} />
  );

  const inputRoomName = (
    <input
      type="text"
      onChange={elem => setConversationId(elem.currentTarget.value)}
      value={conversationId}
    />
  );

  const joinButton = <button onClick={joinRoom}>Join</button>;

  function joinRoom() {
    router.push('/chat/' + conversationId);
  }

  return (
    <div>
      <h1>Welcome to CryptoChat!</h1>
      <div>
        <p>Enter the room to join below:</p>
        username:
        {inputUserName}
        room:
        {inputRoomName}
        {joinButton}
      </div>
    </div>
  );
}
