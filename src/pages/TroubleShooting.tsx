/**
 * Trouble Shooting Component 
 * 
 *  2025-03-12 - 이상훈
 *  1. trouble_aside : 어사이드 기능, 해당 카테고리로 이동 및 카테고리 추가 삭제
 *  2. trouble_content_section : 카테고리 이동시 게시판 , 게시판 선택시 커스텀 Editor로 전환, 에디팅 기능
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Editor from '../component/pages/TroubleShooting/Editor';
import EditorIntro from '../component/pages/TroubleShooting/EditorIntro';
import EditorTable from '../component/pages/TroubleShooting/EditorTable';
import { category } from '../types';
import { deleteCategory, getCategory, postCategory, putCategories } from '../services/categoryService';

const iconItems = [
    {name : 'fa-solid fa-check'},
    {name : 'fa-solid fa-house'},
    {name : 'fa-solid fa-circle-user'},
    {name : 'fa-solid fa-image'},
    {name : 'fa-solid fa-file'},
    {name : 'fa-solid fa-camera'},
    {name : 'fa-solid fa-calendar'},
    {name : 'fa-solid fa-cloud'},
    {name : 'fa-solid fa-desktop'},
    {name : 'fa-solid fa-palette'},
    {name : 'fa-solid fa-truck'},
    {name : 'fa-solid fa-headphones'},
    {name : 'fa-solid fa-bell'},
    {name : 'fa-solid fa-user'},
    {name : 'fa-solid fa-comment'},
    {name : 'fa-solid fa-envelope'},
    {name : 'fa-solid fa-magnifying-glass'},
    {name : 'fa-solid fa-download'},
    {name : 'fa-solid fa-bars'},
    {name : 'fa-solid fa-users'},
    {name : 'fa-solid fa-phone'},
    {name : 'fa-solid fa-music'},
    {name : 'fa-solid fa-bomb'},
    {name : 'fa-solid fa-xmark'},
    {name : 'fa-solid fa-arrow-up'},
    {name : 'fa-solid fa-arrow-down'},
    {name : 'fa-solid fa-arrow-right'},
    {name : 'fa-solid fa-arrow-left'},
    {name : 'fa-solid fa-paperclip'},
    {name : 'fa-solid fa-clipboard'},
    {name : 'fa-solid fa-pen'},
    {name : 'fa-solid fa-umbrella'},
    {name : 'fa-solid fa-gift'},
    {name : 'fa-solid fa-list'},
    {name : 'fa-solid fa-trash'},
    {name : 'fa-solid fa-lock'},
    {name : 'fa-solid fa-car'},
]

const TroubleShooting: React.FC = () => {
    // useState //
    const [uiState, setUiState] = useState({
        hoveredIndex: null as number | null,
        contentPageSection: 'default' as 'default' | 'table' | 'editor',
        isPostBtnClicked: false,
        showIconBox: false,
        editMode: false,
    });
    
    const [tableInfo, setTableInfo] = useState<any>(null);
    const [category, setCategory] = useState<category[]>([]);
    const [selectedIcon, setSelectedIcon] = useState<string>('');
    const [postCategoryData, setPostCategoryData] = useState<category>({
        icon: 'fa-solid fa-database',
        title: '',
    });
    const [loading, setLoading] = useState({
        category: true,
    });
    const [error, setError] = useState({
        category: null as string | null,
    });
    

    // useRef //
    const postIconRef = useRef<any>(null);

    // fetchData //
    useEffect(() => {
        const controller = new AbortController();
        
        const fetchData = async () => {
            try {
                const categoryResponse = await getCategory().catch(err => {
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

    // Handler  //
    const handleMouseEnter = (index: number) => {
        setUiState(prev => ({ ...prev, hoveredIndex: index }));
    };

    const handleMouseLeave = () => {
        setUiState(prev => ({ ...prev, hoveredIndex: null }));
    };

    const converBoardTableMode = (id: (string | null | undefined), title: string, icon?: string) => {
        if(uiState.editMode) return;
        setUiState(prev => ({ ...prev, contentPageSection: 'table' }));
        setTableInfo({ id, title, icon });
    };

    const postCategoryHandler = async () => {
        if (!postCategoryData?.title) return;
        
        try {
            const response = await postCategory(postCategoryData);
            alert(response.data);
            
            const refreshedCategories = await getCategory();
            if (refreshedCategories.data) {
                setCategory(refreshedCategories.data);
            }
            
            setPostCategoryData({ icon: 'fa-solid fa-database', title: '' });
            setSelectedIcon('');
            setUiState(prev => ({ ...prev, isPostBtnClicked: false }));
            
        } catch (err) {
            console.error('카테고리 추가 중 에러 발생:', err);
            alert('카테고리 추가에 실패했습니다.');
        }
    };

    const postCategoryIcon = (e: React.MouseEvent, icon: string) => {
        e.stopPropagation();
        setSelectedIcon(icon);
        setPostCategoryData(prev => ({ ...prev, icon }));
        setUiState(prev => ({ ...prev, showIconBox: false }));
    };

    const convertEditorMode = async() => {
        if(uiState.editMode)
        {
            try {
                const response = await putCategories(category);
                alert(response.message);
                
                const refreshedCategories = await getCategory();
                if (refreshedCategories.data) {
                    setCategory(refreshedCategories.data);
                }
                
                setUiState(prev => ({...prev, editMode : !uiState.editMode}))
            } catch (err) {
                console.error('카테고리 추가 중 에러 발생:', err);
                alert('카테고리 추가에 실패했습니다.');
            }
            
        }
        else
        {
            setUiState(prev => ({...prev, editMode : !uiState.editMode}))
        }
    }

    const deleteCategoryHandler = async (id: any) => {
        if(!id) return;

        try {
            const response = await deleteCategory(id);
            
            const refreshedCategories = await getCategory();
            if (refreshedCategories.data) {
                setCategory(refreshedCategories.data);
            }
            
            setUiState(prev => ({ ...prev, isPostBtnClicked: false }));
            
            alert(response.message)
        } catch (err) {
            console.error('카테고리 삭제 중 에러 발생:', err);
            alert('카테고리 삭제에 실패했습니다.');
        }
    }

    const handleTitleChange = (index: number, newTitle: string) => {
        // 배열의 복사본 생성
        const updatedCategories = [...category];
        
        // 해당 인덱스의 항목 업데이트
        updatedCategories[index] = {
          ...updatedCategories[index],
          title: newTitle
        };
        
        // 업데이트된 배열로 상태 설정
        setCategory(updatedCategories);
      };

    // render  //
    const renderContent = useMemo(() => {
        switch(uiState.contentPageSection) {
            case 'default': 
                return <EditorIntro />;
            case 'table': 
                return <EditorTable tableInfo={tableInfo}/>;
            case 'editor': 
                return <Editor/>;
            default: 
                return null;
        }
    }, [uiState.contentPageSection, tableInfo]);

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
            <aside className='trouble_aside_section flex flex-col w-[20%] bg-gray h-full text-primary !px-[2em] overflow-auto scrollbar-none max-w-[250px]'>
                <div className='flex items-center !mt-[3em] justify-between text-[1em] !pb-4 border-b !mb-24'>
                    <p className='font-bold'>Trouble Shooting</p>
                    <i 
                        onClick={() => setUiState(prev => ({ ...prev, isPostBtnClicked: true }))} 
                        className="fa-solid fa-plus cursor-pointer"
                    ></i>
                    <i onClick={convertEditorMode} className={`${uiState.editMode ? 'fa-solid fa-floppy-disk cursor-pointer' : 'fa-solid fa-gear cursor-pointer'}`}></i>
                </div>
                <ul className='!mt-[3em] flex flex-col gap-8 !pb-10 font-medium'>
                    {category?.map((item, index) => (
                        <li 
                            key={index}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => converBoardTableMode(item.id, item.title, item?.icon)}
                            className='flex justify-between hover-aside-primary !p-3 rounded-sm cursor-pointer relative'
                        >
                            <div 
                                onClick={()=>deleteCategoryHandler(item.id)} 
                                className={`absolute top-[-5px] left-[-6px] bg-gray
                                border-gray-400 border w-[15px] h-[15px] flex justify-center items-center 
                                rounded-full text-[8px] hover:bg-gray-400 hover:text-white ${uiState.editMode ? '' : 'display-none'}`}>
                                <i className='fa-solid fa-minus'></i>
                            </div>
                            <div className='flex items-center'>
                                <i className={`${item.icon} !mr-2`}></i>
                                <input 
                                    readOnly={!uiState.editMode}
                                    value={item.title} 
                                    onChange={(e) => handleTitleChange(index, e.target.value)}
                                    className={`bg-transparent outline-none ${uiState.editMode ? 'cursor-text' : 'cursor-pointer'}`}
                                />
                            </div>
                            <div className={uiState.hoveredIndex === index ? '' : 'invisible'}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </div>
                        </li>
                        ))}
                    <li className={`flex relative items-center justify-between hover-aside-primary !p-3 rounded-sm cursor-text ${uiState.isPostBtnClicked ? '' : 'invisible'}`}>
                        <div className='flex items-center'>
                            <div className={`icon_box absolute top-3 left-8 !border-black border w-[180px] h-[180px] bg-white !px-2 overflow-auto ${uiState.showIconBox ? '': 'display-none'}`}>
                                <div className='flex justify-between items-center'>
                                    <p>아이콘 선택</p>
                                    <i 
                                        onClick={() => setUiState(prev => ({ ...prev, showIconBox: false }))} 
                                        className='fa-solid fa-xmark cursor-pointer'
                                    ></i>
                                </div>
                                <div className='flex flex-wrap'>
                                    {iconItems.map((item) => (
                                        <span 
                                            onClick={(e) => postCategoryIcon(e, item.name)}
                                            key={item.name} 
                                            className='w-[20px] h-[20px] border flex items-center justify-center'
                                        >
                                            <i className={`${item.name} cursor-pointer`}></i>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div 
                                ref={postIconRef} 
                                onClick={() => setUiState(prev => ({ ...prev, showIconBox: !prev.showIconBox }))}
                                className='flex items-center cursor-pointer'
                            >
                                {selectedIcon === '' ? (
                                    <>
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </>
                                ) : (
                                    <i className={selectedIcon}></i>
                                )}
                            </div>
                            <input 
                                value={postCategoryData.title} 
                                onKeyDown={(e) => e.key === "Enter" && postCategoryHandler()}
                                onChange={(e) => setPostCategoryData(prev => ({ ...prev, title: e.target.value }))} 
                                className='!ml-2 w-full' 
                                placeholder="카테고리명 입력"
                            />
                        </div>
                    </li>
                </ul>
            </aside>
            <main className='trouble_content_section bg-white flex-grow flew h-full'>
                {renderContent}
            </main>
        </div>
    );
};

export default TroubleShooting;