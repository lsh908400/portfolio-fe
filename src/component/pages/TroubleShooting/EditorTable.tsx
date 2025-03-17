/**
 * 2025 03 09 - 이상훈
 * 1. useState - 모달 상태 / 게시판 등록 데이터, 삭제 데이터 
 * 2. React Query - 게시판 데이터 조회
 * 3. mutation - 게시판 등록 / 삭제 / 검색 / 블록조회
 * 4. Handler - 체크박스 / 게시글 보기
 * 5. Modal - 등록모달 / 삭제모달
 * 6. trigger mutaion - 게시글 등록 / 삭제 / 조회
 * 7. handler - 게시글 제목변경
 * 8. 공통 테이블 column데이터
 * 9. useEffect - 보드 로딩 / 에러 처리
 */

import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CommonTable from '../../util/CommonTable';
import { board } from '../../../types';
import { deleteBoards, getBoards, postBoard, searchBoards } from '../../../services/boardService';
import PostBoardModal from './Modal/PostBoardModal';
import DeleteBoardModal from './Modal/DeleteModal';
import { getBlocks } from '../../../services/blockService';
import Loading from '../../util/Loading';

interface TableInfoType {
    id: string;
    title: string;
    icon: string;
    data: board[];
    isLoading?: boolean; // 로딩 상태 추가
    error?: string | null; // 에러 정보 추가
}

interface EditorTableProps {
    tableInfo: TableInfoType,
    setTableInfo: React.Dispatch<React.SetStateAction<any>>,
    setContentPageSection: React.Dispatch<React.SetStateAction<'default' | 'table' | 'editor'>>,
    setEditorInfo: React.Dispatch<React.SetStateAction<any>>,
}

