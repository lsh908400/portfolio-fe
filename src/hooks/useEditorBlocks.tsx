import { useState, useCallback, useRef } from 'react';
import { BlockData } from '../types';

interface UseEditorBlocksProps {
  initialData?: BlockData[];
  onChange?: (blocks: BlockData[]) => void;
}

interface UseEditorBlocksReturn {
  blocks: BlockData[];
  addBlock: (index: number, type?: BlockData['type']) => void;
  removeBlock: (index: number) => void;
  updateBlockData: (index: number, newData: Partial<BlockData['data']>) => void;
  changeBlockType: (index: number, newType: BlockData['type']) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  renderBlock: (block: BlockData, index: number) => React.ReactNode | null;
}

export const useEditorBlocks = ({ initialData = [], onChange }: UseEditorBlocksProps): UseEditorBlocksReturn => {
  // 고유 ID 생성 헬퍼 함수
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const generateId = useCallback((): string => {
    return '_' + Math.random().toString(36).substr(2, 9);
  }, []);

  // 상태 초기화
  const [blocks, setBlocks] = useState<BlockData[]>(initialData.length > 0 ? initialData : [
    {
      id: generateId(),
      type: 'paragraph',
      data: { text: `` }
    }
  ]);

  const [isOptionBoxOpen, setIsOptionBoxOpen] = useState<{
    isOpen : boolean;
    id : string;
  }>();

  // 현재 편집 중인 텍스트를 관리하기 위한 ref
  const contentRef = useRef<Record<string, string>>({});

  // 상태 변경 시 콜백 호출
  const updateBlocksAndNotify = useCallback((newBlocks: BlockData[]) => {
    setBlocks(newBlocks);
    if (onChange) {
      onChange(newBlocks);
    }
  }, [onChange]);

  // 새 블록 추가
  const addBlock = useCallback((index: number, type: BlockData['type'] = 'paragraph') => {
    const newBlocks = [...blocks];
    const newBlockId = generateId(); // 미리 ID 생성
    const newBlock: BlockData = {
      id: newBlockId,
      type,
      data: { text: '' }
    };
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocksAndNotify(newBlocks);
    return newBlockId; // 새 블록의 ID 반환
  }, [blocks, generateId, updateBlocksAndNotify]);

  // 블록 제거
  const removeBlock = useCallback((index: number) => {
    if (blocks.length > 1) {
      const newBlocks = [...blocks];
      const prevIndex = index - 1 >= 0 ? index - 1 : 0;
      const prevBlockId = blocks[prevIndex].id;
      
      newBlocks.splice(index, 1);
      updateBlocksAndNotify(newBlocks);
      
      return { prevIndex, prevBlockId }; // 이전 블록 정보 반환
    }
    return null;
  }, [blocks, updateBlocksAndNotify]);

  // 블록 내용 업데이트
  const updateBlockData = useCallback((index: number, newData: Partial<BlockData['data']>) => {
    const newBlocks = [...blocks];
    newBlocks[index].data = { ...newBlocks[index].data, ...newData };
    updateBlocksAndNotify(newBlocks);
  }, [blocks, updateBlocksAndNotify]);

  // 블록 타입 변경
  const changeBlockType = useCallback((index: number, newType: BlockData['type']) => {
    if (newType !== 'title' && newType !== 'paragraph') return; // 타이틀과 문단만 지원

    const newBlocks = [...blocks];
    const oldData = newBlocks[index].data;
    
    newBlocks[index] = {
      ...newBlocks[index],
      type: newType,
      data: { text: oldData.text || '' }
    };
    
    updateBlocksAndNotify(newBlocks);
  }, [blocks, updateBlocksAndNotify]);

  // 입력 이벤트 처리
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>, blockId: string) => {
    // 입력할 때마다 contentRef에 현재 내용 저장
    contentRef.current[blockId] = e.currentTarget.textContent || '';
  }, []);

  // 각 블록의 contentEditable 요소에 대한 ref를 저장
  const blockRefs = useRef<Record<string, HTMLDivElement>>({});
  
  // 키보드 이벤트 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const blockId = blocks[index].id;
    // 엔터키 처리
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // 현재 입력 중인 내용 저장
      const currentText = contentRef.current[blockId] || '';
      updateBlockData(index, { text: currentText });
      
      // 새 블록 추가하고 ID 받기
      const newBlockId = addBlock(index);
      
      // requestAnimationFrame을 사용하여 DOM 업데이트 후 실행되도록 함
      requestAnimationFrame(() => {
        if (newBlockId && blockRefs.current[newBlockId]) {
          // Focus the new block
          blockRefs.current[newBlockId].focus();
        }
      });
    } 
    // 백스페이스 처리 (비어있는 블록 삭제)
    else if (e.key === 'Backspace' && (e.currentTarget.textContent === '' || e.currentTarget.textContent === null)) {
        e.preventDefault();
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
  }, [blocks, addBlock, removeBlock, updateBlockData]);

  // 블록에서 포커스가 벗어났을 때 내용 저장
  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>, index: number) => {
    const blockId = blocks[index].id;
    // contentRef에 저장된 내용 또는 현재 DOM 내용 사용
    const content = contentRef.current[blockId] !== undefined 
      ? contentRef.current[blockId] 
      : e.currentTarget.textContent || '';
    
    updateBlockData(index, { text: content });
  }, [blocks, updateBlockData]);

  const blockHoverHandler = useCallback((id: string) => {
    setHoveredIndex(id);
  }, []);

  const blockLeaveHandler = useCallback(() => {
    setIsOptionBoxOpen({isOpen: false, id : ''})
  }, []);
  
  // 블록 렌더링 함수
  const renderBlock = useCallback((block: BlockData, index: number) => {
    switch (block.type) {
      case 'title':
        return (
          <div 
            onMouseEnter={() => blockHoverHandler(block.id)} 
            onMouseLeave={blockLeaveHandler} 
            className="relative !p-2 rounded group border flex items-center border-transparent hover:border-gray-200" 
            key={block.id}
          >
            <div className={` ${hoveredIndex === block.id ? 'opacity-40 cursor-pointer' : 'display-none'}`}>
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
              dangerouslySetInnerHTML={{ __html: block.data.text || '' }}
              ref={(el) => {
                if (el) blockRefs.current[block.id] = el;
              }}
            />
          </div>
        );
      
      case 'paragraph':
      default:
        return (
          <div 
            onMouseEnter={() => blockHoverHandler(block.id)} 
            onMouseLeave={blockLeaveHandler} 
            className="relative !px-2 rounded group border flex items-center border-transparent hover:border-gray-200" 
            key={block.id}
          >
            <div
                onClick={()=>setIsOptionBoxOpen({isOpen : !isOptionBoxOpen?.isOpen, id:block.id})} 
                className={`relative ${hoveredIndex === block.id ? 'cursor-pointer' : 'display-none'}`}>
                <i className="fa-solid fa-ellipsis-vertical opacity-40"></i>
                <i className="fa-solid fa-ellipsis-vertical opacity-40"></i>
                <i className="fa-solid fa-ellipsis-vertical opacity-40"></i>
                {(isOptionBoxOpen?.isOpen&&(isOptionBoxOpen.id===block.id)) &&
                <div className='option_box absolute top-[-30px] left-0 border w-[200px] h-[30px] bg-white opacity-100 z-50 flex items-center'>
                    asdfasdf
                </div>
                }
            </div>
            <div
              className="outline-none w-[80%] min-h-[24px] px-2 py-1 focus:bg-gray-50 rounded"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => handleKeyDown(e, index)}
              onInput={(e) => handleInput(e, block.id)}
              onBlur={(e) => handleBlur(e, index)}
              dangerouslySetInnerHTML={{ __html: block.data.text || '' }}
              ref={(el) => {
                if (el) blockRefs.current[block.id] = el;
              }}
            />
          </div>
        );
    }
  }, [handleKeyDown, handleInput, handleBlur, hoveredIndex, blockHoverHandler, blockLeaveHandler, isOptionBoxOpen]);

  return {
    blocks,
    addBlock,
    removeBlock,
    updateBlockData,
    changeBlockType,
    handleKeyDown,
    renderBlock
  };
};