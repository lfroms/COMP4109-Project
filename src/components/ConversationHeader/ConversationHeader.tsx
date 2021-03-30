import React, { useEffect, useState } from 'react';
import { createParticipantNamesList } from 'helpers';
import { Icon } from 'components';

import styles from './ConversationHeader.module.scss';
import { useAuthenticatedFetch } from 'hooks';

interface Props {
  conversationId?: string;
  sharedSecret?: string;
}

export default function ConversationHeader({ conversationId, sharedSecret }: Props) {
  const [participants, setParticipants] = useState<API.User[]>([]);
  const authenticatedFetch = useAuthenticatedFetch();

  async function fetchParticipants(conversationId: string) {
    const response = await authenticatedFetch<API.ConversationResponse>(
      `/api/conversations/${conversationId}`,
      'GET'
    );

    setParticipants(response.data?.conversation.participants ?? []);
  }

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    fetchParticipants(conversationId);
  }, [conversationId]);

  return (
    <div className={styles.ConversationHeader}>
      <h1>{createParticipantNamesList(participants)}</h1>

      <div className={styles.KeyDisplay}>
        <Icon name="key" color="subdued" />
        <p>{sharedSecret ? sharedSecret.slice(0, 18) : ''}...</p>
      </div>
    </div>
  );
}
