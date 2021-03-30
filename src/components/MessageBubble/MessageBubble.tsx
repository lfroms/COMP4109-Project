import React from 'react';
import classNames from 'classnames';

import styles from './MessageBubble.module.scss';

interface Props {
  text: string;
  fromSender: boolean;
  onClick?: () => void;
}

export default function MessageBubble({ text, fromSender, onClick }: Props) {
  return (
    <div
      className={classNames(styles.MessageBubble, fromSender && styles.fromSender)}
      onDoubleClick={onClick}
    >
      {text}
    </div>
  );
}
