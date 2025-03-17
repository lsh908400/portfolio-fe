import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { purpose, TreeItemProps } from '../../../types';
import CommonTree from '../../util/CommonTree';
import { getPurpose, getTrees } from '../../../services/studyIntroService';
import Loading from '../../util/Loading';
import ErrorMessage from '../../util/ErrorMessage';

interface StudyIntroProps {
    type: string | null;
}

const StudyIntro: React.FC<StudyIntroProps> = ({ type }) => {
    // React Query 사용하여 trees 데이터 가져오기
    const { data: treeItem , isLoading : isLoadingTreeItem, isError : isErrorTreeItems , refetch : refetchTreeItem } = useQuery<TreeItemProps[]>({
        queryKey: ['trees', type],
        queryFn: async () => {
            if (!type) return [];
            const response = await getTrees(type);
            if (!response.success) throw new Error('트리 데이터를 가져오는 데 실패했습니다.');
            return response.data;
        },
        enabled: !!type, // type이 존재할 때만 쿼리 실행
    });

    // React Query 사용하여 purpose 데이터 가져오기
    const { data: purposeList , isLoading : isLoadingPurposeList, isError : isErrorPurposeList , refetch : refetchPurpose } = useQuery<purpose[]>({
        queryKey: ['purpose', type],
        queryFn: async () => {
            if (!type) return [];
            const response = await getPurpose(type);
            if (!response.success) throw new Error('목적 데이터를 가져오는 데 실패했습니다.');
            return response.data;
        },
        enabled: !!type, // type이 존재할 때만 쿼리 실행
    });

    return (
        <section className='w-full h-full !p-10 !pb-0 box-border overflow-auto font-sans'>
            <div className='editor_title'>
                <p className='text-[2em] font-bold'>페이지 안내</p>
            </div>
            <div className='editor_intro_content !mt-16'>
                <div className='text-[1.2em] !mb-4 font-bold'>1. 구조</div>
                <div className='bg-code-black text-white text-code-primary font-bold !p-4 rounded-lg !mb-6'>
                    {isLoadingTreeItem ? (
                        <Loading />
                    ) : isErrorTreeItems ? (
                        <ErrorMessage 
                            message="트리 데이터를 불러오는 중 오류가 발생했습니다." 
                            onRetry={() => refetchTreeItem()}
                            variant="inline"
                        />
                    ) : treeItem && treeItem.length > 0 ? (
                        treeItem.map((item, index) => (
                            <CommonTree
                                key={index}
                                depth={item.depth}
                                state={item.state}
                                text={item.text}
                            />
                        ))
                    ) : (
                        <div className="text-gray-400 text-center py-4">표시할 구조 데이터가 없습니다.</div>
                    )}
                </div>
                <div className='text-[1.2em] !mb-6 font-bold'>2. 페이지의 목적</div>
                <ul className='!mb-6'>
                    {isLoadingPurposeList ? (
                        <Loading />
                    ) : isErrorPurposeList ? (
                        <ErrorMessage 
                            message="목표 데이터를 불러오는 중 오류가 발생했습니다." 
                            onRetry={() => refetchPurpose()}
                            variant="inline"
                        />
                    ) : purposeList && purposeList.length > 0 ? (
                        purposeList.map((item, index) => (
                            <li key={index}>• {item.text}</li>
                        ))
                    ) : (
                        <div className="text-gray-400 text-center py-4">표시할 목표 데이터가 없습니다.</div>
                    )}
                </ul>
                <div className='text-[1.2em] !mb-4 font-bold'>3. Aside</div>
                <ul className='!mb-6'>
                    <li>• 페이지 색션 변경</li>
                </ul>
                <div className='text-[1.2em] !mb-6 font-bold'>4. Content</div>
                <ul className='!mb-6'>
                    <li>• pageSection별 뷰 랜더링 및 에디터 랜더링</li>
                </ul>
                <div className='text-[1.2em] !mb-6 font-bold'>5. 설계원칙</div>
                <ul className='!mb-6'>
                    <li>• 관심사 분리와 컴포넌트의 캡슐화</li>
                    <li>• 개방 폐쇄 원칙</li>
                    <li>• 유지, 보수, 확장의 용이성</li>
                    <li>• 오버엔지니어링 자제</li>
                </ul>
            </div>
        </section>
    );
};

export default StudyIntro;