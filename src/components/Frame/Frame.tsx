import React from 'react';

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
      <p>Conversations list</p>
      {children}
    </>
  );
}
