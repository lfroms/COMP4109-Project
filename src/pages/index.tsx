import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useKeyStore, useUserSession } from 'hooks';
import { StorageKey } from 'types';
import { Button, Dropzone, LandingLayout, Link, Modal, TextField } from 'components';

import styles from './index.module.scss';

export default function Index() {
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [pemFile, setPemFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const { setKey: setPrivateKey } = useKeyStore(StorageKey.PRIVATE_KEY);
  const { signIn } = useUserSession();

  async function handleLogin() {
    if (!pemFile) {
      return;
    }

    setLoading(true);
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      // It can only be a string since we are using readAsText.
      const pemContents = fileReader.result as string;

      const result = await signIn(userName, password);

      if (!result) {
        setErrorModalVisible(true);

        return;
      }

      setPrivateKey(pemContents);

      setTimeout(() => {
        setLoading(false);
        router.push('/conversations');
      }, 700);
    };

    fileReader.readAsText(pemFile);
  }

  return (
    <>
      <LandingLayout
        title="Log in"
        buttonRow={
          <>
            <Button onClick={handleLogin} loading={loading}>
              Log in
            </Button>
            <Link to="/register">Create a new account</Link>
          </>
        }
      >
        <div className={styles.LoginFormLayout}>
          <div className={styles.LeftLoginSection}>
            <TextField placeholder="Username" value={userName} onChange={setUserName} />
            <TextField
              placeholder="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </div>

          <Dropzone currentFile={pemFile} onAcceptFile={setPemFile} />
        </div>
      </LandingLayout>

      <Modal
        open={errorModalVisible}
        title="Error"
        onRequestClose={() => setErrorModalVisible(false)}
        actions={<Button onClick={() => setErrorModalVisible(false)}>Close</Button>}
      >
        <p className={styles.PasswordIncorrectText}>The username or password is incorrect.</p>
      </Modal>
    </>
  );
}
