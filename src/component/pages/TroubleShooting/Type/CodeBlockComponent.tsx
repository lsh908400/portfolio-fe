/**
 * 1. code복사
 * 2. 코드 입력 (Prism관련으로 따로 관리하는게 더 좋다고 생각해서 따로 뻇다.)
 * 3. Prism 시점
 */


import React, { useCallback, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import EditorOption from '../Menu/EditorOption';
import { BlockData } from '../../../../types';
import { IconHoverEnum, TypeEnum } from '../../../../types/enum';
import debounce from 'lodash/debounce';


interface CodeBlockProps {
    block: BlockData;
    index: number;
    blockRefs: React.MutableRefObject<Record<string, HTMLElement>>;
    isOptionBoxOpen: { isOpen: boolean; id: string } | undefined;
    copySuccess: string;
    updateBlockData: (index: number, data: any) => void;
    handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
    handleInput: (e: React.FormEvent<HTMLDivElement | HTMLElement>, blockId: string) => void;
    blockHoverHandler: (e: React.MouseEvent, blockId: string, index: number) => void;
    blockLeaveHandler: (e: React.MouseEvent, index: number) => void;
    setIsOptionBoxOpen: any;
    dragOverHandler: (e: React.DragEvent) => void;
    dropHandler: (e: React.DragEvent, index: number) => void;
    dragStartHandler: (e: React.DragEvent, index: number) => void;
    dragEndHandler: (e: React.DragEvent) => void;
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    changeBlockStyle: (block: BlockData, type: IconHoverEnum) => void
    changeBlockColor: (color: string, block : BlockData) => void;
    changeBlockType: (block: BlockData, type: TypeEnum) => void
    removeBlockHandler: (index : number) => void;
    setCopySuccess: React.Dispatch<React.SetStateAction<string>>;
}

const CodeBlockComponent: React.FC<CodeBlockProps> = ({
    block,
    index,
    blockRefs,
    isOptionBoxOpen,
    copySuccess,
    updateBlockData,
    handleKeyDown,
    blockHoverHandler,
    blockLeaveHandler,
    setIsOptionBoxOpen,
    dragOverHandler,
    dropHandler,
    dragStartHandler,
    dragEndHandler,
    showMenu,
    handleInput,
    setShowMenu,
    changeBlockStyle,
    changeBlockColor,
    changeBlockType,
    removeBlockHandler,
    setCopySuccess
}) => {
    const codeRef = useRef<HTMLElement | null>(null);
    // 1. code복사
    const handleCopyCode = () => {
        if (block.data.text) {
        navigator.clipboard.writeText(block.data.text)
            .then(() => {
            setCopySuccess(block.id);
            setTimeout(() => setCopySuccess(''), 2000);
            })
            .catch(err => {
            console.error('코드 복사에 실패했습니다:', err);
            });
        }
    };


    // 2. 코드 입력 (Prism관련으로 따로 관리하는게 더 좋다고 생각해서 따로 뻇다.)
    const handleCodeInput = useCallback((e:React.FormEvent<HTMLDivElement | HTMLElement>,index:number)=>{
        const text = (e.target as HTMLElement).innerHTML;
        
        updateBlockData(index, { text });
    },[])


    // 3. Prism 시점
    useEffect(() => {
        const debouncedHighlight = debounce(() => {
        if (codeRef.current && block.type === 'code') {
            Prism.highlightElement(codeRef.current);
        }
        }, 0); 
    
        debouncedHighlight();
    
        return () => {
            debouncedHighlight.cancel();
        };
    }, [block.data.text , block.type , blockHoverHandler]);

    return (
        <div
        onMouseEnter={(e) => blockHoverHandler(e, block.id, index)}
        onMouseLeave={(e) => blockLeaveHandler(e, index)}
        onDragOver={dragOverHandler}
        onDrop={(e) => dropHandler(e, index)}
        className="relative !px-2 !mb-2 rounded group flex items-start block-container"
        key={block.id}
        >
        <div
            onClick={() => {
            setIsOptionBoxOpen({
                isOpen: !isOptionBoxOpen?.isOpen,
                id: block.id,
            });
            if (showMenu) {
                setShowMenu(false);
            }
            }}
            className="relative hover-handle invisible"
            onDragStart={(e) => dragStartHandler(e, index)}
            onDragEnd={dragEndHandler}
            draggable
        >
            <i className="fa-solid fa-ellipsis-vertical opacity-40"></i>
            <i className="fa-solid fa-ellipsis-vertical opacity-40"></i>
            <i className="fa-solid fa-ellipsis-vertical opacity-40"></i>
            {isOptionBoxOpen?.isOpen && isOptionBoxOpen.id === block.id && (
            <EditorOption
                block={block}
                changeBlockStyle={changeBlockStyle}
                changeBlockColor={changeBlockColor}
                changeBlockType={changeBlockType}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                removeBlockHandler={removeBlockHandler}
            />
            )}
        </div>
        <div className="max-w-[80%] min-w-[80%] !px-2 flex flex-col">
            {/* 헤더 영역: 언어 선택 및 옵션 */}
            <div className="flex items-center justify-between bg-gray-700 text-white rounded-t">
            {/* 언어 선택 */}
            <select 
                className="text-xs bg-gray-600 text-white rounded px-2 py-1 outline-none"
                value={block.data.language || 'javascript'}
                onChange={(e) => {
                updateBlockData(index, { language: e.target.value });
                }}
            >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="jsx">Jsx</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="java">Java</option>
                <option value="sql">SQL</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
            </select>
            
            {/* 옵션 버튼들 */}
            <div className="flex space-x-2">
                {/* 라인 번호 토글 */}
                <button 
                className={`text-xs px-2 py-1 rounded ${block.data.showLineNumbers ? 'bg-blue-600' : 'bg-gray-600'}`}
                onClick={() => updateBlockData(index, { showLineNumbers: !block.data.showLineNumbers })}
                title={block.data.showLineNumbers ? "라인 번호 숨기기" : "라인 번호 보기"}
                >
                <i className="fa-solid fa-list-ol"></i>
                </button>
                
                {/* 복사 버튼 */}
                <button
                className="text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500"
                onClick={handleCopyCode}
                title="코드 복사"
                >
                {copySuccess === block.id ? 
                    <i className="fa-solid fa-check"></i> : 
                    <i className="fa-solid fa-copy"></i>
                }
                </button>
            </div>
            </div>
            
            {/* 코드 영역 */}
            <div className="flex bg-gray-800 rounded-b overflow-hidden">
            {/* 라인 번호 (활성화된 경우) */}
            {block.data.showLineNumbers && (
                <div className="pl-2 py-2 bg-gray-900 select-none text-right">
                {(block.data.text || "").split('\n').map((_, i) => (
                    <div key={i} className="text-xs text-gray-500 pr-3">{i + 1}</div>
                ))}
                </div>
            )}
            
            {/* 코드 입력 영역 */}
            <pre 
                className={`max-w-[100%] min-w-[100%] font-mono text-sm outline-none px-3 py-2 text-gray-200 overflow-x-auto code-area ${
                `language-${block.data.language || 'javascript'}`
                }`}
                style={{
                whiteSpace: 'pre',
                tabSize: 2,
                margin: 0
                }}
            >
                <code
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => {
                    // Tab 키 처리 (들여쓰기)
                    if (e.key === 'Tab') {
                    e.preventDefault();
                    document.execCommand('insertText', false, '  ');
                    } else {
                    handleKeyDown(e, index);
                    }
                }}
                onInput={(e) => handleInput(e,block.id)}
                onBlur={(e) => handleCodeInput(e,index)}
                dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
                ref={(el) => {
                    codeRef.current = el;
                    if (el) blockRefs.current[block.id] = el;
                }}
                className="block w-[800px]"
                dir="ltr"
                spellCheck="false"
                />
            </pre>
            </div>
        </div>
        </div>
    );
};

export default CodeBlockComponent;