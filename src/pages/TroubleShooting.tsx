/**
 * 2025 03 08 - 이상훈
 * 1. useState - page상태 / 수정모드 / 테이블정보 / 에디터정보 / 카테고리 / 로딩 / 에러
 * 2. 데이터 전송
 */

import React, { useEffect, useState, useMemo } from 'react';
import Editor from '../component/pages/TroubleShooting/Editor';
import EditorIntro from '../component/pages/TroubleShooting/EditorIntro';
import EditorTable from '../component/pages/TroubleShooting/EditorTable';
import { BlockData, category } from '../types';
import { getCategory } from '../services/categoryService';
import EditorAside from '../component/pages/TroubleShooting/EditorAside';
import { CategoryTypeEnum } from '../types/enum';

const TroubleShooting: React.FC = () => {
    // 1. useState - page상태 / 수정모드 / 테이블정보 / 에디터정보 / 카테고리 / 로딩 / 에러
    const [contentPageSection, setContentPageSection] = useState<'default' | 'table' | 'editor'>('default');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [tableInfo, setTableInfo] = useState<{
        id : string,
        title : string,
        icon : string,
        data : any
    }>({
        id : '',
        title : '',
        icon : '',
        data : null
    });
    const [editorInfo,setEditorInfo] = useState<{
        id? : string,
        title? : string,
        icon : string,
        blockData : BlockData[]| undefined
    }>({
        id : '',
        title : '',
        icon : '',
        blockData : []
    })
    const [category, setCategory] = useState<category[]>([]);

    const [loading, setLoading] = useState({
        category: true,
        tableInfo : true,
        editorInfo : true,
    });
    const [error, setError] = useState({
        category: null as string | null,
        tableInfo: null as string | null,
        editorInfo: null as string | null,
    });
    
    
    // 2. 데이터 전송
    useEffect(() => {
        const controller = new AbortController();
        
        const fetchData = async () => {
            try {
                const categoryResponse = await getCategory(CategoryTypeEnum.TROUBLE).catch(err => {
                    setError(prev => ({ 
                        ...prev, 
                        category: err.message || '카테고리 정보를 가져오는데 실패했습니다' 
                    }));
                    return { data: null };
                });
                
                setLoading(prev => ({ ...prev, category: false }));
                
                if (categoryResponse.data) {
                    setCategory(categoryResponse.data);
                }
            } catch (err) {
                console.error('데이터 로딩 중 에러 발생:', err);
            }
        };
    
        fetchData();
    
        return () => {
            controller.abort();
        };
    }, []);

    // render  //
    const renderContent = useMemo(() => {
        switch(contentPageSection) {
            case 'default': 
                return <EditorIntro />;
            case 'table': 
                return <EditorTable 
                        tableInfo={tableInfo}
                        setTableInfo={setTableInfo}
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                        setContentPageSection={setContentPageSection}
                        setEditorInfo={setEditorInfo}
                        />;
            case 'editor': 
                return <Editor
                        initialData={editorInfo.blockData}
                        id={editorInfo.id}
                        setEditorInfo={setEditorInfo}
                        editorInfo={editorInfo}
                        />;
            default: 
                return null;
        }
    }, [contentPageSection, tableInfo, editorInfo]);

    // Loading && Error //
    if (loading.category) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }

    if (error.category) {
        return (
            <div className="error-container">
                <h3>데이터를 불러오는데 문제가 발생했습니다</h3>
                {error.category && <p>카테고리 정보: {error.category}</p>}
                <button onClick={() => window.location.reload()}>다시 시도</button>
            </div>
        );
    }

    return (
        <div id='trouble_shooting' className='flex h-full w-full'>
            <EditorAside 
                category={category}
                setCategory={setCategory}
                setTableInfo={setTableInfo}
                setContentPageSection={setContentPageSection}
                editMode={editMode}
                setEditMode={setEditMode}
                setError={setError}
                setLoading={setLoading}
            />
            <main className='trouble_content_section bg-white flex-grow flew h-full'>
                {renderContent}
            </main>
        </div>
    );
};

export default TroubleShooting;