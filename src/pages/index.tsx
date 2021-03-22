import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateConversation } from 'hooks';
import { AsymmetricEncryptionService, SymmetricEncryptionService } from '../services';

export default function Index() {
  const router = useRouter();
  const createConversation = useCreateConversation();
  const [userId, setUserId] = useState('');

  async function handleLogin() {
    const privateMessageEncryptionKey = await SymmetricEncryptionService.generateKey();
    const encryptionService = new SymmetricEncryptionService(privateMessageEncryptionKey);
    const cryptoKeyPair = await AsymmetricEncryptionService.generateKeyPair();
    const convertPrivateKeyToString = await encryptionService.exportKeyToString();
    const asymmetricEncryption = new AsymmetricEncryptionService();
    const encryptedMessageKey = await asymmetricEncryption.encrypt(
      convertPrivateKeyToString,
      cryptoKeyPair.publicKey
    );
    const publicKeyToString = await AsymmetricEncryptionService.convertPublicKeyToString(
      cryptoKeyPair.publicKey
    );

    const conversationId = await createConversation({
      participantIds: [userId],
      personalConversationKey: encryptedMessageKey,
      publicEncryptionKey: publicKeyToString,
    });

    router.push(`/conversations/${conversationId}?userId=${userId}`);
  }

  return (
    <div>
      <h1>Welcome to CryptoChat!</h1>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleLogin();
          }}
        >
          username:
          <input
            type="text"
            onChange={elem => setUserId(elem.currentTarget.value)}
            value={userId}
          />
          <input type="submit" value="Join" />
        </form>
      </div>
    </div>
  );
}
