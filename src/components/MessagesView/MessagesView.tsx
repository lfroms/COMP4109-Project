import React, { useEffect, useRef } from 'react';
import { MessageBubble } from 'components';
import classNames from 'classnames';

import styles from './MessagesView.module.scss';

interface Props {
  currentUserId?: number;
  messages: DecryptedMessagePayload[];
}

export default function MessagesView({ currentUserId, messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messagesMarkup = messages.map((message, index) => {
    const fromCurrentUser = message.senderId === currentUserId;
    const rowClassName = classNames(styles.MessageRow, fromCurrentUser && styles.fromCurrentUser);

    return (
      <div className={rowClassName} key={`message-${index}-${message.senderId}`}>
        <MessageBubble text={message.text} fromSender={fromCurrentUser} />
      </div>
    );
  });

  return (
    <div className={styles.MessagesViewContainer}>
      <div className={styles.MessagesView}>{messagesMarkup}</div>
      <div ref={messagesEndRef} />
    </div>
  );
}
