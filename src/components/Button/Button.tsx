import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';

interface Props {
  inverted?: boolean;
  onClick: () => void;
  children: string;
}

export default function Button({ inverted = false, onClick, children }: Props) {
  return (
    <button className={classNames(styles.Button, inverted && styles.inverted)} onClick={onClick}>
      {children}
    </button>
  );
}
