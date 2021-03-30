import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useConversation, useUserSession } from 'hooks';
import { ConversationHeader } from 'components';

interface Params extends NodeJS.Dict<string | string[]> {
  conversationId: string;
}

export default function Conversation() {
  const router = useRouter();
  const { userId } = useUserSession();
  const [currentMessageText, setCurrentMessageText] = useState('');
  const { conversationId } = router.query as Params;

  const { messages, sendMessage, sharedSecret } = useConversation(conversationId);

  function handleSendButtonClick() {
    if (!userId) {
      return;
    }

    const message: DecryptedMessagePayload = {
      senderId: userId,
      text: currentMessageText,
    };

    sendMessage(message);
    setCurrentMessageText('');
  }

  return (
    <div>
      <ConversationHeader conversationId={conversationId} sharedSecret={sharedSecret} />

      {messages.map((message, index) => (
        <p key={`message-${index}`}>
          {message.senderId}: {message.text}{' '}
          {message.verified ? 'verified signature' : 'invalid signature'}
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
