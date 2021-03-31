import React from 'react';
import { createParticipantNamesList } from 'helpers';
import { Icon } from 'components';

import styles from './ConversationHeader.module.scss';

interface Props {
  currentUserId?: number;
  participants: API.User[];
  sharedSecret?: string;
}

export default function ConversationHeader({ currentUserId, participants, sharedSecret }: Props) {
  return (
    <div className={styles.ConversationHeader}>
      <h1>{createParticipantNamesList(participants, currentUserId)}</h1>

      <div className={styles.KeyDisplay}>
        <Icon name="key" color="subdued" />
        <p>{sharedSecret ? sharedSecret.slice(0, 18) : ''}...</p>
      </div>
    </div>
  );
}
