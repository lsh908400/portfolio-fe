import React, { useState } from 'react'
import CommonTable from '../../util/CommonTable';
import { board } from '../../../types';
import { deleteBoards, getBoards, postBoard, searchBoards } from '../../../services/boardService';
import PostBoardModal from './Modal/PostBoardModal';
import DeleteBoardModal from './Modal/DeleteModal';
import { getBlocks } from '../../../services/blockService';

interface TableInfoType {
    id : string;
    title : string;
    icon : string;
    data : board[];
}

interface LoadingType {
    category : boolean,
    tableInfo : boolean,
    editorInfo : boolean
}
interface EditorTableProps {
    tableInfo : TableInfoType,
    setTableInfo : any,
    loading : LoadingType
    setLoading : any,
    setError : any,
    error : any,
    setContentPageSection : any,
    setEditorInfo : any,
}
const EditorTable : React.FC<EditorTableProps> = ({tableInfo,setTableInfo,loading,setLoading,error,setError,setContentPageSection,setEditorInfo}) => {
    const [modalState, setModalState] = useState<any>({
        postBoard : false
    })
    const [board, setBoard] = useState<{
        postBoard : string,
        deleteBoard : (string|number)[],
    }>({
        postBoard : '',
        deleteBoard : [],
    });

    
    // CheckHandler //
    const onCheckChange = (ids : (string| number)[]) => {
        setBoard({...board, deleteBoard : ids})
    }

    // ClickHandler //
    const onClickHandler = async (row : any) => {
        try {
            // 먼저 로딩 상태를 true로 변경
            setLoading((prev:any) => ({ ...prev, editorInfo: true }));
            
            const id = row.id;
            const title = row.title;
            
            // 데이터를 기다림
            const response = await getBlocks(id, title);
            
            // 데이터가 성공적으로 받아지면 editorInfo 상태 업데이트
            setEditorInfo((prev : any) => ({
                ...prev, title, blockData: response.data
            }));
            
            // 로딩 완료
            setLoading((prev:any) => ({ ...prev, editorInfo: false }));
            
            // 데이터 로드 후 화면 전환
            setContentPageSection('editor');
        } catch (err: any) {
            setError((prev:any) => ({
                ...prev,
                editorInfo: err.message || '게시글 블러오기에 실패했습니다'
            }));
            setLoading((prev:any) => ({ ...prev, editorInfo: false }));
        }
    }


    const openPostBoardModal = () => {
        setModalState({...modalState, postBoard : true});
        setBoard({...board, postBoard : ''})
    }

    const openDeleteModal = () => {
        if(!(board.deleteBoard.length>0))
        {
            alert('삭제할 게시글을 선택해주세요.')
            return;
        }
        setModalState({...modalState, deleteBoard : true})
    }

    const postBoardHandler = () => {
        const fetchData = async () => {
            try
            {
                const response = await postBoard(tableInfo.id, board.postBoard).catch(err => {
                    setError((prev:any) => ({ 
                        ...prev, 
                        tableInfo: err.message || '게시글 등록을 실패했습니다' 
                    }));
                    return { data: null};
                })
                alert(response.message)

                setLoading((prev:any) => ({ ...prev, tableInfo: false }));
                const responseRefresh = await getBoards(tableInfo.id);
                if (responseRefresh.data) {
                    setTableInfo((prev:any) =>({...prev, data : responseRefresh.data}));
                }
                setModalState({...modalState, postBoard : false});
            }
            catch(err)
            {
                console.error('게시글 등록 중 에러 발생:', err);
            }
        }
        fetchData();
    }

    const postKeyDownHandler = (e: React.KeyboardEvent) => {
        if(e.key==='Enter')
        {
            const fetchData = async () => {
                try
                {
                    const response = await postBoard(tableInfo.id, board.postBoard).catch(err => {
                        setError((prev:any) => ({ 
                            ...prev, 
                            tableInfo: err.message || '게시글 등록을 실패했습니다' 
                        }));
                        return { data: null};
                    })
                    alert(response.message)
    
                    setLoading((prev:any) => ({ ...prev, tableInfo: false }));
                    const responseRefresh = await getBoards(tableInfo.id);
                    if (responseRefresh.data) {
                        setTableInfo((prev:any) =>({...prev, data : responseRefresh.data}));
                    }
                    setModalState({...modalState, postBoard : false});
                }
                catch(err)
                {
                    console.error('게시글 등록 중 에러 발생:', err);
                }
            }
            fetchData();
        }
    }

    const deleteBoardHandler = () => {
        const fetchData = async () => {
            try {   
                const deleteIds = board.deleteBoard;
                const response = await deleteBoards(deleteIds).catch(err => {
                    setError((prev:any) => ({
                        ...prev,
                        tableInfo: err.message || '게시글 삭제를 실패했습니다.'
                    }));
                    return {data : null};
                })
                alert(response.message)
    
                setLoading((prev:any) => ({...prev, tableInfo : false}));
                const responseRefresh = await getBoards(tableInfo.id);
                if (responseRefresh.data) {
                    setTableInfo((prev:any) =>({...prev, data : responseRefresh.data}));
                }
                setModalState({...modalState, deleteBoard : false});
                
                // 삭제 후 체크박스 초기화
                setBoard(prev => ({...prev, deleteBoard : []}));
            }
            catch(err) {
                console.error('게시글 삭제 중 에러 발생:', err)
            }
        }
        fetchData();
    }

    const boardTitlechangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setBoard({...board, postBoard : e.target.value})
    }

    const searchBoardHandler = (option: string, keyword: string) => {
        const fetchData = async () => {
            try
            {
                const response = await searchBoards(option, keyword, tableInfo.id).catch(err => {
                    setError((prev:any) => ({
                        ...prev,
                        tableInfo: err.message || '게시글 조회를 실패했습니다.'
                    }));
                    return {data : null};
                })

                setLoading((prev:any) => ({...prev, tableInfo : false}));
                setTableInfo((prev:any) =>({...prev, data : response.data}));
            }
            catch(err)
            {
                console.error('게시글 검색 중 에러 발생:', err)
            }
        }

        fetchData();
    }



    const columns = [
        { id: 'id', header: 'No.', accessor: 'id', width: '10%' },
        { id: 'title', header: '제목', accessor: (row: any) => (
            <><i className={`fa-solid fa-bullhorn mr-1 ${(row.categoryId === '0' || row.categoryId === 0) ? '' : 'display-none'}`}></i>{row.title}</>
        ), width: '40%' },
        { id: 'createAt', header: '작성일', accessor: 'createAt', width: '20%' },
        { id: 'modifyAt', header: '최종수정일', accessor: 'modifyAt', width: '20%' },
    ];
    
    // Loading && Error //
    if (loading.tableInfo) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }

    if (error.tableInfo) {
        return (
            <div className="error-container">
                <h3>데이터를 불러오는데 문제가 발생했습니다</h3>
                {error.tableInfo && <p>카테고리 정보: {error.tableInfo}</p>}
                <button onClick={() => window.location.reload()}>다시 시도</button>
            </div>
        );
    }
    return (
    <section className='h-full w-full !p-10 overflow-auto'>
        <div className='text-[1.5em] flex items-center gap-2 !mb-24'>
            <i className={`${tableInfo.icon}`}></i>
            <p>{tableInfo.title}</p>
        </div>
        <CommonTable
            columns={columns}
            data={tableInfo.data}
            onSearch={searchBoardHandler}
            editButton={{show: false}}
            checkedItems={board.deleteBoard} 
            searchOptions ={[{ value: 'title', label: '제목' }]}
            defaultSearchOption='title'
            registerButton={{show: true, onClick: openPostBoardModal, label : '등록'}}
            deleteButton={{show: true, onClick: openDeleteModal, label: '삭제'}}
            rowClickable={true}
            onRowClick={(row) => {onClickHandler(row)}}
            showCheckbox={true}
            onCheckChange={(ids) => {onCheckChange(ids)}}
        />
        <PostBoardModal
            isOpen={modalState.postBoard}
            onClose={() => setModalState({ ...modalState, postBoard: false })}
            board={board}
            changeHandler={boardTitlechangeHandler}
            postKeyDownHandler={postKeyDownHandler}
            postBoardHandler={postBoardHandler}
        />
      
        <DeleteBoardModal
            isOpen={modalState.deleteBoard}
            onClose={() => setModalState({ ...modalState, deleteBoard: false })}
            deleteBoardHandler={deleteBoardHandler}
        />
    </section>
    
    )
}

export default  EditorTable;