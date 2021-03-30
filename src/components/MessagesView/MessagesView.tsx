import React, { useEffect, useRef } from 'react';
import { Avatar, Icon, MessageBubble } from 'components';
import classNames from 'classnames';

import styles from './MessagesView.module.scss';

interface Props {
  currentUserId?: number;
  participants: API.User[];
  messages: DecryptedMessagePayload[];
}

export default function MessagesView({ currentUserId, participants, messages }: Props) {
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
    const participant = participants.find(participant => participant.id === message.senderId);

    if (!participant) {
      return null;
    }

    const bubbleMarkup = fromCurrentUser ? (
      <MessageBubble text={message.text} fromSender />
    ) : (
      <div className={styles.MessageLayout}>
        <Avatar fullName={participant.name} />

        <div className={styles.VerificationLayout}>
          <span>
            <Icon name={message.verified ? 'verified' : 'unverified'} />
            {message.verified ? 'Verified' : 'Invalid signature'}
          </span>
          <MessageBubble text={message.text} fromSender={false} />
        </div>
      </div>
    );

    return (
      <div className={rowClassName} key={`message-${index}-${message.senderId}`}>
        {bubbleMarkup}
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
