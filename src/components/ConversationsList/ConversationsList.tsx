import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useConversations, useFetchUsers, useUserSession } from 'hooks';
import { createParticipantNamesList } from 'helpers';
import {
  AsymmetricEncryptionService,
  MessageAuthenticationService,
  SymmetricEncryptionService,
} from 'services';
import { Button, Icon } from 'components';

import styles from './ConversationsList.module.scss';

export default function ConversationsList() {
  const { userId } = useUserSession();
  const fetchUsers = useFetchUsers();

  const { conversations, createConversation } = useConversations(userId ?? 0);

  async function handleCreateConversation() {
    const users = await fetchUsers([userId ?? 0, 2]);

    if (!users) {
      console.error('Could not create conversation as participants could not be fetched.');

      return;
    }

    const asymmetricService = new AsymmetricEncryptionService();
    const sharedSecret = await SymmetricEncryptionService.generateKey();
    const exportedSharedSecret = await new SymmetricEncryptionService(
      sharedSecret
    ).exportKeyToString();

    const hmacKey = await MessageAuthenticationService.generateKey();
    const exportedHmacKey = await new MessageAuthenticationService(hmacKey).exportKeyToString();

    const participantMetadataQueue = users.map(async user => {
      const userPublicKey = await AsymmetricEncryptionService.convertStringToPublicKey(
        user.publicKey
      );

      return {
        id: user.id,
        personalConversationKey: await asymmetricService.encrypt(
          exportedSharedSecret,
          userPublicKey
        ),
        hmac: await asymmetricService.encrypt(exportedHmacKey, userPublicKey),
      };
    });

    const participantMetadata = await Promise.all(participantMetadataQueue);

    createConversation({ participantMetadata });
  }

  return (
    <div className={styles.ConversationsList}>
      <ul>
        {conversations.map((conversation, index) => {
          const active = window.location.pathname === `/conversations/${conversation.id}`;
          const iconName = conversation.participants.length === 1 ? 'person' : 'people';
          const iconColor = active ? 'dark' : 'light';

          return (
            <li
              key={`conversation-list-${index}`}
              className={classNames(styles.ConversationItem, active && styles.active)}
            >
              <Link href={`/conversations/${conversation.id}`}>
                <a className={styles.Link}>
                  <Icon name={iconName} color={iconColor} />
                  <span>{createParticipantNamesList(conversation.participants)}</span>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.Actions}>
        <Button onClick={handleCreateConversation} darkPrimary>
          <Icon name="compose" color="dark" />
          New conversation
        </Button>
      </div>
    </div>
  );
}
