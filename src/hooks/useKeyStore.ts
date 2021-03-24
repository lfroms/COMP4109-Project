import useSessionStorage from './useSessionStorage';

export default function useKeyStore(key: string, defaultValue: any = null) {
  const { set, remove, value } = useSessionStorage(key, defaultValue);

  return { setKey: set, removeKey: remove, value };
}
