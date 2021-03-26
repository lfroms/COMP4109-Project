import { UserSessionContext } from 'components';
import { useContext } from 'react';

export default function useUserSession() {
  return useContext(UserSessionContext);
}
