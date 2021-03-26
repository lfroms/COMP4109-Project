import React from 'react';
import Link from 'next/link';
import { useConversations, useFetchUsers, useUserSession } from 'hooks';
import {
  AsymmetricEncryptionService,
  MessageAuthenticationService,
  SymmetricEncryptionService,
} from 'services';

export default function ConversationsList() {
  const { userId } = useUserSession();
  const fetchUsers = useFetchUsers();

  const { conversations, createConversation } = useConversations(userId);

  async function handleCreateConversation() {
    const users = await fetchUsers([userId, 2]);

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
    <>
      Conversation List:
      <ul>
        {conversations.map((conversation, index) => (
          <li key={`conversation-list-${index}`}>
            <Link href={`/conversations/${conversation.id}`}>test</Link>
          </li>
        ))}
      </ul>
      <button onClick={handleCreateConversation}>Create conversation</button>
    </>
  );
}
