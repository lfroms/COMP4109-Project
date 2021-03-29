import React from 'react';
import { SideCard } from 'components';

import styles from './LandingLayout.module.scss';

interface Props {
  title: string;
  children: React.ReactNode;
  buttonRow: React.ReactNode;
}

export default function LandingLayout({ title, children, buttonRow }: Props) {
  return (
    <div className={styles.LandingLayout}>
      <SideCard title={title}>
        {children}

        <div className={styles.ButtonRow}>{buttonRow}</div>
      </SideCard>
    </div>
  );
}
