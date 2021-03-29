import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useKeyStore, useUserSession } from 'hooks';
import { StorageKey } from 'types';
import { SideCard, TextField } from 'components';

import styles from './index.module.scss';

export default function Index() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { setKey: setPrivateKey } = useKeyStore(StorageKey.PRIVATE_KEY);
  const { signIn } = useUserSession();

  const [pemContents, setPemContents] = useState<string | undefined>(undefined);

  async function handleLogin() {
    setPrivateKey(pemContents);
    const result = await signIn(userId, password);

    if (!result) {
      console.log('Error logging in');

      return;
    }

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
    router.push('/register');
  }

  return (
    <div className={styles.Index}>
      <SideCard title="Log in">
        <div className={styles.LoginFormLayout}>
          <div className={styles.LeftLoginSection}>
            <TextField placeholder="Username" value={userId} onChange={setUserId} />
            <TextField
              placeholder="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </div>
        </div>
      </SideCard>
    </div>
  );

  return (
    <div>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <label>username:</label>
          <input
            type="text"
            onChange={elem => setUserId(elem.currentTarget.value)}
            value={userId}
          />
          <br />
          <label>password:</label>
          <input
            type="text"
            onChange={elem => setPassword(elem.currentTarget.value)}
            value={password}
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
