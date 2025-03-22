/**
 * 2025 03 05 - 이상훈
 * 1. useState - 설명 섹션
 * 2. convert - 설명 섹션 변경
 * 3. useEffect - 초기설정 및 초기화
 */

import React, { useEffect, useMemo, useState } from 'react';
import { HomeDescTypeEnum } from '../../../types/enum';
import HomeIntroduce from './HomeIntroduce';
import HomeBEFE from './HomeBEFE';
import HomeStudy from './HomeStudy';

interface VideoBackgroundProps {
    videoSrc: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
    videoSrc, 
}) => {
    // 1. useState - 설명 섹션
    const [convertDesc,setConverDesc] = useState<HomeDescTypeEnum>();


    // 2. convert - 설명 섹션 변경
    const converSection = useMemo(()=>{
        switch(convertDesc)
        {
            case HomeDescTypeEnum.CODE :
                return <div className='text-start'>
                    <div className='!mb-20 text-[1.5em] font-bold'>코드 리뷰</div>
                    <div className='text-[0.9em] !mb-4'>• 상단의 Front / API / Back 버튼을 누르면 해당 페이지에서 이용한 Front(컴포넌트포함), API(서버와 클라이언트의 통신에관한 코드), Back(관심사별 서비스 로직)을 볼 수 있습니다.</div>
                    <div className='text-[0.9em] !mb-4'>• 코드 업데이트 기능은 권한이 필요합니다.</div>
                    <div className='text-[0.9em] !mb-4'>• 페이지의 코드가 여러 컴포넌트로 나뉘어져있을경우 모달 내부의 다음 / 이전 버튼을 통해서 관련 코드를 모두 볼 수 있습니다.</div>
                </div>
            case HomeDescTypeEnum.ASIDE :
                return <div className='text-start'>
                    <div className='!mb-20 text-[1.5em] font-bold'>사이드바</div>
                    <div className='text-[0.9em] !mb-4'>• 사이드바는 총 5가지 섹션으로 구성됩니다.</div>
                    <div className='text-[0.9em] !mb-4'>• Introduce : 자기소개서 / 이전에 진행한 프로젝트 요약</div>
                    <div className='text-[0.9em] !mb-4'>• FrontEnd : 프론트 앤드 기술스택</div>
                    <div className='text-[0.9em] !mb-4'>• BackEnd : 백앤드 기술스택</div>
                    <div className='text-[0.9em] !mb-4'>• Study : 트러블 슈팅 정리페이지</div>
                    <div className='text-[0.9em] !mb-4'>• Mini Project : 여러가지 Mini Project를 볼 수 있는 공간</div>
                </div>
            case HomeDescTypeEnum.INTRODUCE :
                return <HomeIntroduce />    
            case HomeDescTypeEnum.BEFE :
                return <HomeBEFE />
            case HomeDescTypeEnum.STUDY :
                return <HomeStudy />
            case HomeDescTypeEnum.MINI :
                return <div className='text-start'>
                    <div className='!mb-20 text-[1.5em] font-bold'>Mini Project</div>
                    <div className='text-[0.9em] !mb-4'>• Mini Project를 모아둔 섹션입니다.</div>
                    <div className='text-[0.9em] !mb-4'>• 클릭시 미니프로젝트의 이름 / 간단한 설명 / 사진이 담긴 카드가 보입니다.</div>
                    <div className='text-[0.9em] !mb-4'>• 카드 클릭시 해당하는 미니프로젝트의 페이지로 넘어갑니다.</div>
                    <div className='text-[0.9em] !mb-4'>• 모든 미니프로젝트는 따로 url을 생성하지 않고 converSection 스테이트에 따라서 분기합니다.</div>
                    <div className='text-[0.9em] !mb-4'>• 모든 미니프로젝트는 언마운트시 초기값을 초기화합니다.</div>
                    <div className='text-[0.9em] !mb-4'>• 현재 Weather 미니프로젝트는 https 이슈로인해 위치정보를 불러오지 못합니다.</div>
                </div>
            case HomeDescTypeEnum.VERSION :
                return <div className='text-start'>
                    <div className='!mb-20 text-[1.5em] font-bold'>Version</div>
                    <div className='text-[0.9em] !mb-4'>• Project의 버전 이력 정보 열람 페이지</div>
                </div>
        }
    },[convertDesc])


    // 3. useEffect - 초기설정 및 초기화
    useEffect(()=>{
        setConverDesc(HomeDescTypeEnum.NONE)
        return () => {
            setConverDesc(HomeDescTypeEnum.NONE)
        }
    },[])

    return (
        <div className="relative w-full h-screen overflow-hidden">
        <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-110 contrast-75 saturate-50 opacity-90"
            autoPlay
            loop
            muted
            playsInline
        >
            <source src={videoSrc} type="video/webm" />
            브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
        <div className='absolute top-0 left-0 w-full h-full flex flex-col items-start z-10 bg-black bg-opacity-40 text-aside-primary text-center text-[1em]'>
            <section className='main_aside_section bg-black h-full !px-[40px] bg-opacity-60'>
            <div className='flex justify-start text-[2em] !mt-[3em] '>
                PORTFOLIO
            </div>
            <div className='text-[1.5em] flex justify-start !mt-[5em]'>
                탐색 가이드
            </div>
            <ul className='!mt-[4em] flex flex-col items-start'>
                <li onClick={()=>setConverDesc(HomeDescTypeEnum.INTRODUCE)} className='!mt-[1em] cursor-pointer hover:text-white'>• Introduce</li>
                <li onClick={()=>setConverDesc(HomeDescTypeEnum.BEFE)} className='!mt-[1em] cursor-pointer hover:text-white'>• FE/BE</li>
                <li onClick={()=>setConverDesc(HomeDescTypeEnum.STUDY)} className='!mt-[1em] cursor-pointer hover:text-white'>• STUDY</li>
                <li onClick={()=>setConverDesc(HomeDescTypeEnum.CODE)} className='!mt-[1em] cursor-pointer hover:text-white'>• Code Review</li>
                <li onClick={()=>setConverDesc(HomeDescTypeEnum.ASIDE)} className='!mt-[1em] cursor-pointer hover:text-white'>• Aside</li>
                <li onClick={()=>setConverDesc(HomeDescTypeEnum.MINI)} className='!mt-[1em] cursor-pointer hover:text-white'>• Mini-Project</li>
                <li onClick={()=>setConverDesc(HomeDescTypeEnum.VERSION)} className='!mt-[1em] cursor-pointer hover:text-white'>• Versions</li>
            </ul>
            </section>
            <section className='main_footer_section absolute top-[3%] left-[250px] !p-4 h-screen overflow-auto'>
                {converSection}
            </section>
        </div>
        </div>
    );
};

export default VideoBackground;