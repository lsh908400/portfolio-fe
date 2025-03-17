/**
 * 2025 03 16 - 이상훈
 * 1. useState - pageSection  
 * 2. searchParams - 타입   
 * 3. renderContent - 블록 데이터 로딩 상태 처리 추가
 */

import React, { useEffect, useMemo, useState } from 'react'
import { ReactInfoSectionTypeEnum } from '../types/enum';
import { BlockData, board } from '../types';
import { useSearchParams } from 'react-router-dom';
import StudyIntro from '../component/pages/Study/StudyIntro';
import StudyAside from '../component/pages/Study/StudyAside';
import StudyContent from '../component/pages/Study/StudyContent';
import Loading from '../component/util/Loading';

const Study: React.FC = () => {
    // 1. useState - pageSection
    const [contentPageSection, setContentPageSection] = useState<ReactInfoSectionTypeEnum>(ReactInfoSectionTypeEnum.INTRO);
    const [board, setBoard] = useState<{ type: ReactInfoSectionTypeEnum, board: board }[]>([]);
    const [editorInfo, setEditorInfo] = useState<{
        id?: string,
        title?: string,
        icon: string,
        blockData: BlockData[] | undefined,
        isLoading: boolean // 블록 데이터 로딩 상태
    }>({
        id: '',
        title: '',
        icon: '',
        blockData: [],
        isLoading: false
    })

    // 2. searchParams - 타입 
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    // 3. renderContent - 블록 데이터 로딩 상태 처리 추가
    const renderContent = useMemo(() => {
        // 페이지 섹션이 INTRO가 아니고 블록 데이터가 로딩 중인 경우
        if (contentPageSection !== ReactInfoSectionTypeEnum.INTRO && editorInfo.isLoading) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                        <Loading />
                        <p className="text-gray-600 mt-4">블록 데이터를 불러오는 중입니다...</p>
                    </div>
                </div>
            );
        }

        // 타입에 따른 컨텐츠 렌더링
        switch (contentPageSection) {
            case ReactInfoSectionTypeEnum.INTRO:
                return <StudyIntro type={type} />;
            default:
                return <StudyContent
                    editorInfo={editorInfo}
                    setEditorInfo={setEditorInfo}
                />;
        }
    }, [contentPageSection, editorInfo, type]);

    // 타입이 변경될 때 페이지 섹션을 초기화
    useEffect(() => {
        if (!type) return;
        setContentPageSection(ReactInfoSectionTypeEnum.INTRO);
        
        // 에디터 정보 초기화
        setEditorInfo({
            id: '',
            title: '',
            icon: '',
            blockData: [],
            isLoading: false
        });
    }, [type]);

    return (
        <div id='react_info' className='w-full h-full flex'>
            <StudyAside
                setContentPageSection={setContentPageSection}
                board={board}
                setBoard={setBoard}
                setEditorInfo={setEditorInfo}
                type={type}
            />
            <main className='react_info_content_section bg-white flex-grow flew h-full'>
                {renderContent}
            </main>
        </div>
    )
}

export default Study;