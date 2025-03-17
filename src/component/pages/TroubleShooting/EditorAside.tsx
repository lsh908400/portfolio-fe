/**
 * 2025 03 08 - 이상훈
 * 1. useState - 사이드바 상태(호버, 등록, 아이콘박스)
 * 2. React Query - 게시판 데이터 가져오기
 * 3. mutation - 카테고리 추가 / 수정 / 삭제
 * 4. useRef - 등록 아이콘 Ref
 * 5. trigger mutaion - 카테고리 등록 / 삭제 / 수정
 * 6. Handler - 호버 / 테이블모드 컨버터 / 아이콘 등록 / 아이콘박스 끄기 / 편집모드 / 카테고리 타이틀 변경
 */

import React, { useRef, useState } from 'react';
import { category } from '../../../types';
import { deleteCategory, getCategory, postCategory, putCategories } from '../../../services/categoryService';
import IconSelector from '../../util/IconSelector';
import { getBoards } from '../../../services/boardService';
import { CategoryTypeEnum } from '../../../types/enum';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../../util/Loading';

interface EditorProps {
    category: category[];
    setCategory: React.Dispatch<React.SetStateAction<category[]>>;
    setTableInfo: React.Dispatch<React.SetStateAction<any>>;
    setContentPageSection: React.Dispatch<React.SetStateAction<'default' | 'table' | 'editor'>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorAside: React.FC<EditorProps> = ({
    category,
    setCategory,
    setTableInfo,
    setContentPageSection,
    editMode,
    setEditMode,
}) => {
    const queryClient = useQueryClient();

    // 1. useState - 사이드바 상태(호버, 등록, 아이콘박스)
    const [asideState, setAsideState] = useState({
        hoveredIndex: null as number | null,
        isPostBtnClicked: false,
        showIconBox: false,
    });
    const [selectedIcon, setSelectedIcon] = useState<string>('');
    const [postCategoryData, setPostCategoryData] = useState<category>({
        icon: 'fa-solid fa-database',
        title: '',
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null | undefined>(null);


    // 2. React Query - 게시판 데이터 가져오기
    const { 
        isLoading: isBoardsLoading,
    } = useQuery({
        queryKey: ['boards', selectedCategoryId],
        queryFn: async () => {
            if (!selectedCategoryId) return null;
            const response = await getBoards(selectedCategoryId);
            return response.data;
        },
        enabled: !!selectedCategoryId, 
    });

    // 3. mutation - 카테고리 추가 / 수정 / 삭제
    const postCategoryMutation = useMutation({
        mutationFn: (newCategory: category) => postCategory(newCategory),
        onSuccess: async (response) => {
            alert(response.data);
            queryClient.invalidateQueries({ queryKey: ['categories', CategoryTypeEnum.TROUBLE] });
            
            const refreshedCategoriesResponse = await getCategory(CategoryTypeEnum.TROUBLE);
            if (refreshedCategoriesResponse.data) {
                setCategory(refreshedCategoriesResponse.data);
            }
            
            setPostCategoryData({ icon: 'fa-solid fa-database', title: '' });
            setSelectedIcon('');
            setAsideState(prev => ({ ...prev, isPostBtnClicked: false }));
        },
        onError: (error: any) => {
            console.error('카테고리 추가 중 에러 발생:', error);
            alert('카테고리 추가에 실패했습니다.');
        }
    });

    const updateCategoriesMutation = useMutation({
        mutationFn: (updatedCategories: category[]) => putCategories(updatedCategories),
        onSuccess: async (response) => {
            alert(response.message);
            queryClient.invalidateQueries({ queryKey: ['categories', CategoryTypeEnum.TROUBLE] });
            
            const refreshedCategoriesResponse = await getCategory(CategoryTypeEnum.TROUBLE);
            if (refreshedCategoriesResponse.data) {
                setCategory(refreshedCategoriesResponse.data);
            }
            
            setEditMode(false);
        },
        onError: (error: any) => {
            console.error('카테고리 수정 중 에러 발생:', error);
            alert('카테고리 수정에 실패했습니다.');
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (categoryId: string) => deleteCategory(categoryId),
        onSuccess: async (response) => {
            alert(response.message);
            queryClient.invalidateQueries({ queryKey: ['categories', CategoryTypeEnum.TROUBLE] });
            
            const refreshedCategoriesResponse = await getCategory(CategoryTypeEnum.TROUBLE);
            if (refreshedCategoriesResponse.data) {
                setCategory(refreshedCategoriesResponse.data);
            }
            
            setAsideState(prev => ({ ...prev, isPostBtnClicked: false }));
        },
        onError: (error: any) => {
            console.error('카테고리 삭제 중 에러 발생:', error);
            alert('카테고리 삭제에 실패했습니다.');
        }
    });


    // 4. useRef - 등록 아이콘 Ref
    const postIconRef = useRef<any>(null);

    
    // 5. trigger mutaion - 카테고리 등록 / 삭제 / 수정
    const postCategoryHandler = async () => {
        if (!postCategoryData?.title) return;
        postCategoryMutation.mutate(postCategoryData);
    };

    const deleteCategoryHandler = async (id: any) => {
        if (!id) return;
        deleteCategoryMutation.mutate(id);
    };

    const convertEditorMode = async () => {
        if (editMode) {
            updateCategoriesMutation.mutate(category);
        } else {
            setEditMode(true);
        }
    };


    // 6. Handler - 호버 / 테이블모드 컨버터 / 아이콘 등록 / 아이콘박스 끄기 / 편집모드 / 카테고리 타이틀 변경
    const handleMouseEnter = (index: number) => {
        setAsideState(prev => ({ ...prev, hoveredIndex: index }));
    };

    const handleMouseLeave = () => {
        setAsideState(prev => ({ ...prev, hoveredIndex: null }));
    };

    const convertBoardTableMode = async (id: string | null | undefined, title: string, icon?: string) => {
        if (editMode) return;
        setContentPageSection('table');
        
        setSelectedCategoryId(id);
        
        setTableInfo({ 
            id, 
            title, 
            icon, 
            data: [], 
            isLoading: true
        });
        
        queryClient.invalidateQueries({ queryKey: ['boards', id] });
    };

    const postCategoryIcon = (e: React.MouseEvent, icon: string) => {
        e.stopPropagation();
        setSelectedIcon(icon);
        setPostCategoryData(prev => ({ ...prev, icon }));
        setAsideState(prev => ({ ...prev, showIconBox: false }));
    };

    const closeIconBox = () => {
        setAsideState(prev => ({ ...prev, showIconBox: false }));
    };

    const handleTitleChange = (index: number, newTitle: string) => {
        const updatedCategories = [...category];
        
        updatedCategories[index] = {
            ...updatedCategories[index],
            title: newTitle
        };
        
        setCategory(updatedCategories);
    };

    const isLoading = postCategoryMutation.isPending || 
                    updateCategoriesMutation.isPending || 
                    deleteCategoryMutation.isPending || 
                    (isBoardsLoading && !!selectedCategoryId);

    return (
        <aside className='trouble_aside_section flex flex-col w-[20%] bg-gray h-full text-primary !px-[2em] overflow-auto scrollbar-none max-w-[250px]'>
            {isLoading && (
                <div className="absolute top-4 right-4 z-10">
                    <Loading />
                </div>
            )}
            
            <div className='flex items-center !mt-[3em] justify-between text-[1em] !pb-4 border-b !mb-24'>
                <p className='font-bold'>Trouble Shooting</p>
                <i 
                    onClick={() => setAsideState(prev => ({ ...prev, isPostBtnClicked: true }))} 
                    className={`fa-solid fa-plus cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-disabled={isLoading}
                ></i>
                <i 
                    onClick={convertEditorMode} 
                    className={`${editMode ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-gear'} cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-disabled={isLoading}
                ></i>
            </div>
            
            <ul className='!mt-[3em] flex flex-col gap-8 !pb-10 font-medium'>
                {category?.map((item, index) => (
                <li 
                    key={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => convertBoardTableMode(item.id, item.title, item?.icon)}
                    className={`flex justify-between hover-aside-primary !p-3 rounded-sm cursor-pointer relative ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                >
                    <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteCategoryHandler(item.id);
                    }} 
                    className={`absolute top-[-5px] left-[-6px] bg-gray
                    border-gray-400 border w-[15px] h-[15px] flex justify-center items-center 
                    rounded-full text-[8px] hover:bg-gray-400 hover:text-white ${editMode ? '' : 'display-none'} ${isLoading ? 'pointer-events-none' : ''}`}
                    >
                    <i className='fa-solid fa-minus'></i>
                    </div>
                    <div className='flex items-center'>
                    <i className={`${item.icon} !mr-2`}></i>
                    <input 
                        readOnly={!editMode}
                        value={item.title} 
                        onChange={(e) => handleTitleChange(index, e.target.value)}
                        className={`bg-transparent outline-none w-20 ${editMode ? 'cursor-text' : 'cursor-pointer'}`}
                        disabled={isLoading}
                    />
                    </div>
                    <div className={asideState.hoveredIndex === index ? '' : 'invisible'}>
                    <i className="fa-solid fa-arrow-right"></i>
                    </div>
                </li>
                ))}
                
                <li className={`flex relative items-center justify-between hover-aside-primary !p-3 rounded-sm cursor-text ${asideState.isPostBtnClicked ? '' : 'invisible'} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
                <div className='flex items-center'>
                    <IconSelector
                    showIconBox={asideState.showIconBox}
                    onIconSelect={postCategoryIcon}
                    onClose={closeIconBox}
                    />
                    <div 
                    ref={postIconRef} 
                    onClick={() => setAsideState(prev => ({ ...prev, showIconBox: !prev.showIconBox }))}
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
                    disabled={isLoading}
                    />
                </div>
                </li>
            </ul>
        </aside>
    );
};

export default EditorAside;