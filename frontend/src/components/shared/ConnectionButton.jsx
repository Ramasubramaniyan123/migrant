import { useState } from 'react';
import Button from '@/components/common/Button';
import { useAuthContext } from '@/context/AuthContext';
import { useConnections } from '@/hooks/useConnections';
/** Renders the correct connection action (connect, cancel, accept or connected) for a user. */
export default function ConnectionButton({
  userId,
  onSent,
  size = 'md'
}) {
  const {
    user
  } = useAuthContext();
  const {
    getStatus,
    sendRequest,
    accept,
    cancel,
    sentRequests,
    receivedRequests
  } = useConnections();
  const [isBusy, setIsBusy] = useState(false);
  const run = async action => {
    setIsBusy(true);
    try {
      await action();
    } finally {
      setIsBusy(false);
    }
  };
  const status = getStatus(userId);
  const outgoing = sentRequests.find(row => row.requesterId === user?.id && row.receiverId === userId);
  const incoming = receivedRequests.find(row => row.receiverId === user?.id && row.requesterId === userId);
  if (status === 'ACCEPTED') {
    return <Button variant="secondary" size={size} disabled>
        Connected
      </Button>;
  }
  if (outgoing) {
    return <Button variant="secondary" size={size} isLoading={isBusy} onClick={() => void run(() => cancel(outgoing.id))}>
        Cancel request
      </Button>;
  }
  if (incoming) {
    return <Button variant="primary" size={size} isLoading={isBusy} onClick={() => void run(() => accept(incoming.id))}>
        Accept request
      </Button>;
  }
  return <Button variant="primary" size={size} isLoading={isBusy} onClick={() => void run(async () => {
    await sendRequest(userId, 0, 'LOCATION');
    onSent?.();
  })}>
      Connect
    </Button>;
}
