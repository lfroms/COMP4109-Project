import React, { useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import AsyncSelect from 'react-select/async';
import { useConversations, useFetchUsers, useUserSession } from 'hooks';
import { createParticipantNamesList } from 'helpers';
import {
  AsymmetricEncryptionService,
  MessageAuthenticationService,
  SymmetricEncryptionService,
} from 'services';
import { Button, Icon, Modal } from 'components';

import styles from './ConversationsList.module.scss';

interface DropdownSelectOption {
  value: number;
  label: string;
}

export default function ConversationsList() {
  const { userId } = useUserSession();
  const fetchUsers = useFetchUsers();
  const [newConversationModalVisible, setNewConversationModalVisible] = useState(false);
  const [newConversationLoading, setNewConversationLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<DropdownSelectOption[]>([]);

  const { conversations, createConversation } = useConversations(userId ?? 0);

  async function handleCreateConversation() {
    if (!userId) {
      return;
    }

    setNewConversationLoading(true);
    const users = await fetchUsers([userId, ...selectedUsers.map(user => user.value)]);

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

    await createConversation({ participantMetadata });

    setTimeout(() => {
      setNewConversationLoading(false);
      setNewConversationModalVisible(false);
      setSelectedUsers([]);
    }, 500);
  }

  async function searchUsers(value: string): Promise<DropdownSelectOption[]> {
    const users = await fetchUsers();

    if (!users) {
      return [];
    }

    return users
      .filter(user => user.name.toLowerCase().includes(value.toLowerCase()))
      .filter(user => user.id !== userId)
      .map(user => ({
        value: user.id,
        label: user.name,
      }));
  }

  return (
    <>
      <div className={styles.ConversationsList}>
        <ul>
          {conversations.map((conversation, index) => {
            const active = window.location.pathname === `/conversations/${conversation.id}`;
            const iconName = conversation.participants.length <= 2 ? 'person' : 'people';
            const iconColor = active ? 'dark' : 'light';

            return (
              <li
                key={`conversation-list-${index}`}
                className={classNames(styles.ConversationItem, active && styles.active)}
              >
                <Link href={`/conversations/${conversation.id}`}>
                  <a>
                    <span className={styles.ConversationItemIcon}>
                      <Icon name={iconName} color={iconColor} />
                    </span>
                    <span>
                      {createParticipantNamesList(userId ?? 0, conversation.participants)}
                    </span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.Actions}>
          <Button onClick={() => setNewConversationModalVisible(true)} darkPrimary>
            <Icon name="compose" color="dark" />
            New conversation
          </Button>
        </div>
      </div>

      <Modal
        open={newConversationModalVisible}
        title="New conversation"
        onRequestClose={() => setNewConversationModalVisible(false)}
        className={styles.Modal}
        actions={
          <>
            <Button inverted onClick={() => setNewConversationModalVisible(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateConversation}
              loading={newConversationLoading}
              disabled={!selectedUsers.length}
            >
              Create
            </Button>
          </>
        }
      >
        <AsyncSelect
          className={styles.DropdownSearch}
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={searchUsers}
          value={selectedUsers}
          classNamePrefix="DropdownSearch"
          onChange={value => setSelectedUsers([...value])}
          placeholder="Search for people..."
        />
      </Modal>
    </>
  );
}
