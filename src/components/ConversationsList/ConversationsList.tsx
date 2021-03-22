import React from 'react';
import Link from 'next/link';
import { useConversations, useUserSession } from 'hooks';

export default function ConversationsList() {
  const { userId } = useUserSession();

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
