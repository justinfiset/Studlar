import { useEffect, useState } from 'react';

export function ClientOnly({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return children;
}