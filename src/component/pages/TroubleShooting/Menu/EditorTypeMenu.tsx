import React from 'react'
import { BlockData } from '../../../../types';
import { TypeEnum } from '../../../../types/enum';

interface EditorTypeMenuProps {
    block : BlockData;
    changeBlockType : (block : BlockData, type : TypeEnum) => void;
}

const EditorTypeMenu : React.FC<EditorTypeMenuProps> = ({block,changeBlockType}) => {

    return (
    <div className='editor_type_menu absolute top-[25px] left-0 bg-white w-[150px] flex flex-col rounded-b-md !px-2 overflow-auto'>
        <div onClick={()=>changeBlockType(block,TypeEnum.PARAGRAPH)} className='flex items-center gap-1 border-b'>
            <i className="fa-solid fa-paragraph"></i>
            <div className='text-gray-400'>Paragraph</div>
        </div>
        <div onClick={()=>changeBlockType(block,TypeEnum.TITLE)} className='flex items-center gap-1 border-b'>
            <i className="fa-solid fa-heading"></i>
            <div className='text-gray-400'>Title</div>
        </div>
        <div onClick={()=>changeBlockType(block,TypeEnum.IMG)} className='flex items-center gap-1 border-b'>
            <i className="fa-solid fa-image"></i>
            <div className='text-gray-400'>Image</div>
        </div>
        <div onClick={()=>changeBlockType(block,TypeEnum.CODE)} className='flex items-center gap-1 border-b'>
            <i className="fa-solid fa-code"></i>
            <div className='text-gray-400'>Code</div>
        </div>
    </div>
    )
}


export default EditorTypeMenu;
