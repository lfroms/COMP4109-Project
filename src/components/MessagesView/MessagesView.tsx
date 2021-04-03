import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Icon, MessageBubble, Modal, Well } from 'components';
import classNames from 'classnames';

import styles from './MessagesView.module.scss';

interface Props {
  currentUserId?: number;
  participants: API.User[];
  messages: DecryptedMessagePayload[];
  encryptedMessages: EncryptedMessagePayload[];
}

export default function MessagesView({
  currentUserId,
  participants,
  messages,
  encryptedMessages,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<DecryptedMessagePayload | undefined>(
    undefined
  );
  const [modalVisible, setModalVisible] = useState(false);

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
      <MessageBubble
        text={message.text}
        fromSender
        onClick={() => {
          setModalVisible(true);
          setSelectedMessage(message);
        }}
      />
    ) : (
      <div className={styles.MessageLayout}>
        <Avatar fullName={participant.name} publicKey={participant.publicKey} />

        <div className={styles.VerificationLayout}>
          <span>
            <Icon name={message.verified ? 'verified' : 'unverified'} />
            {message.verified ? 'Verified' : 'Invalid signature'}
          </span>
          <MessageBubble
            text={message.text}
            fromSender={false}
            onClick={() => {
              setModalVisible(true);
              setSelectedMessage(message);
            }}
          />
        </div>
      </div>
    );

    return (
      <div className={rowClassName} key={`message-${index}-${message.senderId}`}>
        {bubbleMarkup}
      </div>
    );
  });

  const selectedMessageEncrypted = encryptedMessages.find(
    message => message.id === selectedMessage?.id
  );

  return (
    <>
      <div className={styles.MessagesViewContainer}>
        <div className={styles.MessagesView}>{messagesMarkup}</div>
        <div ref={messagesEndRef} />
      </div>

      <Modal
        open={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        title={`Message Details (${selectedMessage?.text.slice(0, 14)}...)`}
        actions={<Button onClick={() => setModalVisible(false)}>Close</Button>}
      >
        <p className={styles.WellLabel}>Ciphertext:</p>
        <Well>{selectedMessageEncrypted?.data.m ?? ''}</Well>

        <p className={styles.WellLabel}>Initialization vector:</p>
        <Well>{selectedMessageEncrypted?.data.iv ?? ''}</Well>

        <p className={styles.WellLabel}>Message authentication code:</p>
        <Well>{selectedMessageEncrypted?.hmac ?? ''}</Well>
      </Modal>
    </>
  );
}
