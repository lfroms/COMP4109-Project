import React from 'react';
import classNames from 'classnames';

import styles from './Avatar.module.scss';

interface Props {
  fullName: string;
  small?: boolean;
}

export default function Avatar({ fullName, small = false }: Props) {
  const className = classNames(styles.Avatar, getClassName(fullName), small && styles.small);

  return (
    <div className={className}>
      <span>{getInitial(fullName)}</span>
    </div>
  );
}

function getInitial(fullName: string) {
  const parts = fullName.split(' ');

  if (parts.length !== 2) {
    return fullName[0].toUpperCase();
  }

  return `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`;
}

function getClassName(fullName: string) {
  const CLASS_NAMES = [styles.red, styles.green, styles.blue, styles.indigo, styles.orange];

  return CLASS_NAMES[Math.round(fullName.length % CLASS_NAMES.length)];
}
