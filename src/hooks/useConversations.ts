import { useEffect, useState } from 'react';
import { useAuthenticatedFetch, useUserSession } from 'hooks';
import { SocketEvent } from 'types';
import useSocketContext from './useSocketContext';

export default function useConversations() {
  const socket = useSocketContext();
  const { user } = useUserSession();
  const authenticatedFetch = useAuthenticatedFetch();
  const [conversations, setConversations] = useState<API.Conversation[]>([]);

  async function fetchConversations() {
    if (!user) {
      return;
    }

    const response = await authenticatedFetch<API.ConversationsResponse>(
      `/api/conversations?userId=${user.id}`,
      'GET'
    );

    if (!response.data) {
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
    if (user) {
      fetchConversations();
      subscribeToConversations({ userId: user.id });

      socket.on(SocketEvent.NOTIFY_CONVERSATIONS, fetchConversations);
    }

    return () => {
      socket.off(SocketEvent.NOTIFY_CONVERSATIONS);
    };
  }, []);

  return { conversations, createConversation };
}
