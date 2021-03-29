import classNames from 'classnames';
import React from 'react';

import styles from './Text.module.scss';

type Type = 'title' | 'body' | 'label';
type Format = 'regular' | 'subdued' | 'light';

interface Props {
  type?: Type;
  format?: Format;
  inverted?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Text({
  type = 'body',
  format = 'regular',
  inverted = false,
  className,
  children,
}: Props) {
  if (type === 'title') {
    const titleClassName = classNames(
      styles.Title,
      format === 'subdued' && styles.subdued,
      className,
      inverted && styles.inverted
    );

    return <h1 className={titleClassName}>{children}</h1>;
  }

  if (type === 'label') {
    const labelClassName = classNames(
      styles.Label,
      format === 'subdued' && styles.subdued,
      className,
      inverted && styles.inverted
    );

    return <span className={labelClassName}>{children}</span>;
  }

  const bodyClassName = classNames(
    styles.Body,
    format === 'subdued' && styles.subdued,
    format === 'light' && styles.light,
    className,
    inverted && styles.inverted
  );

  return <span className={bodyClassName}>{children}</span>;
}
