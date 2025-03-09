import React, { useEffect, useState } from 'react'
/**
 * 
 * @param domRef 
 * 2025-02-27 20:40
 * 돔레프를 통해서 현재 돔의 size와 좌표값을 리턴하는 훅
 * @returns 
 */
const useCurrentDomSize = (domRef : React.RefObject<HTMLElement>) => {
  const [size , setSize] = useState({width:0, height:0, top:0, left:0})

  useEffect(()=>{
    const element = domRef.current;

    if(!element) return;

    const resizeObserver = new ResizeObserver(()=>{
        setSize({
            width : element.offsetWidth,
            height: element.offsetHeight,
            top : element.offsetTop,
            left : element.offsetLeft,
        })
    })

    resizeObserver.observe(element);

    // 컴포넌트가 unmount 될 때 해제
    return () => {
        resizeObserver.disconnect();
    };
  }, [domRef]);

  return size;
}

export default useCurrentDomSize;
