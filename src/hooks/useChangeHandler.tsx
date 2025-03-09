import { useRef, useEffect } from 'react';

const useChangeHandler = (callback: (e: React.ChangeEvent, value: string) => void) => {
  const changeHandlerRef = useRef<(e: React.ChangeEvent, value: string) => void>(null);
  
  useEffect(() => {
    changeHandlerRef.current = callback;
  }, [callback]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    changeHandlerRef.current?.(e, e.target.value);
  };
  
  return handleChange;
};

export default useChangeHandler;