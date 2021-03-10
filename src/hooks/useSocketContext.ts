import { useContext } from 'react';
import { SocketContext } from 'components';

/** IMPORTANT: Only for use in other socket-related hooks, not in other components. */
export default function useSocketContext() {
  return useContext(SocketContext);
}
