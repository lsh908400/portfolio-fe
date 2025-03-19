/**
 * 2025 03 19 - 이상훈
 * 1. useState - 페이지섹션 
 * 2. useRef - 컨텐트 레프(스크롤을 위한)
 * 3. convert - 타입별 랜더
 * 4. useEffect - 초기치 설정 및 초기화 / 스크롤
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import PrevProjectAside from '../component/pages/PrevProject/PrevProjectAside';
import { PrevProSectionTypeEnum } from '../types/enum';
import LotteOn from '../component/pages/PrevProject/LotteOn';
import PlanTry from '../component/pages/PrevProject/PlanTry';

const PrevProject : React.FC = () => {

    // 1. useState - 페이지섹션 
    const [contentPageSection,setContentPageSection] = useState<PrevProSectionTypeEnum>(); 


    // 2. useRef - 컨텐트 레프(스크롤을 위한)
    const contentRef = useRef<HTMLDivElement>(null);


    // 3. convert - 타입별 랜더
    const renderContent = useMemo(()=>{
        switch(contentPageSection)
        {
            case PrevProSectionTypeEnum.LOTTE :
                return <LotteOn />;
            case PrevProSectionTypeEnum.PLANTRY :
                return <PlanTry />;
        }
    },[contentPageSection])


    // 4. useEffect - 초기치 설정 및 초기화 / 스크롤
    useEffect(()=>{
        setContentPageSection(PrevProSectionTypeEnum.LOTTE)

        return () => {
            setContentPageSection(PrevProSectionTypeEnum.NONE)
        }
    },[])

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [contentPageSection]);

    return (
        <div id='prev_project' className='h-full w-full flex'>
            <PrevProjectAside 
                setContentPageSection={setContentPageSection}
                contentPageSection={contentPageSection}
            />
            <div ref={contentRef} className='w-full h-full font-sans !p-4 overflow-auto'>
                {renderContent}
            </div>
        </div>
    )
}

export default PrevProject;
