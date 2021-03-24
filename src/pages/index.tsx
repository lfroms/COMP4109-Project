import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useKeyStore, useRegistration, useSessionStorage } from 'hooks';
import { StorageKey } from 'types';
import { AsymmetricEncryptionService, PrivateKeyTransportService } from 'services';

export default function Index() {
  const router = useRouter();
  const register = useRegistration();
  const [userId, setUserId] = useState('');
  const { setKey: setPrivateKey } = useKeyStore(StorageKey.PRIVATE_KEY);

  // TODO: Replace with JWT storage once authentication implemented.
  const { set: setUserIdInSessionStorage } = useSessionStorage(StorageKey.USER_ID);

  const [pemContents, setPemContents] = useState<string | undefined>(undefined);

  function handleLogin() {
    setPrivateKey(pemContents);
    setUserIdInSessionStorage(userId);
    // TODO: Further login implementation.
    router.push('/conversations');
  }

  function handleChangeFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      // It can only be a string since we are using readAsText.
      setPemContents(fileReader.result as string);
    };

    fileReader.readAsText(file);
  }

  async function handleRegister() {
    const keyPair = await AsymmetricEncryptionService.generateKeyPair();
    const publicKey = await AsymmetricEncryptionService.convertPublicKeyToString(keyPair.publicKey);

    const { data, error } = await register({ name: userId, password: 'test', publicKey });

    if (!data || error) {
      console.error('An error occured while trying to register.', error);

      return;
    }

    const transportService = new PrivateKeyTransportService(keyPair.privateKey);
    await transportService.downloadAsFile();
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <label>user id (from db):</label>
          <input
            type="text"
            onChange={elem => setUserId(elem.currentTarget.value)}
            value={userId}
          />
          <br />
          <label>private key (pem):</label>
          <input type="file" name="privateKey" onChange={handleChangeFile} />

          <br />
          <br />
          <input type="submit" value="Login" />
          <input type="button" value="Register" onClick={handleRegister} />
        </form>
      </div>
    </div>
  );
}
