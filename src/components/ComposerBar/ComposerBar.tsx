import React from 'react';
import { Button, TextField } from 'components';

import styles from './ComposerBar.module.scss';

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  onSend: () => void;
}

export default function ComposerBar({ value, onChange, onSend }: Props) {
  return (
    <div className={styles.ComposerBar}>
      <div className={styles.TextField}>
        <TextField
          value={value}
          onChange={onChange}
          placeholder="Type a message..."
          onEnterKey={onSend}
        />
      </div>
      <Button onClick={onSend} disabled={value === ''}>
        Send
      </Button>
    </div>
  );
}
