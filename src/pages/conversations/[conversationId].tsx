import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useConversation, useUserSession } from 'hooks';
import { ComposerBar, ConversationHeader, MessagesView } from 'components';

interface Params extends NodeJS.Dict<string | string[]> {
  conversationId: string;
}

export default function Conversation() {
  const router = useRouter();
  const { user } = useUserSession();
  const [currentMessageText, setCurrentMessageText] = useState('');
  const { conversationId } = router.query as Params;

  const { messages, encryptedMessages, sendMessage, sharedSecret, participants } = useConversation(
    parseInt(conversationId)
  );

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  });

  function handleSendButtonClick() {
    if (!user || !currentMessageText) {
      return;
    }

    const message: DecryptedMessagePayload = {
      senderId: user.id,
      text: currentMessageText,
    };

    sendMessage(message);
    setCurrentMessageText('');
  }

  return (
    <>
      <ConversationHeader
        currentUserId={user?.id}
        participants={participants}
        sharedSecret={sharedSecret}
      />
      <MessagesView
        messages={messages}
        encryptedMessages={encryptedMessages}
        participants={participants}
        currentUserId={user?.id}
      />
      <ComposerBar
        value={currentMessageText}
        onChange={setCurrentMessageText}
        onSend={handleSendButtonClick}
      />
    </>
  );
}
