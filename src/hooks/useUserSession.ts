import { useSessionStorage } from 'hooks';
import { StorageKey } from 'types';

export default function useUserSession() {
  const { remove, value } = useSessionStorage(StorageKey.USER_ID);

  function logOut() {
    remove();
  }

  return { userId: value, logOut };
}
