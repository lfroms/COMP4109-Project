import React, { useState } from 'react';
import { useJoinChat } from 'hooks';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  const [chatId, setChatID] = useState('');
  const [userId, setUserId] = useState('');
  const [sendRoomId, sendUserId] = useJoinChat();

  const inputUserName = (
    <input
      id="userId"
      type="text"
      onChange={elem => setUserId(elem.currentTarget.value)}
      value={userId}
    />
  );
  const inputRoomName = (
    <input
      id="chatID"
      type="text"
      onChange={elem => setChatID(elem.currentTarget.value)}
      value={chatId}
    />
  );

  const joinButton = <button onClick={joinRoom}>Join</button>;

  function joinRoom() {
    sendRoomId(chatId);
    sendUserId(userId);
    router.push('/chat/' + chatId);
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
