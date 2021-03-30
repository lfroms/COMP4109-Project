import React from 'react';
import classNames from 'classnames';
import { Spinner } from 'components';

import styles from './Button.module.scss';

interface Props {
  inverted?: boolean;
  loading?: boolean;
  disabled?: boolean;
  darkPrimary?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({
  inverted = false,
  loading = false,
  disabled = false,
  darkPrimary = false,
  onClick,
  children,
}: Props) {
  return (
    <button
      className={classNames(
        styles.Button,
        inverted && styles.inverted,
        disabled && styles.disabled,
        darkPrimary && styles.darkPrimary
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {loading && (
        <span className={styles.Spinner}>
          <Spinner style={inverted ? 'dark' : 'light'} />
        </span>
      )}
      {children}
    </button>
  );
}
