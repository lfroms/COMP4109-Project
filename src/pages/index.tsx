import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateConversation, useRegistration } from 'hooks';
import {
  AsymmetricEncryptionService,
  PrivateKeyTransportService,
  SymmetricEncryptionService,
} from '../services';

export default function Index() {
  const router = useRouter();
  const createConversation = useCreateConversation();
  const register = useRegistration();
  const [userName, setUserName] = useState('');

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
      participantIds: [userName],
      personalConversationKey: encryptedMessageKey,
      publicEncryptionKey: publicKeyToString,
    });

    router.push(`/conversations/${conversationId}?userId=${userName}`);
  }

  async function handleRegister() {
    const keyPair = await AsymmetricEncryptionService.generateKeyPair();
    const publicKey = await AsymmetricEncryptionService.convertPublicKeyToString(keyPair.publicKey);

    const { data, error } = await register({ name: userName, password: 'test', publicKey });

    if (!data || error) {
      console.error('An error occured while trying to register.', error);

      return;
    }

    const transportService = new PrivateKeyTransportService(keyPair.privateKey);
    await transportService.downloadAsFile();
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
            onChange={elem => setUserName(elem.currentTarget.value)}
            value={userName}
          />
          <input type="submit" value="Join" />
          <input type="button" value="Register" onClick={handleRegister} />
        </form>
      </div>
    </div>
  );
}
