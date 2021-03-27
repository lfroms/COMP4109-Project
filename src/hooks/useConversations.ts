import { useAuthenticatedFetch } from 'hooks';
import { useEffect, useState } from 'react';
import { SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useConversations(userId: number) {
  const socket = useSocketContext();
  const authenticatedFetch = useAuthenticatedFetch();
  const [conversations, setConversations] = useState<API.Conversation[]>([]);

  async function fetchConversations() {
    const response = await authenticatedFetch<API.ConversationsResponse>(
      `/api/conversations?userId=${userId}`,
      'GET'
    );

    if (!response.data?.conversations) {
      return;
    }

    setConversations(response.data.conversations);
  }

  function createConversation(payload: ConversationCreatePayload) {
    return new Promise<number>(resolve => {
      socket.emit(SocketEvent.CREATE_CONVERSATION, payload, (conversationId: number) => {
        resolve(conversationId);
      });
    });
  }

  function subscribeToConversations(payload: ConversationsSubscribePayload) {
    socket.emit(SocketEvent.SUBSCRIBE_TO_CONVERSATIONS, payload);
  }

  useEffect(() => {
    fetchConversations();
    subscribeToConversations({ userId });

    socket.on(SocketEvent.NOTIFY_CONVERSATIONS, fetchConversations);
  }, []);

  return { conversations, createConversation };
}
