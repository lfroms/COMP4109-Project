import React, { ChangeEvent, KeyboardEvent } from 'react';

import styles from './TextField.module.scss';

type Type = 'text' | 'password';

interface Props {
  placeholder: string;
  value: string;
  type?: Type;
  onChange: (newValue: string) => void;
  onEnterKey?: () => void;
}

export default function TextField({
  placeholder,
  value,
  type = 'text',
  onChange,
  onEnterKey,
}: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return;
    }

    onEnterKey?.();
  }

  return (
    <input
      className={styles.TextField}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
    />
  );
}
