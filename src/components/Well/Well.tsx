import React from 'react';

import styles from './Well.module.scss';

interface Props {
  children: string;
}

export default function Well({ children }: Props) {
  return <div className={styles.Well}>{children}</div>;
}
