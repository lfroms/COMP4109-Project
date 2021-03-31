import React from 'react';
import { default as NextLink } from 'next/link';

import styles from './Link.module.scss';

interface Props {
  to: string;
  children: string;
}

export default function Link({ to, children }: Props) {
  return (
    <span className={styles.Link}>
      <NextLink href={to}>{children}</NextLink>
    </span>
  );
}
