import React from 'react';
import { ConversationsList, UserMenu } from 'components';

import styles from './Frame.module.scss';

interface Props {
  visible?: boolean;
  children: React.ReactNode;
}

export default function Frame({ visible = false, children }: Props) {
  if (!visible) {
    return <>{children}</>;
  }

  return (
    <div className={styles.Frame}>
      <div className={styles.SideBar}>
        <UserMenu />
        <ConversationsList />
      </div>

      <div className={styles.Content}>{children}</div>
    </div>
  );
}
