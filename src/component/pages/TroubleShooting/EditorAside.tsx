import React, { useRef, useState } from 'react';
import { category } from '../../../types';
import { deleteCategory, getCategory, postCategory, putCategories } from '../../../services/categoryService';
import IconSelector from '../../util/IconSelector';
import { getBoards } from '../../../services/boardService';

interface EditorProps {
  category: category[];
  setCategory: React.Dispatch<React.SetStateAction<category[]>>;
  setTableInfo: React.Dispatch<React.SetStateAction<any>>;
  setContentPageSection: React.Dispatch<React.SetStateAction<'default' | 'table' | 'editor'>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setError: any;
  setLoading: any;
}


const EditorAside : React.FC<EditorProps> = ({
    category,
    setCategory,
    setTableInfo,
    setContentPageSection,
    editMode,
    setEditMode,
    setError,
    setLoading
}) => {
  // useState //
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

    // useRef //
    const postIconRef = useRef<any>(null);

    // Handler  //
    const handleMouseEnter = (index: number) => {
        setAsideState(prev => ({ ...prev, hoveredIndex: index }));
    };

    const handleMouseLeave = () => {
        setAsideState(prev => ({ ...prev, hoveredIndex: null }));
    };

    const convertBoardTableMode = (id: (string | null | undefined), title: string, icon?: string) => {
        if(editMode) return;
        setContentPageSection('table');
        const fetchData = async() => {
            try {
                const boardResponses = await getBoards(id).catch(err => {
                    setError((prev:any) => ({ 
                        ...prev, 
                        tableInfo: err.message || '카테고리 정보를 가져오는데 실패했습니다' 
                    }));
                    return { data: null };
                });
                
                setLoading((prev:any) => ({ ...prev, tableInfo: false }));
                
                if (boardResponses.data) { 
                    setTableInfo({ id, title, icon , data: boardResponses.data});
                }
                else
                {
                    setTableInfo({id, title, icon, data: null})
                }
            } catch (err) {
                console.error('데이터 로딩 중 에러 발생:', err);
            }
        }

        fetchData();
    };

    const postCategoryHandler = async () => {
        if (!postCategoryData?.title) return;
        
        try 
        {
            const response = await postCategory(postCategoryData);
            alert(response.data);
            
            const refreshedCategories = await getCategory();
            if (refreshedCategories.data) {
                setCategory(refreshedCategories.data);
        }
            setPostCategoryData({ icon: 'fa-solid fa-database', title: '' });
            setSelectedIcon('');
            setAsideState(prev => ({ ...prev, isPostBtnClicked: false }));
        } catch (err) {
            console.error('카테고리 추가 중 에러 발생:', err);
            alert('카테고리 추가에 실패했습니다.');
        }
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

    const convertEditorMode = async() => {
        if(editMode) {
            try {
                const response = await putCategories(category);
                alert(response.message);
                
                const refreshedCategories = await getCategory();
                if (refreshedCategories.data) {
                setCategory(refreshedCategories.data);
            }
                
                setEditMode(false);
            } catch (err) {
                console.error('카테고리 수정 중 에러 발생:', err);
                alert('카테고리 수정에 실패했습니다.');
            }
        } else {
            setEditMode(true);
        }
    };

    const deleteCategoryHandler = async (id: any) => {
        if(!id) return;

        try {
            const response = await deleteCategory(id);
            
            const refreshedCategories = await getCategory();
            if (refreshedCategories.data) {
                setCategory(refreshedCategories.data);
        }
        
            setAsideState(prev => ({ ...prev, isPostBtnClicked: false }));
            
            alert(response.message);
        } catch (err) {
            console.error('카테고리 삭제 중 에러 발생:', err);
            alert('카테고리 삭제에 실패했습니다.');
        }
    };

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

    return (
    <aside className='trouble_aside_section flex flex-col w-[20%] bg-gray h-full text-primary !px-[2em] overflow-auto scrollbar-none max-w-[250px]'>
        <div className='flex items-center !mt-[3em] justify-between text-[1em] !pb-4 border-b !mb-24'>
            <p className='font-bold'>Trouble Shooting</p>
            <i 
                onClick={() => setAsideState(prev => ({ ...prev, isPostBtnClicked: true }))} 
                className="fa-solid fa-plus cursor-pointer"
            ></i>
            <i 
                onClick={convertEditorMode} 
                className={`${editMode ? 'fa-solid fa-floppy-disk cursor-pointer' : 'fa-solid fa-gear cursor-pointer'}`}
            ></i>
        </div>
        <ul className='!mt-[3em] flex flex-col gap-8 !pb-10 font-medium'>
            {category?.map((item, index) => (
            <li 
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => convertBoardTableMode(item.id, item.title, item?.icon)}
                className='flex justify-between hover-aside-primary !p-3 rounded-sm cursor-pointer relative'
            >
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteCategoryHandler(item.id);
                    }} 
                    className={`absolute top-[-5px] left-[-6px] bg-gray
                    border-gray-400 border w-[15px] h-[15px] flex justify-center items-center 
                    rounded-full text-[8px] hover:bg-gray-400 hover:text-white ${editMode ? '' : 'display-none'}`}
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
                />
                </div>
                <div className={asideState.hoveredIndex === index ? '' : 'invisible'}>
                    <i className="fa-solid fa-arrow-right"></i>
                </div>
            </li>
            ))}
            <li className={`flex relative items-center justify-between hover-aside-primary !p-3 rounded-sm cursor-text ${asideState.isPostBtnClicked ? '' : 'invisible'}`}>
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
                    />
                </div>
            </li>
        </ul>
    </aside>
    );
};

export default EditorAside;