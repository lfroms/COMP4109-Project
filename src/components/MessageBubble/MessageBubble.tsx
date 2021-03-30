import React from 'react';
import classNames from 'classnames';

import styles from './MessageBubble.module.scss';

interface Props {
  text: string;
  fromSender: boolean;
}

export default function MessageBubble({ text, fromSender }: Props) {
  return (
    <div className={classNames(styles.MessageBubble, fromSender && styles.fromSender)}>{text}</div>
  );
}
