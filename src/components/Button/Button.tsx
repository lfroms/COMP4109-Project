import React from 'react';
import classNames from 'classnames';
import { Spinner } from 'components';

import styles from './Button.module.scss';

interface Props {
  inverted?: boolean;
  loading?: boolean;
  onClick: () => void;
  children: string;
}

export default function Button({ inverted = false, loading = false, onClick, children }: Props) {
  return (
    <button className={classNames(styles.Button, inverted && styles.inverted)} onClick={onClick}>
      {loading && (
        <span className={styles.Spinner}>
          <Spinner style={inverted ? 'dark' : 'light'} />
        </span>
      )}
      {children}
    </button>
  );
}
