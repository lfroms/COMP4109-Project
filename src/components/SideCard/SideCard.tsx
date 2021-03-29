import React from 'react';
import { Text } from 'components';

import styles from './SideCard.module.scss';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function SideCard({ title, children }: Props) {
  return (
    <div className={styles.SideCard}>
      <Text type="title">{title}</Text>
      {children}
    </div>
  );
}