const EditorTable: React.FC<EditorTableProps> = ({
    tableInfo,
    setTableInfo,
    setContentPageSection,
    setEditorInfo
}) => {
    const queryClient = useQueryClient();

    // 1. useState - 모달 상태 / 게시판 등록 데이터, 삭제 데이터 
    const [modalState, setModalState] = useState<any>({
        postBoard: false,
        deleteBoard: false
    });
    
    const [board, setBoard] = useState<{
        postBoard: string,
        deleteBoard: (string | number)[],
    }>({
        postBoard: '',
        deleteBoard: [],
    });


    // 2. React Query - 게시판 데이터 조회
    const {
        data: boardsData,
        isLoading: isQueryLoading,
        isError: isQueryError,
        error: queryError
    } = useQuery({
        queryKey: ['boards', tableInfo.id],
        queryFn: async () => {
            const response = await getBoards(tableInfo.id);
            return response.data;
        },
        enabled: !!tableInfo.id,
    });


    // 3. mutation - 게시판 등록 / 삭제 / 검색 / 블록조회
    const postBoardMutation = useMutation({
        mutationFn: async () => {
            return await postBoard(tableInfo.id, board.postBoard);
        },
        onSuccess: async (response) => {
            alert(response.message);
            queryClient.invalidateQueries({ queryKey: ['boards', tableInfo.id] });
            
            const responseRefresh = await getBoards(tableInfo.id);
            if (responseRefresh.data) {
                setTableInfo((prev:any) => ({ ...prev, data: responseRefresh.data }));
            }
            setModalState({ ...modalState, postBoard: false });
            setBoard(prev => ({ ...prev, postBoard: '' }));
        },
        onError: (error: any) => {
            console.error('게시글 등록 중 에러 발생:', error);
            alert('게시글 등록에 실패했습니다: ' + error.message);
        }
    });

    const deleteBoardsMutation = useMutation({
        mutationFn: async () => {
            const deleteIds = board.deleteBoard;
            return await deleteBoards(deleteIds);
        },
        onSuccess: async (response) => {
            alert(response.message);
            queryClient.invalidateQueries({ queryKey: ['boards', tableInfo.id] });
            
            const responseRefresh = await getBoards(tableInfo.id);
            if (responseRefresh.data) {
                setTableInfo((prev:any) => ({ ...prev, data: responseRefresh.data }));
            }
            setModalState({ ...modalState, deleteBoard: false });
            setBoard(prev => ({ ...prev, deleteBoard: [] }));
        },
        onError: (error: any) => {
            console.error('게시글 삭제 중 에러 발생:', error);
            alert('게시글 삭제에 실패했습니다: ' + error.message);
        }
    });

    const searchBoardsMutation = useMutation({
        mutationFn: async ({ option, keyword }: { option: string, keyword: string }) => {
            return await searchBoards(option, keyword, tableInfo.id);
        },
        onSuccess: (response) => {
            setTableInfo((prev: any) => ({ ...prev, data: response.data }));
        },
        onError: (error: any) => {
            console.error('게시글 검색 중 에러 발생:', error);
            alert('게시글 검색에 실패했습니다: ' + error.message);
        }
    });

    const getBlocksMutation = useMutation({
        mutationFn: async ({ id }: { id: string, title: string }) => {
            return await getBlocks(id);
        },
        onSuccess: (response, variables) => {
            setEditorInfo((prev : any) => ({
                ...prev, 
                title: variables.title, 
                id: variables.id, 
                blockData: response.data
            }));
            setContentPageSection('editor');
        },
        onError: (error: any) => {
            console.error('게시글 블록 데이터 로딩 중 에러 발생:', error);
            alert('게시글 블록 데이터 로딩에 실패했습니다: ' + error.message);
        }
    });


    // 4. Handler - 체크박스 / 게시글 보기
    const onCheckChange = (ids: (string | number)[]) => {
        setBoard({ ...board, deleteBoard: ids });
    }

    const onClickHandler = async (row: any) => {
        getBlocksMutation.mutate({ id: row.id, title: row.title });
    }


    // 5. Modal - 등록모달 / 삭제모달
    const openPostBoardModal = () => {
        setModalState({ ...modalState, postBoard: true });
        setBoard({ ...board, postBoard: '' });
    }

    const openDeleteModal = () => {
        if (!(board.deleteBoard.length > 0)) {
            alert('삭제할 게시글을 선택해주세요.');
            return;
        }
        setModalState({ ...modalState, deleteBoard: true });
    }


    // 6. trigger mutaion - 게시글 등록 / 삭제 / 조회
    const postBoardHandler = () => {
        if (!board.postBoard.trim()) {
            alert('게시글 제목을 입력해주세요.');
            return;
        }
        postBoardMutation.mutate();
    }

    const postKeyDownHandler = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (!board.postBoard.trim()) {
                alert('게시글 제목을 입력해주세요.');
                return;
            }
            postBoardMutation.mutate();
        }
    }

    const deleteBoardHandler = () => {
        deleteBoardsMutation.mutate();
    }

    const searchBoardHandler = (option: string, keyword: string) => {
        searchBoardsMutation.mutate({ option, keyword });
    }


    // 7. handler - 게시글 제목변경
    const boardTitlechangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setBoard({ ...board, postBoard: e.target.value });
    }


    // 8. 공통 테이블 column데이터
    const columns = [
        { id: 'id', header: 'No.', accessor: 'id', width: '10%' },
        {
            id: 'title', header: '제목', accessor: (row: any) => (
                <><i className={`fa-solid fa-bullhorn mr-1 ${(row.categoryId === '0' || row.categoryId === 0) ? '' : 'display-none'}`}></i>{row.title}</>
            ), width: '40%'
        },
        { id: 'createAt', header: '작성일', accessor: 'createAt', width: '20%' },
        { id: 'modifyAt', header: '최종수정일', accessor: 'modifyAt', width: '20%' },
    ];


    // 9. useEffect - 보드 로딩 / 에러 처리
    useEffect(() => {
        if (!isQueryLoading && boardsData) {
            setTableInfo((prev:any) => ({ 
                ...prev, 
                data: boardsData, 
                isLoading: false,
                error: null
            }));
        }
    }, [isQueryLoading, boardsData]);
    
    useEffect(() => {
        if (isQueryError && queryError) {
            setTableInfo((prev:any) => ({ 
                ...prev, 
                isLoading: false,
                error: queryError instanceof Error ? queryError.message : '데이터를 불러오는데 실패했습니다'
            }));
        }
    }, [isQueryError, queryError]);

    const isLoading = tableInfo.isLoading || 
                    postBoardMutation.isPending || 
                    deleteBoardsMutation.isPending || 
                    searchBoardsMutation.isPending || 
                    getBlocksMutation.isPending;

    if (tableInfo.isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <Loading />
                    <p className="text-gray-600 mt-4">테이블 데이터를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    if (tableInfo.error) {
        return (
            <div className="error-container p-8 max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-xl font-bold text-red-700 mb-4">데이터를 불러오는데 문제가 발생했습니다</h3>
                <p className="text-red-600 mb-4">{tableInfo.error}</p>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['boards', tableInfo.id] })}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <section className='h-full w-full !p-10 overflow-auto'>
            {(postBoardMutation.isPending || deleteBoardsMutation.isPending || searchBoardsMutation.isPending || getBlocksMutation.isPending) && (
                <div className="fixed top-4 right-4 z-10 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리 중...
                </div>
            )}

            <div className='text-[1.5em] flex items-center gap-2 !mb-24'>
                <i className={`${tableInfo.icon}`}></i>
                <p>{tableInfo.title}</p>
            </div>

            <CommonTable
                columns={columns}
                data={tableInfo.data}
                onSearch={searchBoardHandler}
                editButton={{ show: false }}
                checkedItems={board.deleteBoard}
                searchOptions={[{ value: 'title', label: '제목' }]}
                defaultSearchOption='title'
                registerButton={{ 
                    show: true, 
                    onClick: openPostBoardModal, 
                    label: '등록',
                }}
                deleteButton={{ 
                    show: true, 
                    onClick: openDeleteModal, 
                    label: '삭제',
                }}
                rowClickable={!isLoading}
                onRowClick={(row) => { onClickHandler(row) }}
                showCheckbox={true}
                onCheckChange={(ids) => { onCheckChange(ids) }}
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

export default EditorTable;