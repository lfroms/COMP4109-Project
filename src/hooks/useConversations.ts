import { useEffect, useState } from 'react';
import { SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useConversations(userId: number) {
  const socket = useSocketContext();
  const [conversations, setConversations] = useState<API.Conversation[]>([]);

  useEffect(() => {
    async function fetchConversations() {
      const response = await fetch(`/api/conversations?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const jsonResponse = (await response.json()) as API.JSONResponse<API.UserConversationResponse>;

      if (!jsonResponse.data?.conversations) {
        return;
      }

      setConversations(jsonResponse.data.conversations);
    }

    fetchConversations();
  }, []);

  function createConversation(payload: ConversationCreatePayload) {
    return new Promise<number>(resolve => {
      socket.emit(SocketEvent.CREATE_CONVERSATION, payload, (conversationId: number) => {
        resolve(conversationId);
      });
    });
  }

  return { conversations, createConversation };
}
