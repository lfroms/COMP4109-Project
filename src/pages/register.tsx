import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useRegistration } from 'hooks';
import { AsymmetricEncryptionService, PrivateKeyTransportService } from 'services';

export default function Register() {
  const router = useRouter();
  const register = useRegistration();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    const keyPair = await AsymmetricEncryptionService.generateKeyPair();
    const publicKey = await AsymmetricEncryptionService.convertPublicKeyToString(keyPair.publicKey);

    const { data, error } = await register({ name: fullName, username, password, publicKey });

    if (!data || error) {
      console.error('An error occured while trying to register.', error);

      return;
    }
    const transportService = new PrivateKeyTransportService(keyPair.privateKey);
    await transportService.downloadAsFile();
    router.push('/');
  }

  return (
    <div>
      <h1>Register</h1>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          onChange={element => setFullName(element.currentTarget.value)}
          value={fullName}
        />
        <br />
        <label>Username:</label>
        <input
          type="text"
          onChange={element => setUsername(element.currentTarget.value)}
          value={username}
        />
        <br />
        <label>Password:</label>
        <input
          type="text"
          onChange={elem => setPassword(elem.currentTarget.value)}
          value={password}
        />
        <br />
        <br />
        <input type="button" value="Register" onClick={handleRegister} />
      </div>
    </div>
  );
}
