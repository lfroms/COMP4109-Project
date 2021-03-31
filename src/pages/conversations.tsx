import React, { useEffect } from 'react';
import { useUserSession } from 'hooks';
import Head from 'next/head';
import { useRouter } from 'next/router';

import styles from './conversations.module.scss';

export default function Conversations() {
  const router = useRouter();
  const { user } = useUserSession();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Conversations | Cryptochat</title>
      </Head>

      <div className={styles.Conversations}>
        <p>Select a conversation from the list.</p>
      </div>
    </>
  );
}
