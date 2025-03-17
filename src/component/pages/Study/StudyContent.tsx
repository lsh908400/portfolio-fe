/**
 * 2025 03 16 - 이상훈
 */

import React from 'react'
import Editor from '../TroubleShooting/Editor';
import { BlockData } from '../../../types';

interface StudyContentProps {
    editorInfo : {
        id? : string,
        title? : string,
        icon : string,
        blockData : BlockData[]| undefined
    },
    setEditorInfo : any;
}

const StudyContent : React.FC<StudyContentProps> = ({
    editorInfo,
    setEditorInfo
}) => {


    return (
        <div className='w-full h-full !p-10 !pb-0 box-border overflow-auto font-sans'> 
            <Editor
                key={editorInfo.id}
                initialData={editorInfo.blockData}
                editorInfo={editorInfo}
                setEditorInfo={setEditorInfo}
                id={editorInfo.id}
            />
        </div>
    )
}

export default StudyContent;
