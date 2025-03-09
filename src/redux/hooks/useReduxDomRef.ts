// src/hooks/useReduxDomRef.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setProjectDomId, clearProjectDomId } from '../slices/domSlice';

export function useReduxDomRef(id: string) {
  const dispatch = useAppDispatch();
  const projectDomId = useAppSelector((state) => state.dom.projectDomId);
  
  useEffect(() => {
    dispatch(setProjectDomId(id));
    
    return () => {
      dispatch(clearProjectDomId());
    };
  }, [dispatch, id]);
  
  const getDomElement = (): HTMLElement | null => {
    if (!projectDomId) return null;
    return document.getElementById(projectDomId);
  };
  
  return { getDomElement, projectDomId };
}