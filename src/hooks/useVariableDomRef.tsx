import { useState, useEffect, useRef } from 'react';

/**
 * DOM 요소를 ID로 찾아 참조하는 커스텀 훅
 * @param id 찾을 DOM 요소의 ID
 * @returns domRef: 찾은 DOM 요소 참조, setCurrentId: ID 변경 함수
 */
const useVariableDomRef = (id: string) => {
  const [currentId, setCurrentId] = useState(id);
  const domRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // ID가 바뀔 때마다 새로운 DOM을 참조하도록 업데이트
    const element = document.querySelector(`#${currentId}`);
    if (element) {
      domRef.current = element as HTMLElement;
    } else {
      domRef.current = null;
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      domRef.current = null;
    };
  }, [currentId]);

  return { domRef, setCurrentId };
};

export default useVariableDomRef;