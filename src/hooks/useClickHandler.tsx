import { useRef, useEffect } from 'react';

const useClickHandler = (callback: (e: React.MouseEvent) => void) => {
  const clickHandlerRef = useRef<(e: React.MouseEvent) => void>(null);

  useEffect(() => {
    clickHandlerRef.current = callback;
  }, [callback]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    clickHandlerRef.current?.(e);
  };

  return handleClick;
};

export default useClickHandler;
