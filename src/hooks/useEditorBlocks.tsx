/**
 * 2025 03 14 - 이상훈
 * 0. 기초 함수
 * 1. useState - 호버 / 블럭 / 옵션 박스
 * 2. useRef - save state / order / currendBlocks / block / style / color
 * 3. changedBoolean - 블럭오더 / 블럭내용 / 스타일 / 컬러
 * 4. onSave 콜백함수 - 변경사항 감지 후 Editor.tsx로 콜백
 * 5. 블럭 데이터 업데이트 - 순서 / 상태 / 내용
 * 6. 블럭 상태변경 - 인덱스 이동 / 추가 / 삭제 / 타입변경 / 스타일 변경 / 컬러변경 / 입력변경 / 키보드입력으로인한 / 블러 / 엔더 / 리브 / 드래그
 * 7. useEffect - 최신 저장상태 / 언마운트 작동
 * 8. 블록 렌더링 함수 - title / paragraph
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { BlockData, IconHoverEnum } from "../types";
import EditorOption from "../component/pages/TroubleShooting/Menu/EditorOption";

interface UseEditorBlocksProps {
    initialData?: BlockData[];
    onChange?: (blocks: BlockData[]) => void;
    onSave?: (blocks: BlockData[]) => void;
    autoSaveIntervalMs?: number;
}

interface UseEditorBlocksReturn {
    blocks: BlockData[];
    addBlock: (index: number, type?: BlockData["type"]) => void;
    removeBlock: (index: number) => void;
    updateBlockData: (index: number, newData: Partial<BlockData["data"]>) => void;
    changeBlockType: (index: number, newType: BlockData["type"]) => void;
    handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
    renderBlock: (block: BlockData, index: number) => React.ReactNode | null;
}

export const useEditorBlocks = ({
    initialData = [],
    onChange,
    onSave,
}: UseEditorBlocksProps): UseEditorBlocksReturn => {

    // 0. 기초 함수
    const generateId = useCallback((): string => {
        return "_" + Math.random().toString(36).substr(2, 9);
    }, []);
    const assignBlockIndexes = (blocks: BlockData[]): BlockData[] => {
        return blocks.map((block, idx) => ({
            ...block,
            index: idx
        }));
    };
    const arraysEqual = (a?: string[], b?: string[]): boolean => {
        if (a === b) return true;
        if (!a || !b) return false;
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
        }

        return true;
    };


    // 1.useState - 호버 / 블럭 / 옵션 박스
    const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
    const [blocks, setBlocks] = useState<BlockData[]>(() => {
        if (initialData.length > 0) {
            const sortedBlocks = [...initialData].sort((a, b) => {
                const indexA = a.index !== undefined ? a.index : 0;
                const indexB = b.index !== undefined ? b.index : 0;
                return indexA - indexB;
            });
            
            return assignBlockIndexes(sortedBlocks);
        }
        
        return [{
            id: generateId(),
            type: "paragraph",
            data: { text: ``,style: 'basic', color: 'black',},
            index: 0,
        }];
    });
    const [isOptionBoxOpen, setIsOptionBoxOpen] = useState<{
        isOpen: boolean;
        id: string;
    }>();


    // 2. useRef - save state / order / currendBlocks / block / style / color
    const lastSavedStateRef = useRef<Record<string, string>>({});
    const lastSavedOrderRef = useRef<string[]>(blocks.map(block => block.id));
    const contentRef = useRef<Record<string, string>>({});
    const blockRefs = useRef<Record<string, HTMLDivElement>>({});
    const lastSavedStylesRef = useRef<Record<string, string>>({});
    const lastSavedColorsRef = useRef<Record<string, string>>({});

    // 3. changedBoolean - 블럭오더 / 블럭내용 / 스타일 / 컬러
    const getChangedBlocks = useCallback(() => {
        const changedBlocks = blocks.filter((block) => {
        const blockId = block.id;
        const currentText =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : block.data.text || "";

        // 마지막 저장 상태와 비교
        const lastSavedText = lastSavedStateRef.current[blockId];
        // 새 블록이거나 내용이 변경된 경우
        return lastSavedText === undefined || lastSavedText !== currentText;
        });

        // 변경사항이 있는 블록들의 최신 상태 반환
        return changedBlocks.map((block) => {
        const blockId = block.id;
        return {
            ...block,
            data: {
            ...block.data,
            text:
                contentRef.current[blockId] !== undefined
                ? contentRef.current[blockId]
                : block.data.text || "",
            },
        };
        });
    }, [blocks]);

    const orderHasChanged = useCallback(() => {
        const currentOrder = blocks.map(block => block.id);
        return !arraysEqual(currentOrder, lastSavedOrderRef.current);
    }, [blocks]);

    const stylesHaveChanged = useCallback(() => {
        // 현재 블록의 스타일 상태 확인
        const hasStyleChanges = blocks.some(block => {
            const currentStyle = block.data.style || 'basic';
            const lastSavedStyle = lastSavedStylesRef.current[block.id] || 'basic';
            
            return currentStyle !== lastSavedStyle;
        });
        
        return hasStyleChanges;
    }, [blocks]);


    const colorsHaveChanged = useCallback(() => {
        // 현재 블록의 스타일 상태 확인
        const hasColorChanges = blocks.some(block => {
            const currentColor = block.data.color || 'black';
            const lastSavedColor = lastSavedColorsRef.current[block.id] || 'black';
            
            return currentColor !== lastSavedColor;
        });
        
        return hasColorChanges;
    }, [blocks]);


    // 4. onSave 콜백함수 - 변경사항 감지 후 Editor.tsx로 콜백
    const saveData = useCallback(() => {
        if (!onSave) return;
        const changedBlocks = getChangedBlocks();
        if (changedBlocks.length > 0 || orderHasChanged() || stylesHaveChanged() || colorsHaveChanged()) {
            onSave(blocks);
        }
    }, [getChangedBlocks, orderHasChanged, onSave, blocks , stylesHaveChanged ,colorsHaveChanged]);

    
    // 5. 블럭 데이터 업데이트 - 순서 / 상태 / 내용
    const updateBlocksAndNotify = useCallback((newBlocks: BlockData[]) => {
        const indexedBlocks = assignBlockIndexes(newBlocks);
        setBlocks(indexedBlocks);
        if (onChange) {
            onChange(indexedBlocks);
        }
    },[onChange]);

    const updateBlockData = useCallback((index: number, newData: Partial<BlockData["data"]>) => {
        if (index < 0 || index >= blocks.length) {
            console.warn(`Invalid block index: ${index}`);
            return;
        }

        const currentBlock = blocks[index];

        let hasChanges = false;

        if ("text" in newData && newData.text !== currentBlock.data.text) {
            hasChanges = true;
        }

        if ("level" in newData && newData.level !== currentBlock.data.level) {
            hasChanges = true;
        }

        if (
            "items" in newData &&
            !arraysEqual(newData.items, currentBlock.data.items)
        ) {
            hasChanges = true;
        }

        if ("url" in newData && newData.url !== currentBlock.data.url) {
            hasChanges = true;
        }

        if (
            "caption" in newData &&
            newData.caption !== currentBlock.data.caption
        ) {
            hasChanges = true;
        }

        if (
            "style" in newData &&
            newData.style !== currentBlock.data.style
        ){
            hasChanges = true;
        }

        if (
            "color" in newData &&
            newData.color !== currentBlock.data.color
        ){
            console.log(currentBlock.data.color)
            console.log(newData.color)
            hasChanges = true;
        }

        // 변경사항이 있을 때만 상태 업데이트
        if (hasChanges) {
            const newBlocks = [...blocks];
            newBlocks[index].data = { ...currentBlock.data, ...newData };
            updateBlocksAndNotify(newBlocks)
        }

        
        },
        [blocks]
    );


    // 6. 블럭 상태변경 - 인덱스 이동 / 추가 / 삭제 / 타입변경 / 스타일 변경 / 컬러변경 / 입력변경 / 키보드입력으로인한 / 블러 / 엔더 / 리브 / 드래그
    const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        
        const newBlocks = [...blocks];
        const [movedBlock] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, movedBlock);
        
        // 인덱스 재할당하여 저장
        updateBlocksAndNotify(newBlocks);
        return newBlocks;
    },[blocks, updateBlocksAndNotify]);

    const addBlock = useCallback((index: number, type: BlockData["type"] = "paragraph") => {
        const newBlocks = [...blocks];
        const newBlockId = generateId(); // 미리 ID 생성
        const newBlock: BlockData = {
            id: newBlockId,
            type,
            data: { text: "",style: 'basic',color: 'black',},
            index: (index+1),
        };
        newBlocks.splice(index + 1, 0, newBlock);
        updateBlocksAndNotify(newBlocks);
        return newBlockId; // 새 블록의 ID 반환
    },[blocks, generateId, updateBlocksAndNotify]);

    const removeBlock = useCallback(
        (index: number) => {
        if (blocks.length > 1) {
            const newBlocks = [...blocks];
            const prevIndex = index - 1 >= 0 ? index - 1 : 0;
            const prevBlockId = blocks[prevIndex].id;

            newBlocks.splice(index, 1);

            return { prevIndex, prevBlockId }; // 이전 블록 정보 반환
        }
        return null;
    },[blocks]);

    const changeBlockType = useCallback(
        (index: number, newType: BlockData["type"]) => {
        if (newType !== "title" && newType !== "paragraph") return; // 타이틀과 문단만 지원

        const newBlocks = [...blocks];
        const oldData = newBlocks[index].data;

        newBlocks[index] = {
            ...newBlocks[index],
            type: newType,
            data: { text: oldData.text || "" },
        };

    },[blocks]);

    const changeBlockStyle = useCallback((block : BlockData ,type : IconHoverEnum)=>{
        let enumChanger = ['plus','basic','crooked','underline','bold','cancelline','link']
        const newStyle = enumChanger[type];
        switch(newStyle)
        {
            case 'basic' :
            {
                updateBlockData(block.index, { style: newStyle })
                break;
            }
            case 'crooked' :
            {
                updateBlockData(block.index, { style: newStyle })
                break;
            }
            case 'underline' :
            {
                updateBlockData(block.index, { style: newStyle })
                break;
            }
            case 'bold' :
            {
                updateBlockData(block.index, { style: newStyle })
                break;
            }
            case 'cancelline' :
            {
                updateBlockData(block.index, { style: newStyle })
                break;
            }
            case 'link' :
            {
                updateBlockData(block.index, { style: newStyle })
                break;
            }
        }
    },[updateBlockData])

    const changeBlockColor = useCallback((color: string, block : BlockData) => {
        console.log(color)
        updateBlockData(block.index, { color: color })
        
    },[updateBlockData]);

    const handleInput = useCallback(
        (e: React.FormEvent<HTMLDivElement>, blockId: string) => {
        contentRef.current[blockId] = e.currentTarget.textContent || "";
    },[]);
    
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, index: number) => {
        const blockId = blocks[index].id;
        // 엔터키 처리
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            // 현재 입력 중인 내용 저장
            const currentText = contentRef.current[blockId] || "";
            const storedText = blocks[index].data.text || "";

            // 텍스트가 변경된 경우에만 업데이트
            if ((currentText !== storedText)&&currentText !== "") {
                updateBlockData(index, { text: currentText });
            }

            // 새 블록 추가하고 ID 받기
            const newBlockId = addBlock(index);

            // requestAnimationFrame을 사용하여 DOM 업데이트 후 실행되도록 함
            requestAnimationFrame(() => {
            if (newBlockId && blockRefs.current[newBlockId]) {
                // Focus the new block
                blockRefs.current[newBlockId].focus();
                setHoveredIndex(newBlockId);
            }
            });
        }
        // 백스페이스 처리 (비어있는 블록 삭제)
        else if (
            e.key === "Backspace" &&
            (e.currentTarget.textContent === "" ||
            e.currentTarget.textContent === null)
        ) {
            e.preventDefault();
            
            const currentText = contentRef.current[blockId] || "";
            // 텍스트가 변경된 경우에만 업데이트
            if (currentText === "") {
                updateBlockData(index, { text: currentText });
            }
            const prevBlockInfo = removeBlock(index);

            // requestAnimationFrame을 사용하여 DOM 업데이트 후 실행되도록 함
            if (prevBlockInfo) {
                requestAnimationFrame(() => {
                    const { prevBlockId } = prevBlockInfo;
                    if (blockRefs.current[prevBlockId]) {
                    // 이전 블록으로 포커스 이동
                    blockRefs.current[prevBlockId].focus();

                    // 커서를 텍스트 끝으로 이동 (선택적)
                    const selection = window.getSelection();
                    const range = document.createRange();
                    const el = blockRefs.current[prevBlockId];

                    if (selection && el.lastChild) {
                        range.selectNodeContents(el);
                        range.collapse(false); // false는 끝으로 이동
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                    }
                });
            }
        }
    },[blocks, addBlock, removeBlock, updateBlockData]);

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLDivElement>, index: number) => {
        const blockId = blocks[index].id;
        const content =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : e.currentTarget.textContent || "";

        updateBlockData(index, { text: content });
    },[blocks, updateBlockData]);

    const blockHoverHandler = useCallback(
        (e: any, id: string, index: number) => {
        setHoveredIndex(id);

        const blockId = blocks[index].id;
        const content =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : e.currentTarget.textContent || "";

        // 실제 변경이 있을 때만 업데이트
        if (content !== blocks[index].data.text) {
            updateBlockData(index, { text: content });
        }
    },[blocks, updateBlockData]);

    const blockLeaveHandler = useCallback(
        (e: any, index: number) => {
        const blockId = blocks[index].id;
        // contentRef에 저장된 내용 또는 현재 DOM 내용 사용
        const content =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : e.currentTarget.textContent || "";

        if (content !== blocks[index].data.text) {
            updateBlockData(index, { text: content });
        }
        setIsOptionBoxOpen({ isOpen: false, id: "" });
    },[blocks, updateBlockData]);

    const dragStartHandler = useCallback((e: React.DragEvent, index: number, id: string) => {
        e.dataTransfer.setData('index', index.toString());
        e.dataTransfer.setData('blockId', id); 
    }, []);
    
    const dragEndHandler = useCallback((e: React.DragEvent) => {
    }, []);
    
    const dragOverHandler = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);
    
    const dropHandler = useCallback((e: React.DragEvent, index: number, id: string) => {
        e.preventDefault();
        const sourceIndex = e.dataTransfer.getData('index');
    
        if (!sourceIndex) {
            console.error("인덱스를 가져오지 못했습니다.");
        } 
        moveBlock(Number(sourceIndex), index);
    }, [moveBlock]);

    // 7. useEffect - 최신 저장상태 / 언마운트 작동 

    useEffect(() => {
    if (initialData && initialData.length > 0) {
        const initialStateMap: Record<string, string> = {};
        const initialStyleMap: Record<string, string> = {};
        const initialColorMap: Record<string, string> = {};
        
        initialData.forEach((block) => {
            initialStateMap[block.id] = block.data.text || "";
            initialStyleMap[block.id] = block.data.style || "basic";
            initialColorMap[block.id] = block.data.color || "black";
        });
        
        lastSavedStateRef.current = initialStateMap;
        lastSavedStylesRef.current = initialStyleMap;
        lastSavedColorsRef.current = initialColorMap;
    }
    }, [initialData]);

    useEffect(() => {
        if(!onSave) return;
        return () => {
            saveData();
        };
    }, [saveData,onSave]);

    // 8. 블록 렌더링 함수 - title / paragraph
    const renderBlock = useCallback(
        (block: BlockData, index: number) => {
        switch (block.type) {
            case "title":
            return (
                <div
                onMouseEnter={(e) => blockHoverHandler(e, block.id, index)}
                onMouseLeave={(e) => blockLeaveHandler(e, index)}
                className="relative !p-2 rounded group border flex items-center border-transparent"
                key={block.id}
                >
                <div
                    className={` ${
                    hoveredIndex === block.id
                        ? "opacity-40 cursor-pointer"
                        : "invisible"
                    }`}
                >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
                <div
                    className="outline-none w-[80%] min-h-[24px] !px-2 !py-1 focus:bg-gray-50 rounded font-bold text-2xl"
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onInput={(e) => handleInput(e, block.id)}
                    onBlur={(e) => handleBlur(e, index)}
                    dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
                    ref={(el) => {
                    if (el) blockRefs.current[block.id] = el;
                    }}
                />
                </div>
            );

            case "paragraph":
            default:
            return (
                <div
                onMouseEnter={(e) => blockHoverHandler(e, block.id, index)}
                onMouseLeave={(e) => blockLeaveHandler(e, index)}
                onDragOver={dragOverHandler}
                onDrop={(e)=>dropHandler(e,index,block.id)}
                className="relative !px-2 rounded group border flex items-center border-transparent"
                key={block.id}
                >
                <div
                    onClick={() =>
                    setIsOptionBoxOpen({
                        isOpen: !isOptionBoxOpen?.isOpen,
                        id: block.id,
                    })
                    }
                    className={`relative ${
                    hoveredIndex === block.id ? "cursor-pointer" : "invisible"
                    }`}
                    onDragStart={(e)=>dragStartHandler(e,index,block.id)}
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
                    />
                    )}
                </div>
                <div
                    className=
                    {`outline-none w-[80%] min-h-[24px] px-2 py-1 focus:bg-white rounded focus:border-gray-200
                        ${
                        block.data.style==='basic' ? '' 
                        : block.data.style==='underline' ? 'underline'
                        : block.data.style==='bold' ? 'font-bold'
                        : block.data.style==='cancelline' ? 'line-through' 
                        : block.data.style==='crooked' ? 'italic' : ''
                        }    
                    `}
                    style={{color : `${block.data.color}`}}
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onInput={(e) => handleInput(e, block.id)}
                    onBlur={(e) => handleBlur(e, index)}
                    dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
                    ref={(el) => {
                    if (el) blockRefs.current[block.id] = el;
                    }}
                />
                </div>
            );
        }
        },
        [
        handleKeyDown,
        handleInput,
        handleBlur,
        hoveredIndex,
        blockHoverHandler,
        blockLeaveHandler,
        isOptionBoxOpen,
        ]
    );

    return {
        blocks,
        addBlock,
        removeBlock,
        updateBlockData,
        changeBlockType,
        handleKeyDown,
        renderBlock,
    };
};
