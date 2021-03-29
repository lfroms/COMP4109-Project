import React from 'react';
import { default as ReactModal } from 'react-modal';

import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  onRequestClose: () => void;
  title: string;
  actions: React.ReactNode;
  children: React.ReactNode;
}

export default function Modal({ open, onRequestClose, title, actions, children }: Props) {
  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onRequestClose}
      closeTimeoutMS={300}
      ariaHideApp={false}
      overlayClassName={{
        base: styles.Overlay,
        afterOpen: styles.afterOpen,
        beforeClose: styles.beforeClose,
      }}
      className={{
        base: styles.Modal,
        afterOpen: styles.afterOpen,
        beforeClose: styles.beforeClose,
      }}
    >
      <div className={styles.Content}>
        <h1 className={styles.Title}>{title}</h1>
        {children}
      </div>

      <div className={styles.Actions}>{actions}</div>
    </ReactModal>
  );
}
