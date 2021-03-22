import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useConversation } from 'hooks';

interface Params extends NodeJS.Dict<string | string[]> {
  conversationId: string;
  userId: string; // TODO: Remove this once we can fetch this from the session.
}

export default function Conversation() {
  const router = useRouter();
  const [currentMessageText, setCurrentMessageText] = useState('');
  const { conversationId, userId } = router.query as Params;

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