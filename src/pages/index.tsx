import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateConversation } from 'hooks';

export default function Index() {
  const router = useRouter();
  const createConversation = useCreateConversation();
  const [conversationId, setConversationId] = useState('');
  const [userId, setUserId] = useState('');

  const inputUserName = (
    <input type="text" onChange={elem => setUserId(elem.currentTarget.value)} value={userId} />
  );

  const inputRoomName = (
    <input
      type="text"
      onChange={element => setConversationId(element.currentTarget.value)}
      value={conversationId}
    />
  );

  const joinButton = <button onClick={joinRoom}>Join</button>;

  async function joinRoom() {
    const conversationId = await createConversation({ participantIds: [userId] });
    router.push(`/conversations/${conversationId}?userId=${userId}`);
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
