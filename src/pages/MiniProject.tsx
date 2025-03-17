/**
 * 2025 03 16 - 이상훈
 * React Query 적용 버전
 * 1. searchParams - 타입
 * 2. React Query - 프로젝트 목록 데이터 가져오기
 * 3. useState - 콘텐츠 페이지 섹션
 * 4. useMemo - 콘텐츠 렌더링
 */

import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Card from '../component/pages/MiniProject/Card';
import { getProjects } from '../services/projectService';
import Weather from '../component/pages/MiniProject/Front/Weather';
import TimeLine from '../component/pages/MiniProject/Front/TimeLine';
import CodeSnipet from '../component/pages/MiniProject/Front/CodeSnipet';
import Loading from '../component/util/Loading';
import ErrorMessage from '../component/util/ErrorMessage';

const MiniProject: React.FC = () => {
    // 1. searchParams - 타입
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    // 2. React Query - 프로젝트 목록 데이터 가져오기
    const {
        data: projects,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['projects', type],
        queryFn: async () => {
            if (!type) return [];
            const response = await getProjects(Number(type));
            if (!response.success) throw new Error('프로젝트 목록을 가져오는데 실패했습니다');
            return response.data;
        },
        enabled: !!type, // type이 존재할 때만 쿼리 실행
    });

    // 3. useState - 콘텐츠 페이지 섹션
    const [contentPageSection, setContentPageSection] = useState<number | null>(null);

    // 4. useMemo - 콘텐츠 렌더링
    const renderContent = useMemo(() => {
        switch (contentPageSection) {
            case 1:
                return <Weather />
            case 2:
                return <TimeLine />
            case 3:
                return <CodeSnipet />
            default:
                return null;
        }
    }, [contentPageSection]);

    // 로딩 중일 때
    if (isLoading) {
        return (
            <section id='mini_project' className='w-full h-full font-sans !p-4 overflow-auto flex items-center justify-center'>
                <div className="text-center">
                    <Loading />
                    <p className="text-gray-600 mt-4">프로젝트 목록을 불러오는 중입니다...</p>
                </div>
            </section>
        );
    }

    // 에러 발생 시
    if (isError) {
        return (
            <section id='mini_project' className='w-full h-full font-sans !p-4 overflow-auto'>
                <div className="error-container p-8 max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg">
                        <ErrorMessage 
                            message="목표 데이터를 불러오는 중 오류가 발생했습니다." 
                            onRetry={() => refetch()}
                            variant="inline"
                        />
                </div>
            </section>
        );
    }

    return (
        <section id='mini_project' className='w-full h-full font-sans !p-4 overflow-auto'>
            <div className='text-[2em] font-bold flex gap-10'>
                {contentPageSection &&
                    <div><i onClick={() => setContentPageSection(null)} className='fa-solid fa-arrow-left cursor-pointer opacity-70 hover:opacity-100'></i></div>
                }
                <div>{type === '1' ? 'Front ' : 'Back '}Mini-Project</div>
            </div>
            
            {contentPageSection &&
                <section className='render_section'>
                    {renderContent}
                </section>
            }
            
            {contentPageSection === null &&
                <div className='!mt-[30px] flex gap-[60px] flex-wrap justify-center'>
                    {projects?.map((v:any) => (
                        <Card
                            key={v.id}
                            bgColor='#95ccd6'
                            props={{ name: v.name, id: v.id, desc: v.desc, img: v.img }}
                            setContentPageSection={setContentPageSection}
                        />
                    ))}
                </div>
            }
        </section>
    )
}

export default MiniProject;