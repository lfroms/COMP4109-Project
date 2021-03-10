import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useChat, useJoinChat } from 'hooks';
import { Message } from 'types';

interface Params extends NodeJS.Dict<string | string[]> {
  chatId: string;
}

export default function Chat() {
  const router = useRouter();
  const joinConversation = useJoinChat();
  const [messages, sendMessage] = useChat();
  const [currentMessageText, setCurrentMessageText] = useState('');

  const { chatId } = router.query as Params;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    joinConversation(chatId);
  }, [router.isReady]);

  function handleSendButtonClick() {
    const message: Message = { text: currentMessageText, sender: '1', conversationId: chatId };

    sendMessage(message);
    setCurrentMessageText('');
  }

  return (
    <div>
      <h1>Welcome to conversation {chatId}!</h1>

      {messages.map((message, index) => (
        <p key={`message-${index}`}>{message.text}</p>
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
