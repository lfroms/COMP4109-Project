import React from 'react';
import classNames from 'classnames';

import styles from './Spinner.module.scss';

interface Props {
  style?: 'light' | 'dark' | 'subdued';
}

export default function Spinner({ style = 'dark' }: Props) {
  const className = classNames(
    styles.Spinner,
    style === 'light' && styles.light,
    style === 'subdued' && styles.subdued
  );

  return <div className={className} />;
}
