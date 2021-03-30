import React from 'react';
import classNames from 'classnames';
import { Button, Modal, Well } from 'components';

import styles from './Avatar.module.scss';

interface Props {
  fullName: string;
  publicKey?: string;
  small?: boolean;
  publicKeyModalVisible?: boolean;
  onRequestModalClose?: () => void;
  onClick?: () => void;
}

export default function Avatar({
  fullName,
  small = false,
  onClick,
  publicKey,
  publicKeyModalVisible = false,
  onRequestModalClose,
}: Props) {
  const className = classNames(
    styles.Avatar,
    getClassName(fullName),
    small && styles.small,
    onClick && styles.clickable
  );

  return (
    <>
      <div className={className} onClick={onClick}>
        <span>{getInitial(fullName)}</span>
      </div>

      {onClick && onRequestModalClose && publicKey && (
        <Modal
          open={publicKeyModalVisible}
          onRequestClose={onRequestModalClose}
          title={`${fullName}'s details`}
          actions={<Button onClick={onRequestModalClose}>Close</Button>}
        >
          <>
            <p className={styles.WellLabel}>
              All messages are end-to-end encrypted. Below is {fullName}&apos;s public key, encoded
              as Base64. This key is used to encrypt and exchange a shared secret for this
              conversation:
            </p>
            <Well>{publicKey}</Well>
          </>
        </Modal>
      )}
    </>
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
