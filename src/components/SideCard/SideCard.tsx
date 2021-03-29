import React from 'react';

import styles from './SideCard.module.scss';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function SideCard({ title, children }: Props) {
  return (
    <div className={styles.SideCard}>
      <h1 className={styles.Title}>{title}</h1>
      {children}
    </div>
  );
}
