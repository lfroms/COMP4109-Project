import React from 'react';
import Link from 'next/link';
import { useConversations, useSessionStorage } from 'hooks';
import { StorageKey } from 'types';

export default function ConversationsList() {
  const { value: userId } = useSessionStorage(StorageKey.USER_ID);
  const { conversations } = useConversations(userId);

  return (
    <>
      Conversation List:
      <ul>
        {conversations.map((conversation, index) => (
          <li key={`conversation-list-${index}`}>
            <Link href={`/conversations/${conversation.id}`}>test</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
