/**
 * 2025 03 16 - 이상훈
 * 1. useState - active 상태관리
 * 2. React Query - 카테고리 및 게시판 데이터 가져오기
 * 3. React Query - 블록 데이터 가져오기 mutation
 * 4. 섹션 변환 함수
 * 5. useEffect - 초기 설정 / 보드데이터 클라이언트 설정
 */

import React, { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactInfoSectionTypeEnum } from '../../../types/enum';
import { getCategory } from '../../../services/categoryService';
import { board } from '../../../types';
import { getBoards } from '../../../services/boardService';
import { getBlocks } from '../../../services/blockService';
import { flushSync } from 'react-dom';
import Loading from '../../util/Loading';

interface StudyAsideProps {
    setContentPageSection: React.Dispatch<React.SetStateAction<ReactInfoSectionTypeEnum>>;
    board: { type: ReactInfoSectionTypeEnum, board: board }[];
    setBoard: React.Dispatch<React.SetStateAction<{ type: ReactInfoSectionTypeEnum, board: board }[]>>;
    setEditorInfo: any;
    type: string | null;
}

export const StudyAside : React.FC<StudyAsideProps> = ({
    setContentPageSection,
    board,
    setBoard,
    setEditorInfo,
    type
}) => {
    const queryClient = useQueryClient();

    // 1. useState - active 상태관리
    const [isActive, setIsActive] = useState<ReactInfoSectionTypeEnum>(ReactInfoSectionTypeEnum.INTRO);

    // 2. React Query - 카테고리 및 게시판 데이터 가져오기
    const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
        queryKey: ['category', type],
        queryFn: async () => {
            if (!type) return null;
            const response = await getCategory(Number(type));
            return response?.data;
        },
        enabled: !!type,
    });

    const { data: boardsData, isLoading: isBoardsLoading } = useQuery({
        queryKey: ['boards', categoryData?.[0]?.id],
        queryFn: async () => {
            if (!categoryData || categoryData.length === 0) return null;
            const categoryId = categoryData[0].id;
            const response = await getBoards(categoryId);
            return response?.data;
        },
        enabled: !!categoryData && categoryData.length > 0,
    });


    // 3. React Query - 블록 데이터 가져오기 mutation
    const blocksMutation = useMutation({
        mutationFn: async (boardId: string) => {
            const response = await getBlocks(boardId);
            return response?.data;
        },
        onSuccess: (data, boardId) => {
            queryClient.setQueryData(['blocks', boardId], data);
        }
    });

    // 4. 섹션 변환 함수
    const convertSection = useCallback(async (item: any) => {
        setIsActive(item.type);
        
        try {
            flushSync(() => {
                setEditorInfo((prev: any) => ({
                    ...prev,
                    isLoading: true
                }));
            });
            
            const blockData = await blocksMutation.mutateAsync(item.board.id);
            
            flushSync(() => {
                setEditorInfo((prev: any) => ({
                    ...prev, 
                    title: item.board.title, 
                    id: item.board.id, 
                    blockData: blockData,
                    isLoading: false
                }));
            });
            
            setContentPageSection(item);
        } catch (error) {
            console.error('게시판 불러오기 중 에러:', error);
            setEditorInfo((prev: any) => ({
                ...prev,
                isLoading: false
            }));
        }
    }, [setContentPageSection, setEditorInfo, blocksMutation]);

    // 5. useEffect - 초기 설정 / 보드데이터 클라이언트 설정
    useEffect(() => {
        setIsActive(ReactInfoSectionTypeEnum.INTRO);
        setEditorInfo((prev: any) => ({
            ...prev, id: '0'
        }));
    }, [type]);

    useEffect(() => {
        if (boardsData) {
            const boardsWithoutFirst = [...boardsData];
            boardsWithoutFirst.splice(0, 1);

            const transformedData = boardsWithoutFirst.map((v: any, index: number) => {
                return {
                    type: index + 1 as ReactInfoSectionTypeEnum,
                    board: v
                };
            });
            
            setBoard(transformedData);
        }
    }, [boardsData, setBoard]);

    // 로딩 표시
    if (isCategoryLoading || isBoardsLoading) {
        return (
            <aside className='react_info_aside_section flex flex-col w-[20%] bg-gray h-full text-primary !px-[2em] overflow-auto max-w-[250px] font-sans'>
                <div className='flex items-center !mt-[3em] justify-between text-[1em] !pb-4 border-b !mb-24'>
                    <Loading />
                </div>
            </aside>
        );
    }

    return (
        <aside className='react_info_aside_section flex flex-col w-[20%] bg-gray h-full text-primary !px-[2em] overflow-auto max-w-[250px] font-sans'>
            <div className='flex items-center !mt-[3em] justify-between text-[1em] !pb-4 border-b !mb-24'>
                <p className='font-bold'>
                    {
                        type === '2' ? 'What is React?'
                        : type === '3' ? 'What is Vanila Js?'
                        : type === '4' ? 'What is Spring Boot?'
                        : type === '5' ? 'What is Node Js?'
                        : type === '6' ? 'What is ThymeLeaf?'
                        : ''
                    }
                </p>
            </div>
            <ul className='!mt-[3em] flex flex-col gap-8 !pb-10 font-medium'>
                <li
                    onClick={() => {
                        setContentPageSection(ReactInfoSectionTypeEnum.INTRO);
                        setIsActive(ReactInfoSectionTypeEnum.INTRO);
                        setEditorInfo((prev: any) => ({
                            ...prev, id: '0'
                        }));
                    }}
                    className={`${isActive === ReactInfoSectionTypeEnum.INTRO ? 'bg-section-aside-primary' : ''} flex justify-between hover-aside-primary !p-3 rounded-sm cursor-pointer relative`}>
                    <div className='flex items-center'>
                        페이지 소개
                    </div>
                </li>
                {board.map((item:any) => (
                    <li
                        key={item.type}
                        onClick={() => { convertSection(item) }}
                        className={`${isActive === item.type ? 'bg-section-aside-primary' : ''} flex justify-between hover-aside-primary !p-3 rounded-sm cursor-pointer relative ${blocksMutation.isPending && blocksMutation.variables === item.board.id ? 'opacity-50' : ''}`}
                    >
                        <div className='flex items-center'>
                            {item.board.title || `메뉴 ${item.type}`}
                            {blocksMutation.isPending && blocksMutation.variables === item.board.id && (
                                <Loading />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default StudyAside;