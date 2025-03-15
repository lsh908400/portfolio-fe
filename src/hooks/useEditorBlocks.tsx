/**
 * 2025 03 14 - 이상훈
 * 0. 기초 함수
 * 1. useState - 호버 / 블럭 / 옵션 박스
 * 2. useRef - save state / order / currendBlocks / block / style / color / file
 * 3. changedBoolean - 블럭오더 / 블럭내용 / 스타일 / 컬러 / file
 * 4. onSave 콜백함수 - 변경사항 감지 후 Editor.tsx로 콜백
 * 5. 블럭 데이터 업데이트 - 순서 / 상태 / 내용
 * 6. 블럭 상태변경 - 인덱스 이동 / 추가 / 삭제 / 타입변경 / 스타일 변경 / 컬러변경 / 입력변경 / 키보드입력으로인한 / 블러 / 엔더 / 리브 / 드래그 / file
 * 7. useEffect - 최신 저장상태 / 언마운트 작동
 * 8. 블록 렌더링 함수 - title / paragraph
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { BlockData } from "../types";
import EditorOption from "../component/pages/TroubleShooting/Menu/EditorOption";
import { IconHoverEnum, TypeEnum, TypeEnumChanger } from "../types/enum";
import ResizableImage from "../component/util/ResizableImage";
import CodeBlockComponent from "../component/pages/TroubleShooting/Type/CodeBlockComponent";

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
    changeBlockType: (block : BlockData, type : TypeEnum) => void;
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


    // 1.useState - 호버 / 블럭 / 옵션 박스 / 타입 박스
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
            data: { text: ``,style: 'basic', color: 'black', url:''},
            index: 0,
        }];
    });
    const [isOptionBoxOpen, setIsOptionBoxOpen] = useState<{
        isOpen: boolean;
        id: string;
    }>();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<string>('');


    // 2. useRef - save state / order / currendBlocks / block / style / color / 작성중 상태
    const lastSavedStateRef = useRef<Record<string, string>>({});
    const lastSavedOrderRef = useRef<string[]>(blocks.map(block => block.id));
    const contentRef = useRef<Record<string, string>>({});
    const blockRefs = useRef<Record<string, HTMLDivElement | HTMLElement>>({});
    const lastSavedStylesRef = useRef<Record<string, string>>({});
    const lastSavedColorsRef = useRef<Record<string, string>>({});
    const lastSavedTypeRef = useRef<Record<string, string>>({});
    const lastSavedFileRef = useRef<Record<string, string>>({});
    const lastSavedFileWidthRef = useRef<Record<string, number>>({});
    const lastSavedFileHeightRef = useRef<Record<string, number>>({});
    const lastSavedLanguageRef = useRef<Record<string, string>>({});
    const isWritingRef = useRef<boolean>(false);
    const timerIdRef = useRef<number | null>(null);
    const hoveredIndexRef = useRef<string | null>(null);

    // 3. changedBoolean - 블럭오더 / 블럭내용 / 스타일 / 컬러
    const getChangedBlocks = useCallback(() => {
        const changedBlocks = blocks.filter((block) => {
        const blockId = block.id;
        const currentText =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : block.data.text || "";

        const lastSavedText = lastSavedStateRef.current[blockId];
        return lastSavedText === undefined || lastSavedText !== currentText;
        });

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
        const hasStyleChanges = blocks.some(block => {
            const currentStyle = block.data.style || 'basic';
            const lastSavedStyle = lastSavedStylesRef.current[block.id] || 'basic';
            
            return currentStyle !== lastSavedStyle;
        });
        
        return hasStyleChanges;
    }, [blocks]);

    const colorsHaveChanged = useCallback(() => {
        const hasColorChanges = blocks.some(block => {
            const currentColor = block.data.color || 'black';
            const lastSavedColor = lastSavedColorsRef.current[block.id] || 'black';
            
            return currentColor !== lastSavedColor;
        });
        
        return hasColorChanges;
    }, [blocks]);

    const typeHaveChanged = useCallback(()=>{
        const hasTypeChanges = blocks.some(block => {
            const currentType = block.type || 'paragraph';
            const lastSavedType = lastSavedTypeRef.current[block.id] || 'paragraph'

            return currentType !== lastSavedType
        })

        return hasTypeChanges;
    },[blocks])

    const fileHaveChanged = useCallback(()=>{
        const hasFileChanges = blocks.some(block => {
            const currentFile = block.data.url || '';
            const lastSavedFile = lastSavedFileRef.current[block.id] || '';

            return currentFile !== lastSavedFile
        })
        return hasFileChanges;
    },[blocks])

    const fileSizeHaveChanged = useCallback(()=>{
        const hasFileSizeChanges = blocks.some(block => {
            const currentFileWidth = block.data.imageWidth || 500
            const currentFileHeight = block.data.imageHeight || 300
            const lastSavedFileWidth = lastSavedFileWidthRef.current[block.id] || 500
            const lastSavedFileHeight = lastSavedFileHeightRef.current[block.id] || 300

            return (currentFileWidth !== lastSavedFileWidth)||(currentFileHeight !== lastSavedFileHeight)
        })
        return hasFileSizeChanges;
    },[blocks])

    const fileLanguageChanged = useCallback(()=>{
        const hasLanguageChanges = blocks.some(block => {
            const currentLanguage = block.data.language || 'javascript'
            const lastSavedLanguage = lastSavedLanguageRef.current[block.id] || 'javascript'

            return currentLanguage !== lastSavedLanguage
        })
        return hasLanguageChanges;
    },[blocks])


    // 4. onSave 콜백함수 - 변경사항 감지 후 Editor.tsx로 콜백
    const saveData = useCallback(() => {
        if (!onSave) return;
        const changedBlocks = getChangedBlocks();
        if (changedBlocks.length > 0 || orderHasChanged() || stylesHaveChanged() || colorsHaveChanged() || typeHaveChanged() || fileHaveChanged() || fileSizeHaveChanged() || fileLanguageChanged()) {
            onSave(blocks);
            const newStateMap: Record<string, string> = {};
            const newStyleMap: Record<string, string> = {};
            const newColorMap: Record<string, string> = {};
            const newTypeMap: Record<string, string> = {};
            const newFileMap: Record<string, string> = {};
            const newFileWidthMap: Record<string, number> = {};
            const newFileHeightMap: Record<string, number> = {};
            const newLanguageMap: Record<string, string> = {};
            
            blocks.forEach((block) => {
                newStateMap[block.id] = block.data.text || "";
                newStyleMap[block.id] = block.data.style || "basic";
                newColorMap[block.id] = block.data.color || "black";
                newTypeMap[block.id] = block.type || 'paragraph';
                newFileMap[block.id] = block.data.url || '';
                newFileWidthMap[block.id] = block.data.imageWidth || 500;
                newFileHeightMap[block.id] = block.data.imageHeight || 300;
                newLanguageMap[block.id] = block.data.language || 'javascript'
            });
            
            lastSavedStateRef.current = newStateMap;
            lastSavedStylesRef.current = newStyleMap;
            lastSavedColorsRef.current = newColorMap;
            lastSavedTypeRef.current = newTypeMap;
            lastSavedFileRef.current = newFileMap;
            lastSavedFileWidthRef.current = newFileWidthMap;
            lastSavedFileHeightRef.current = newFileHeightMap;
            lastSavedLanguageRef.current = newLanguageMap;
        }
    }, [getChangedBlocks, orderHasChanged, onSave, blocks , stylesHaveChanged ,colorsHaveChanged, typeHaveChanged, fileHaveChanged ,fileSizeHaveChanged, fileLanguageChanged]);

    
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
            hasChanges = true;
        }

        if (
            "imageWidth" in newData &&
            newData.imageWidth !== currentBlock.data.imageWidth
        ){
            hasChanges = true;
        }

        if (
            "imageHeight" in newData &&
            newData.imageHeight !== currentBlock.data.imageHeight
        ){
            hasChanges = true;
        }

        if (
            "language" in newData &&
            newData.language !== currentBlock.data.language
        ){
            hasChanges = true;
        }

        // 변경사항이 있을 때만 상태 업데이트
        if (hasChanges) {
            const newBlocks = [...blocks];
            newBlocks[index].data = { ...currentBlock.data, ...newData };
            console.log(lastSavedFileRef.current)
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
        
        updateBlocksAndNotify(newBlocks);
        return newBlocks;
    },[blocks, updateBlocksAndNotify]);

    const addBlock = useCallback((index: number, type: BlockData["type"] = "paragraph") => {
        const newBlocks = [...blocks];
        const newBlockId = generateId(); // 미리 ID 생성
        const newBlock: BlockData = {
            id: newBlockId,
            type,
            data: { text: ``,style: 'basic', color: 'black', url:''},
            index: (index+1),
        };
        newBlocks.splice(index + 1, 0, newBlock);
        updateBlocksAndNotify(newBlocks);
        return newBlockId; // 새 블록의 ID 반환
    },[blocks, generateId, updateBlocksAndNotify]);

    const removeBlock = useCallback((index: number) => {
        if (blocks.length > 1) {
            const newBlocks = [...blocks];
            const prevIndex = index - 1 >= 0 ? index - 1 : 0;
            const prevBlockId = blocks[prevIndex].id;

            newBlocks.splice(index, 1);
            updateBlocksAndNotify(newBlocks)
            return { prevIndex, prevBlockId }; // 이전 블록 정보 반환
        }
        return null;
    },[blocks]);

    const removeBlockHandler = useCallback((index : number)=>{
        const prevBlockInfo = removeBlock(index);
        const blockId = blocks[index].id
        // requestAnimationFrame을 사용하여 DOM 업데이트 후 실행되도록 함
        if (prevBlockInfo) {
            setIsOptionBoxOpen({
                isOpen: false,
                id: blockId,
            })
            setShowMenu(false);
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
    },[blocks])

    const changeBlockType = useCallback((block : BlockData, type : TypeEnum) => {
        const targetBlock = 
        blocks[block.index].id
        switch(TypeEnumChanger[type])
        {
            case 'paragraph' :
            {
                const newType = TypeEnumChanger[type]
                setBlocks(prevBlocks => 
                    prevBlocks.map(b =>
                        b.id === targetBlock 
                        ? (b.data.text === '/' 
                            ? {...b, type: newType, data: {text: ''}} 
                            : {...b, type: newType}
                            )
                        : b
                    )
                );
                break;
            }
            case 'title' :
            {
                const newType = TypeEnumChanger[type]
                setBlocks(prevBlocks => 
                    prevBlocks.map(b =>
                        b.id === targetBlock 
                        ? (b.data.text === '/' 
                            ? {...b, type: newType, data: {text: ''}} 
                            : {...b, type: newType}
                            )
                        : b
                    )
                );
                break;
            }
            case 'img' : 
            {
                
                const newType = TypeEnumChanger[type]
                setBlocks(prevBlocks => 
                    prevBlocks.map(b =>
                        b.id === targetBlock 
                        ? {...b, type: newType, data: {text : ''}}
                        : b
                    )
                );
                break;
            }
            case 'code' :
            {
                const newType = TypeEnumChanger[type]
                setBlocks(prevBlocks => 
                    prevBlocks.map(b =>
                        b.id === targetBlock 
                        ? {...b, type: newType, data: {text : ''}}
                        : b
                    )
                );
                break;
            }
        }
        

    },[updateBlockData]);

    const changeBlockStyle = useCallback((block : BlockData ,type : IconHoverEnum)=>{
        let enumChanger = ['delete','plus','basic','crooked','underline','bold','cancelline','link']
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
        updateBlockData(block.index, { color: color })
        
    },[updateBlockData]);

    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement | HTMLElement>, blockId: string) => {
        contentRef.current[blockId] = e.currentTarget.textContent || "";
        
    },[]);
    
    const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
        isWritingRef.current = true;
        if (timerIdRef.current !== null) {
            clearTimeout(timerIdRef.current);
        }
        timerIdRef.current = window.setTimeout(() => {
            isWritingRef.current = false;
            timerIdRef.current = null;
        }, 3000);
        const blockId = blocks[index].id;
        if(e.key === "/" && !e.shiftKey && e.currentTarget.textContent?.length===0){
            setIsOptionBoxOpen({
                isOpen : true,
                id : blockId
            })
            setShowMenu(true);
        }
        
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const currentText = contentRef.current[blockId] || "";
            const storedText = blocks[index].data.text || "";

            if ((currentText !== storedText)&&currentText !== "") {
                updateBlockData(index, { text: currentText });
            }

            const newBlockId = addBlock(index);

            requestAnimationFrame(() => {
            if (newBlockId && blockRefs.current[newBlockId]) {
                blockRefs.current[newBlockId].focus();
                hoveredIndexRef.current = newBlockId;
                const newBlockContainer = blockRefs.current[newBlockId].closest('.block-container');

                document.querySelectorAll('.hover-handle').forEach(el => {
                    el.classList.add('invisible');
                    el.classList.remove('cursor-pointer');
                });

                if (newBlockContainer) {
                    const hoverHandle = newBlockContainer.querySelector('.hover-handle');
                    if (hoverHandle) {
                        hoverHandle.classList.remove('invisible');
                        hoverHandle.classList.add('cursor-pointer');
                    }
                }
            }
            });
        }
        else if (
            e.key === "Backspace" &&
            (e.currentTarget.textContent === "" ||
            e.currentTarget.textContent === null)
        ) {
            e.preventDefault();
            hoveredIndexRef.current = null;
            const element = e.currentTarget.querySelector('.hover-handle');
            if (element) {
                element.classList.add('invisible');
                element.classList.remove('cursor-pointer');
            }
            const currentText = contentRef.current[blockId] || "";
            // 텍스트가 변경된 경우에만 업데이트
            if (currentText === "") {
                updateBlockData(index, { text: currentText });
            }
            const prevBlockInfo = removeBlock(index);

            // requestAnimationFrame을 사용하여 DOM 업데이트 후 실행되도록 함
            if (prevBlockInfo) {
                setIsOptionBoxOpen({
                    isOpen: false,
                    id: blockId,
                })
                setShowMenu(false);
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
    },[blocks, addBlock, removeBlock, updateBlockData, isOptionBoxOpen, showMenu]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement | HTMLElement>, index: number) => {
        const blockId = blocks[index].id;
        const content =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : e.currentTarget.textContent || "";

        updateBlockData(index, { text: content });
    },[blocks, updateBlockData]);

    const blockHoverHandler = useCallback((e: any, id: string, index: number) => {
        if(isWritingRef.current) return;
        if(isOptionBoxOpen?.isOpen) return;
        hoveredIndexRef.current = id;
        const element = e.currentTarget.querySelector('.hover-handle');
        if (element) {
            element.classList.remove('invisible');
            element.classList.add('cursor-pointer');
        }
        const blockId = blocks[index].id;
        const content =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : e.currentTarget.textContent || "";

        // 실제 변경이 있을 때만 업데이트
        if ((content !== blocks[index].data.text)&&blocks[index].type!=='code') {
            updateBlockData(index, { text: content });
        }
    },[blocks, updateBlockData, isWritingRef.current, isOptionBoxOpen]);

    const blockLeaveHandler = useCallback((e: any, index: number) => {
        if(isWritingRef.current) return;
        if(isOptionBoxOpen?.isOpen) return;
        hoveredIndexRef.current = null;
    
        // DOM 직접 조작으로 호버 효과 제거
        const element = e.currentTarget.querySelector('.hover-handle');
        if (element) {
            element.classList.add('invisible');
            element.classList.remove('cursor-pointer');
        }
        const blockId = blocks[index].id;
        const content =
            contentRef.current[blockId] !== undefined
            ? contentRef.current[blockId]
            : e.currentTarget.textContent || "";

        if ((content !== blocks[index].data.text)&&blocks[index].type!=='code') {
            updateBlockData(index, { text: content });
        }
        if(isOptionBoxOpen)
        {
            setIsOptionBoxOpen({ isOpen: false, id: "" });
        }
    },[blocks, updateBlockData, isWritingRef.current, isOptionBoxOpen]);

    const dragStartHandler = useCallback((e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('index', index.toString());
    }, []);
    
    const dragEndHandler = useCallback(() => {
    }, []);
    
    const dragOverHandler = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);
    
    const dropHandler = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        const sourceIndex = e.dataTransfer.getData('index');
    
        if (!sourceIndex) {
            console.error("인덱스를 가져오지 못했습니다.");
        } 
        moveBlock(Number(sourceIndex), index);
    }, [moveBlock]);

    const isFocusChecker = useCallback(()=>{
        isWritingRef.current = true;

        if (timerIdRef.current !== null) {
            clearTimeout(timerIdRef.current);
        }
        timerIdRef.current = window.setTimeout(() => {
            isWritingRef.current = false;
            timerIdRef.current = null;
        }, 3000);
    },[])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>,index : number) => {
        const file = e.target.files?.[0];
        if (file) {
            // 파일을 처리하는 로직
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                // 블록 데이터 업데이트
                updateBlockData(index, { url : imageUrl });
            };
            reader.readAsDataURL(file);
        }
        // 입력값 초기화
        e.target.value = '';
    },[blocks])


    // 7. useEffect - 최신 저장상태 / 언마운트 작동 / setTimeout 초기화

    useEffect(() => {
    if (initialData && initialData.length > 0) {
        const initialStateMap: Record<string, string> = {};
        const initialStyleMap: Record<string, string> = {};
        const initialColorMap: Record<string, string> = {};
        const initialTypeMap: Record<string, string> = {};
        const initialFileMap: Record<string, string> = {};
        const initialFileWidthMap: Record<string, number> = {};
        const initialFileHeightMap: Record<string, number> = {};
        const initialLanguageMap: Record<string, string> = {};
        
        initialData.forEach((block) => {
            initialStateMap[block.id] = block.data.text || "";
            initialStyleMap[block.id] = block.data.style || "basic";
            initialColorMap[block.id] = block.data.color || "black";
            initialTypeMap[block.id] = block.type || 'paragraph';
            initialFileMap[block.id] = block.data.url || '';
            initialFileWidthMap[block.id] = block.data.imageWidth || 500;
            initialFileHeightMap[block.id] = block.data.imageHeight || 300;
            initialLanguageMap[block.id] = block.data.language || 'javascript'
        });
        
        lastSavedStateRef.current = initialStateMap;
        lastSavedStylesRef.current = initialStyleMap;
        lastSavedColorsRef.current = initialColorMap;
        lastSavedTypeRef.current = initialTypeMap;
        lastSavedFileRef.current = initialFileMap;
        lastSavedFileWidthRef.current = initialFileWidthMap;
        lastSavedFileHeightRef.current = initialFileHeightMap;
        lastSavedLanguageRef.current = initialLanguageMap;
    }
    }, [initialData]);

    useEffect(() => {
        if(!onSave) return;
        return () => {
            saveData();
        };
    }, [saveData,onSave]);

    useEffect(() => {
        return () => {
            if (timerIdRef.current !== null) {
                clearTimeout(timerIdRef.current);
            }
        };
    }, []);

    

    // 8. 블록 렌더링 함수 - title / paragraph / img
    const renderTitleBlock = useCallback((block: BlockData, index: number) => {
        return (
            <div
                onMouseEnter={(e) => blockHoverHandler(e, block.id, index)}
                onMouseLeave={(e) => blockLeaveHandler(e, index)}
                onDragOver={dragOverHandler}
                onDrop={(e) => dropHandler(e, index)}
                className="relative !px-2 !mb-2 rounded group border flex items-start border-transparent block-container"
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
                <div
                className={`outline-none w-[80%] min-h-[24px] px-2 focus:bg-white font-bold text-2xl rounded focus:border-gray-200
                    ${
                    block.data.style === 'basic' ? '' 
                    : block.data.style === 'underline' ? 'underline'
                    : block.data.style === 'bold' ? 'font-bold'
                    : block.data.style === 'cancelline' ? 'line-through' 
                    : block.data.style === 'crooked' ? 'italic' 
                    : block.data.style === 'link' ? 'text-blue-500 underline cursor-pointer'
                    : ''
                    }`}
                onClick={() => {
                    if (block.data.style === 'link' && block.data.text) {
                    window.open(`https://${block.data.text}`, '_blank');
                    }
                }}
                style={{ color: `${block.data.color}` }}
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
        }, [
        handleKeyDown,
        handleInput,
        handleBlur,
        blockHoverHandler,
        blockLeaveHandler,
        isOptionBoxOpen,
        dragOverHandler,
        dropHandler,
        dragStartHandler,
        dragEndHandler,
        setIsOptionBoxOpen,
        showMenu,
        setShowMenu,
        changeBlockStyle,
        changeBlockColor,
        changeBlockType,
        removeBlockHandler,
        blockRefs
    ]);

    const renderParagraphBlock = useCallback((block: BlockData, index: number) => {
        return (
            <div
                onMouseEnter={(e) => blockHoverHandler(e, block.id, index)}
                onMouseLeave={(e) => blockLeaveHandler(e, index)}
                onDragOver={dragOverHandler}
                onDrop={(e) => dropHandler(e, index)}
                className="relative !px-2 !mb-2 rounded group border flex items-start border-transparent block-container"
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
                <div
                className={`outline-none w-[80%] min-h-[24px] px-2 focus:bg-white rounded focus:border-gray-200
                    ${
                    block.data.style === 'basic' ? '' 
                    : block.data.style === 'underline' ? 'underline'
                    : block.data.style === 'bold' ? 'font-bold'
                    : block.data.style === 'cancelline' ? 'line-through' 
                    : block.data.style === 'crooked' ? 'italic' 
                    : block.data.style === 'link' ? 'text-blue-500 underline cursor-pointer'
                    : ''
                    }`}
                onClick={() => {
                    if (block.data.style === 'link' && block.data.text) {
                    window.open(`https://${block.data.text}`, '_blank');
                    }
                    else {
                    isFocusChecker()
                    }
                }}
                style={{ color: `${block.data.color}` }}
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
        }, [
            handleKeyDown,
            handleInput,
            handleBlur,
            blockHoverHandler,
            blockLeaveHandler,
            isOptionBoxOpen,
            dragOverHandler,
            dropHandler,
            dragStartHandler,
            dragEndHandler,
            setIsOptionBoxOpen,
            showMenu,
            setShowMenu,
            changeBlockStyle,
            changeBlockColor,
            changeBlockType,
            removeBlockHandler,
            isFocusChecker,
            blockRefs
    ]);

    const renderImageBlock = useCallback((block: BlockData, index: number) => {
        // 이미지 URL 생성 함수
        const getImageUrl = (url: string) => {
            if (url.startsWith('data:')) {
                return url;
            } else if (url.startsWith('/uploads/')) {
                return url;
            } else {
                return `${import.meta.env.VITE_API_URL}/uploads/${url.split('/').pop()}`;
            }
            };
        
            // 이미지 크기 업데이트 핸들러
            const handleImageResize = (width: number, height: number) => {
            // 블록의 이미지 크기 데이터 업데이트
            updateBlockData(index, { 
                ...block.data,
                imageWidth: width,
                imageHeight: height
            });
            };
        
            return (
            <div
                onMouseEnter={(e) => blockHoverHandler(e, block.id, index)}
                onMouseLeave={(e) => blockLeaveHandler(e, index)}
                onDragOver={dragOverHandler}
                onDrop={(e) => dropHandler(e, index)}
                className="relative !px-2 !mb-2 rounded group border flex items-start border-transparent block-container"
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
                <div className="outline-none w-[80%] min-h-[24px] px-2 focus:bg-white rounded focus:border-gray-200 flex flex-col items-center">
                {block.data.url ? (
                    <div className="relative w-full">
                    {/* ResizableImage 컴포넌트 사용 */}
                    <ResizableImage
                        src={getImageUrl(block.data.url)}
                        alt="업로드된 이미지"
                        className="my-2"
                        initialWidth={block.data.imageWidth || '100%'}
                        onResize={handleImageResize}
                    />
                    <button
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        onClick={() => {
                        updateBlockData(index, { url: "" });
                        }}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                    </div>
                ) : (
                    <div className="w-full py-4 flex flex-col items-center">
                    <div className="text-gray-400 mb-2">이미지를 업로드하세요</div>
                    <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center">
                        <i className="fa-solid fa-upload mr-2"></i>
                        <span>파일 선택</span>
                        <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, index)}
                        />
                    </label>
                    </div>
                )}
                </div>
            </div>
            );
        }, [
        blockHoverHandler,
        blockLeaveHandler,
        isOptionBoxOpen,
        dragOverHandler,
        dropHandler,
        dragStartHandler,
        dragEndHandler,
        setIsOptionBoxOpen,
        showMenu,
        setShowMenu,
        changeBlockStyle,
        changeBlockColor,
        changeBlockType,
        removeBlockHandler,
        updateBlockData,
        handleFileChange,
    ]);

    const renderCodeBlock = useCallback((block: BlockData, index: number) => {
        return (
          <CodeBlockComponent
            key={block.id}
            block={block}
            index={index}
            blockRefs={blockRefs}
            isOptionBoxOpen={isOptionBoxOpen}
            copySuccess={copySuccess}
            updateBlockData={updateBlockData}
            handleKeyDown={handleKeyDown}
            handleInput={handleInput}
            blockHoverHandler={blockHoverHandler}
            blockLeaveHandler={blockLeaveHandler}
            setIsOptionBoxOpen={setIsOptionBoxOpen}
            dragOverHandler={dragOverHandler}
            dropHandler={dropHandler}
            dragStartHandler={dragStartHandler}
            dragEndHandler={dragEndHandler}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            changeBlockStyle={changeBlockStyle}
            changeBlockColor={changeBlockColor}
            changeBlockType={changeBlockType}
            removeBlockHandler={removeBlockHandler}
            setCopySuccess={setCopySuccess}
          />
        );
      }, [
        isOptionBoxOpen,
        copySuccess,
        updateBlockData,
        handleKeyDown,
        handleInput,
        handleBlur,
        blockHoverHandler,
        blockLeaveHandler,
        dragOverHandler,
        dropHandler,
        dragStartHandler,
        dragEndHandler,
        showMenu,
        setShowMenu,
        changeBlockStyle,
        changeBlockColor,
        changeBlockType,
        removeBlockHandler,
        setCopySuccess
      ]);

    const renderBlock = useCallback((block: BlockData, index: number) => {
        switch (block.type) {
            case "title":
                return renderTitleBlock(block, index);
            case "paragraph":
                return renderParagraphBlock(block, index);
            case "img":
                return renderImageBlock(block, index);
            case "code":
                return renderCodeBlock(block, index);
            default:
            return null;
        }
    }, [renderTitleBlock, renderParagraphBlock, renderImageBlock]);

    

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
