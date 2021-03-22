import React from 'react';
import { ConversationsList } from 'components';

interface Props {
  visible?: boolean;
  children: React.ReactNode;
}

export default function Frame({ visible = false, children }: Props) {
  if (!visible) {
    return <>{children}</>;
  }

  return (
    <>
      <ConversationsList />
      {children}
    </>
  );
}
