import { useConnectionContext } from '@/context/ConnectionContext';

/** Connection requests, accepted connections and the actions that change them. */
export function useConnections() {
  return useConnectionContext();
}
