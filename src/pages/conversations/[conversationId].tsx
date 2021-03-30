import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useConversation, useUserSession } from 'hooks';
import { ComposerBar, ConversationHeader, MessagesView } from 'components';

interface Params extends NodeJS.Dict<string | string[]> {
  conversationId: string;
}

export default function Conversation() {
  const router = useRouter();
  const { userId } = useUserSession();
  const [currentMessageText, setCurrentMessageText] = useState('');
  const { conversationId } = router.query as Params;

  const { messages, encryptedMessages, sendMessage, sharedSecret, participants } = useConversation(
    conversationId
  );

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
    <>
      <ConversationHeader participants={participants} sharedSecret={sharedSecret} />
      <MessagesView
        messages={messages}
        encryptedMessages={encryptedMessages}
        participants={participants}
        currentUserId={userId}
      />
      <ComposerBar
        value={currentMessageText}
        onChange={setCurrentMessageText}
        onSend={handleSendButtonClick}
      />
    </>
  );
}
