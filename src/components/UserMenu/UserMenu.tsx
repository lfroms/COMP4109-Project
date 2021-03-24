import React from 'react';
import { useRouter } from 'next/router';
import { useUserSession } from 'hooks';

export default function UserMenu() {
  const router = useRouter();
  const { userId, logOut } = useUserSession();

  function handleLogOut() {
    logOut();
    router.replace('/');
  }

  return (
    <>
      Logged in as {userId}. <button onClick={handleLogOut}>Log out</button>
    </>
  );
}
