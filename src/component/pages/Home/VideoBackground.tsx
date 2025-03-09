// VideoBackground.tsx
import React from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoSrc, 
}) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/webm" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>
      <div className='absolute top-0 left-0 w-full h-full flex flex-col items-start z-10 bg-black bg-opacity-40 text-aside-primary text-center px-4 text-[1em] !ml-[1em]'>
        <section className='main_aside_section bg-black h-full !px-[40px] bg-opacity-60'>
          <div className='flex justify-start text-[2em] !mt-[3em] '>
            PORTFOLIO
          </div>
          <div className='text-[1.5em] flex justify-start !mt-[5em]'>
            탐색 가이드
          </div>
          <ul className='!mt-[4em] flex flex-col items-start'>
            <li className='!mt-[1em] cursor-pointer hover:text-white'>• ASIDE</li>
            <li className='!mt-[1em] cursor-pointer hover:text-white'>• HEADER</li>
            <li className='!mt-[1em] cursor-pointer hover:text-white'>• CODING STYLE</li>
            <li className='!mt-[1em] cursor-pointer hover:text-white'>• CSS</li>
            <li className='!mt-[1em] cursor-pointer hover:text-white'>• SKILL</li>
          </ul>
        </section>
        <section className='main_footer_section'>
          
        </section>
      </div>
    </div>
  );
};

export default VideoBackground;