import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserSession } from 'hooks';

export default function LogOut() {
  const router = useRouter();
  const { signOut } = useUserSession();

  useEffect(() => {
    signOut();
    router.replace('/');
  });

  return null;
}
