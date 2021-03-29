import React, { ChangeEvent } from 'react';

import styles from './TextField.module.scss';

type Type = 'text' | 'password';

interface Props {
  placeholder: string;
  value: string;
  type?: Type;
  onChange: (newValue: string) => void;
}

export default function TextField({ placeholder, value, type = 'text', onChange }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <input
      className={styles.TextField}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}
