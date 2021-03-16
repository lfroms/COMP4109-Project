import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useConversation } from 'hooks';
import { Message } from 'types';
import { SymmetricEncryptionService } from 'services';

interface Params extends NodeJS.Dict<string | string[]> {
  conversationId: string;
  userId: string; // TODO: Remove this once we can fetch this from the session.
}

export default function Chat() {
  const router = useRouter();
  const [currentMessageText, setCurrentMessageText] = useState('');
  const { conversationId, userId } = router.query as Params;

  const [messages, sendMessage] = useConversation(conversationId);

  function handleSendButtonClick() {
    const message: Message = { data: currentMessageText, senderId: userId };

    sendMessage(message);
    setCurrentMessageText('');
  }

  useEffect(() => {
    async function printPlaintext() {
      const key = await SymmetricEncryptionService.generateKey();
      const encryptionService = new SymmetricEncryptionService(key);

      try {
        const payload = await encryptionService.encrypt(currentMessageText);
        const decryptedPlaintext = await encryptionService.decrypt(payload);

        console.log(payload, decryptedPlaintext, key);
      } catch (e) {
        console.error(e);
      }
    }

    printPlaintext();
  }, [currentMessageText]);

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
