import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useConversation, useSessionStorage } from 'hooks';
import { StorageKey } from 'types';

interface Params extends NodeJS.Dict<string | string[]> {
  conversationId: string;
}

export default function Conversation() {
  const router = useRouter();
  const { value: userId } = useSessionStorage(StorageKey.USER_ID);
  const [currentMessageText, setCurrentMessageText] = useState('');
  const { conversationId } = router.query as Params;

  const [messages, sendMessage] = useConversation(conversationId);

  function handleSendButtonClick() {
    const message: MessagePayload = { senderId: userId, data: currentMessageText };

    sendMessage(message);
    setCurrentMessageText('');
  }

  return (
    <div>
      <h1>Conversation {conversationId}</h1>

      {messages.map((message, index) => (
        <p key={`message-${index}`}>
          {message.senderId}: {message.data}
        </p>
      ))}

      <input
        id="msgInput"
        type="text"
        onChange={elem => setCurrentMessageText(elem.currentTarget.value)}
        placeholder="Type a message..."
        value={currentMessageText}
      />
      <button onClick={handleSendButtonClick}>Send</button>
    </div>
  );
}
