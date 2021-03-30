import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useRegistration } from 'hooks';
import { AsymmetricEncryptionService, PrivateKeyTransportService } from 'services';
import { Button, LandingLayout, Modal, TextField } from 'components';
import classNames from 'classnames';

import styles from './register.module.scss';

export default function Register() {
  const router = useRouter();
  const register = useRegistration();

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState<CryptoKey | undefined>(undefined);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    setLoading(true);

    const keyPair = await AsymmetricEncryptionService.generateKeyPair();
    const publicKey = await AsymmetricEncryptionService.convertPublicKeyToString(keyPair.publicKey);

    const { data, error } = await register({ name: fullName, username, password, publicKey });

    if (!data || error) {
      if (error) {
        setErrorMessage(error.message);
      }

      setErrorModalVisible(true);
      setLoading(false);

      return;
    }

    setLoading(false);
    setPrivateKey(keyPair.privateKey);
  }

  async function handleDownloadPrivateKey() {
    if (!privateKey) {
      console.warn('No private key generated.');

      return;
    }

    setLoading(true);
    const transportService = new PrivateKeyTransportService(privateKey);
    await transportService.downloadAsFile(username);

    setTimeout(() => setLoading(false), 1000);
  }

  function handleReturnToLogin() {
    router.push('/');
  }

  const onNextStep = !!privateKey;

  const title = onNextStep ? 'Welcome!' : 'Create a new account';
  const buttons = onNextStep ? (
    <>
      <Button onClick={handleDownloadPrivateKey} loading={loading}>
        Download my private key
      </Button>
      <Button onClick={handleReturnToLogin} inverted>
        Return to log in
      </Button>
    </>
  ) : (
    <Button onClick={handleRegister} loading={loading}>
      Next
    </Button>
  );

  const content = onNextStep ? (
    <p className={classNames(styles.StandardText, styles.withBottomSpacing)}>
      Thanks for creating an account. In order to log in, you’ll need to download your private key.
      Make sure to keep it safe, you’ll only be able to download it once.
    </p>
  ) : (
    <div className={styles.RegistrationFormLayout}>
      <TextField placeholder="Full Name" value={fullName} onChange={setFullName} />

      <div className={styles.BottomRegistrationSection}>
        <TextField placeholder="Username" value={username} onChange={setUsername} />
        <TextField placeholder="Password" type="password" value={password} onChange={setPassword} />
      </div>
    </div>
  );

  return (
    <>
      <LandingLayout title={title} buttonRow={buttons}>
        {content}
      </LandingLayout>

      <Modal
        open={errorModalVisible}
        title="Error"
        onRequestClose={() => setErrorModalVisible(false)}
        actions={<Button onClick={() => setErrorModalVisible(false)}>Close</Button>}
      >
        <p className={styles.StandardText}>{errorMessage}.</p>
      </Modal>
    </>
  );
}
