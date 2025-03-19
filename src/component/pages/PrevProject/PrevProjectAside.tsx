/**
 * 2025 03 19 - 이상훈
 */

import React from 'react'
import { PrevProSectionTypeEnum } from '../../../types/enum';

interface PrevProjectAsideProps {
    setContentPageSection : any;
    contentPageSection : PrevProSectionTypeEnum | undefined
}

const PrevProjectAside : React.FC<PrevProjectAsideProps> = ({setContentPageSection,contentPageSection}) => {
    return (
        <aside className='react_info_aside_section flex flex-col w-[20%] bg-gray h-full text-primary !px-[2em] overflow-auto min-w-[250px] max-w-[250px] font-sans'>
            <div className='flex items-center !mt-[3em] justify-between text-[1em] !pb-4 border-b !mb-24'>
                <p className='font-bold'>
                    Project History
                </p>
            </div>
            <ul className='!mt-[3em] flex flex-col gap-8 !pb-10 font-medium'>
                <li
                    onClick={()=>setContentPageSection(PrevProSectionTypeEnum.LOTTE)}
                    className={`flex justify-between hover-aside-primary !p-3 rounded-sm cursor-pointer relative ${contentPageSection === PrevProSectionTypeEnum.LOTTE ? 'bg-section-aside-primary' : ''}`}>
                    <div className='flex items-center'>
                        Lotte On
                    </div>
                </li>
                <li
                    onClick={()=>setContentPageSection(PrevProSectionTypeEnum.PLANTRY)}
                    className={`flex justify-between hover-aside-primary !p-3 rounded-sm cursor-pointer relative ${contentPageSection === PrevProSectionTypeEnum.PLANTRY ? 'bg-section-aside-primary' : ''}`}>
                    <div className='flex items-center'>
                        PlanTry
                    </div>
                </li>
            </ul>
        </aside>
    )
}

export default PrevProjectAside;
