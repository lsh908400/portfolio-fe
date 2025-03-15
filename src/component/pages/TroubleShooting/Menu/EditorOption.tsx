import React, { useCallback, useState } from 'react'
import { BlockData } from '../../../../types';
import CommonColorPicker from '../../../util/CommonColorPicker';
import EditorTypeMenu from './EditorTypeMenu';
import { IconHoverEnum, TypeEnum } from '../../../../types/enum';

interface EditorOptionProps {
    block : BlockData,
    changeBlockStyle : (block : BlockData, type : IconHoverEnum) => void;
    changeBlockColor : (color : string, block : BlockData) => void;
    changeBlockType : (block : BlockData, type : TypeEnum) => void;
    showMenu : boolean;
    setShowMenu : any;
    removeBlockHandler : any;
}



const EditorOption : React.FC<EditorOptionProps> = ({
    block,changeBlockStyle,changeBlockColor,changeBlockType,showMenu,setShowMenu,removeBlockHandler
}) => {
    const [iconHoverState, setIconHoverState] = useState<{
        type : IconHoverEnum | null,
        state : boolean
    }>({
        type : null,
        state : false
    });

    const [showPicker, setShowPicker] = useState<boolean>(false);
    
    
    const mouseEnterHandler = useCallback((type : IconHoverEnum)=>{
        setIconHoverState({type,state : true})
    },[iconHoverState])

    const mouseLeaveHandler = useCallback((type : IconHoverEnum)=>{
        setIconHoverState({type,state : false})
    },[iconHoverState])


    const openColorPicker = useCallback((e: React.MouseEvent)=>{
        e.preventDefault();
        e.stopPropagation(); 
        setShowPicker(prev => !prev)
    },[])

    

    return (
    <div className="option_box absolute top-[-30px] left-[-10px] border h-[30px] bg-white opacity-100 z-50 flex items-center">
        <div
            onClick={()=>{removeBlockHandler(block.index);}} 
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.DELETE)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.DELETE)}
            className='border border-r w-[25px] h-full flex items-center justify-center relative'>
            <i className="fa-solid fa-trash"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.DELETE)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Delete</div>
            }
        </div>
        <div
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu);}} 
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.PLUS)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.PLUS)}
            className='border border-r w-[25px] h-full flex items-center justify-center relative'>
            <i className="fa-solid fa-plus"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.PLUS)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Menu</div>
            }
        </div>
        <div
            onClick={()=>changeBlockStyle(block,IconHoverEnum.BASIC)}
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.BASIC)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.BASIC)} 
            className={`border border-r w-[25px] h-full flex items-center justify-center relative ${block.data.style === 'basic' ? 'bg-gray-300' : ''}`}>
            <i className="fa-solid fa-pen"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.BASIC)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Basic</div>
            }
        </div>
        <div 
            onClick={()=>changeBlockStyle(block,IconHoverEnum.CROOKED)}
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.CROOKED)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.CROOKED)} 
            className={`border border-r w-[25px] h-full flex items-center justify-center relative ${block.data.style === 'crooked' ? 'bg-gray-300' : ''}`}>
            <i className="fa-solid fa-italic"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.CROOKED)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Italic</div>
            }
        </div>
        <div
            onClick={()=>changeBlockStyle(block,IconHoverEnum.UNDERLINE)}
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.UNDERLINE)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.UNDERLINE)}  
            className={`border border-r w-[25px] h-full flex items-center justify-center relative ${block.data.style === 'underline' ? 'bg-gray-300' : ''}`}>
            <i className="fa-solid fa-underline"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.UNDERLINE)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Italic</div>
            }
        </div>
        <div
            onClick={()=>changeBlockStyle(block,IconHoverEnum.BOLD)}
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.BOLD)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.BOLD)}  
            className={`border border-r w-[25px] h-full flex items-center justify-center relative ${block.data.style === 'bold' ? 'bg-gray-300' : ''}`}>
            <i className="fa-solid fa-bold"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.BOLD)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Bold</div>
            }
        </div>
        <div
            onClick={()=>changeBlockStyle(block,IconHoverEnum.CANCELLINE)} 
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.CANCELLINE)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.CANCELLINE)}  
            className={`border border-r w-[25px] h-full flex items-center justify-center relative ${block.data.style === 'cancelline' ? 'bg-gray-300' : ''}`}>
            <i className="fa-solid fa-text-slash"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.CANCELLINE)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Through</div>
            }
        </div>
        <div
            onClick={()=>changeBlockStyle(block,IconHoverEnum.LINK)}
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.LINK)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.LINK)}   
            className={`border border-r w-[25px] h-full flex items-center justify-center relative ${block.data.style === 'link' ? 'bg-gray-300' : ''}`}>
            <i className="fa-solid fa-link"></i>
            {(iconHoverState.state && iconHoverState.type === IconHoverEnum.LINK)&&
                <div className='absolute top-[-20px] left-[0%] text-[10px] text-gray-400'>Link</div>
            }
        </div>
        <div
            onMouseEnter={()=>mouseEnterHandler(IconHoverEnum.COLOR)} 
            onMouseLeave={()=>mouseLeaveHandler(IconHoverEnum.COLOR)}   
            className={`border border-r w-[25px] h-full flex items-center justify-center relative`}>
            <CommonColorPicker
                color={block.data.color || '#000000'}
                changeBlockColor={changeBlockColor}
                onClick={(e)=>openColorPicker(e)}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                block={block}
            />
        </div>
        {showMenu &&
            <EditorTypeMenu 
                block={block}
                changeBlockType={changeBlockType}
            />
        }
    </div>
    )
}

export default EditorOption;
