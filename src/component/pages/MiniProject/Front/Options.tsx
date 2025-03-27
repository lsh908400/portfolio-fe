/**
 * 2025 03 27 - 이상훈
 * 0. 기초 설정 - color / navigation List 
 * 1. useState - contentState 
 * 2. useMemo - renderContent
 */

import React, { useMemo, useState } from 'react'
import PostOptions from './Options/PostOption/PostOptions';

const Options : React.FC = () => {

    // 0. 기초 설정 - color / navigation List /
    const pointColor = '#c9e140';
    const naviList = ['상품 등록', '상품 수정', '상품 보기', '장바구니']

    // 1. useState - contentState 
    const [contentState , setContentState] = useState<number>(1);


    // 2. useMemo - renderContent
    const renderContent = useMemo(()=>{
        switch(contentState)
        {
            case 1 :
                return <PostOptions />;
            case 2 :
                return <>상품 수정</>
            case 3 :
                return <>상품 보기</>
            case 4 :
                return <>장바구니</>
        }
    },[contentState])


    return (
        <section id='options_section' className='font-sans !p-6'>
            <section className='option_header w-full border-b border-gray-200 mb-6'>
                <ul className='flex space-x-1'>
                {naviList.map((item, index) => (
                    <li 
                    key={index}
                    onClick={()=>setContentState(Number(index+1))}
                    className={`px-6 py-3 text-center cursor-pointer transition-colors duration-200 font-medium
                        ${index === 0 ? 
                        `bg-[${pointColor}] text-gray-800 rounded-t-lg` : 
                        'text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-t-lg'
                        }`}
                    >
                    {item}
                    </li>
                ))}
                </ul>
            </section>
            <main>
                {renderContent}
            </main>
        </section>
    )
}

export default Options;
