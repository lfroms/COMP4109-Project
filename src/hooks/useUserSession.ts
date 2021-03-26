import { useSessionStorage, useSocketContext } from 'hooks';
import { useEffect } from 'react';
import { SocketEvent, StorageKey } from 'types';

export default function useUserSession() {
  const socket = useSocketContext();
  const { remove, value: userId } = useSessionStorage(StorageKey.USER_ID);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const connectionRegistrationPayload: ConnectionRegisterPayload = {
      userId,
    };

    socket.emit(SocketEvent.REGISTER_CONNECTION, connectionRegistrationPayload);
  }, [userId]);

  function logOut() {
    socket.emit(SocketEvent.DEREGISTER_CONNECTION);
    remove();
  }

  return { userId, logOut };
}
