import { useConnectionContext } from '@/context/ConnectionContext';

export const useConnections = () => {
  return useConnectionContext();
};
