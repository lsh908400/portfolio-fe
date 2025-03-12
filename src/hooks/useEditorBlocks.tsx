// useEditorBlocks.ts
import { useState, useCallback } from 'react';

// 타입 정의
export interface BlockData {
  id: string;
  type: 'paragraph' | 'header' | 'list' | 'image' | 'title';
  data: {
    text?: string;
    level?: number;
    items?: string[];
    url?: string;
    caption?: string;
  };
}

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
            type: 'title',
            data: {text: `헤더 테스트` }
            }
    ]);

    // 상태 변경 시 콜백 호출
    const updateBlocksAndNotify = useCallback((newBlocks: BlockData[]) => {
            setBlocks(newBlocks);
            if (onChange) 
            {
                onChange(newBlocks);
            }
    }, [onChange]);

    // 새 블록 추가
    const addBlock = useCallback((index: number, type: BlockData['type'] = 'paragraph') => {
            const newBlocks = [...blocks];
            const newBlock: BlockData = {
                id: generateId(),
                type,
                data: { text: '' }
            };
            newBlocks.splice(index + 1, 0, newBlock);
            updateBlocksAndNotify(newBlocks);
    }, [blocks, generateId, updateBlocksAndNotify]);

    // 블록 제거
    const removeBlock = useCallback((index: number) => {
        if (blocks.length > 1) {
            const newBlocks = [...blocks];
            newBlocks.splice(index, 1);
            updateBlocksAndNotify(newBlocks);
        }
    }, [blocks, updateBlocksAndNotify]);

    // 블록 내용 업데이트
    const updateBlockData = useCallback((index: number, newData: Partial<BlockData['data']>) => {
            const newBlocks = [...blocks];
            newBlocks[index].data = { ...newBlocks[index].data, ...newData };
            updateBlocksAndNotify(newBlocks);
    }, [blocks, updateBlocksAndNotify]);

    // 블록 타입 변경
    const changeBlockType = useCallback((index: number, newType: BlockData['type']) => {
            const newBlocks = [...blocks];
            const oldData = newBlocks[index].data;
            
            // 타입에 따라 필요한 데이터 초기화
            let newData: BlockData['data'] = {};
            
            if (newType === 'paragraph' || newType === 'header') {
                newData = { text: oldData.text || '' };
            if (newType === 'header') {
                newData.level = 2; // 기본 헤더 레벨
            }
            } else if (newType === 'list') {
                newData = { items: oldData.text ? [oldData.text] : [''] };
            } else if (newType === 'image') {
                newData = { url: '', caption: '' };
            }
            
            newBlocks[index] = {
                ...newBlocks[index],
                type: newType,
                data: newData
            };
            
            updateBlocksAndNotify(newBlocks);
    }, [blocks, updateBlocksAndNotify]);

    // 키보드 이벤트 처리
    const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
            if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addBlock(index);
            } else if (e.key === 'Backspace' && blocks[index].data.text === '') {
            e.preventDefault();
            removeBlock(index);
            }
    }, [blocks, addBlock, removeBlock]);

    const blockHoverHandler = (id : string) => {
        setHoveredIndex(id);
    }

    const blockLeaveHandler = () => {
        setHoveredIndex(null);
    }
    
    // 블록 렌더링 함수
    const renderBlock = useCallback((block: BlockData, index: number) => {
        switch (block.type) {
            case 'paragraph':
                return (
                <div className="relative mb-4 p-2 rounded group border border-transparent hover:border-gray-200" key={block.id}>
                    <div className="absolute left-0 top-0 -ml-10 hidden group-hover:flex flex-col gap-1">
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 p-1 rounded text-xs w-8 h-8 flex items-center justify-center"
                        onClick={() => changeBlockType(index, 'header')}
                    >
                        H
                    </button>
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 p-1 rounded text-xs w-8 h-8 flex items-center justify-center"
                        onClick={() => changeBlockType(index, 'list')}
                    >
                        List
                    </button>
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 p-1 rounded text-xs w-8 h-8 flex items-center justify-center"
                        onClick={() => changeBlockType(index, 'image')}
                    >
                        Img
                    </button>
                    </div>
                    <div
                    className="outline-none min-h-[24px] px-2 py-1 focus:bg-gray-50 rounded"
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onBlur={(e) => updateBlockData(index, { text: e.currentTarget.textContent || '' })}
                    dangerouslySetInnerHTML={{ __html: block.data.text || '' }}
                    />
                </div>
                );
                
            case 'header':
                return (
                <div onMouseLeave={blockLeaveHandler} onMouseEnter={() =>blockHoverHandler(block.id)} className="relative !mb-4 !p-2 rounded group border flex items-center border-transparent hover:border-gray-200" key={block.id}>
                    <div className={`${hoveredIndex === block.id ? 'opacity-40 cursor-pointer' : 'invisible'}`}>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                    <div
                        className={`outline-none min-h-[24px] !px-2 !py-1 focus:bg-gray-50 rounded font-bold ${
                            block.data.level === 1 ? 'text-2xl' : 
                            block.data.level === 2 ? 'text-xl' : 
                            'text-lg'
                        }`}
                        contentEditable
                        suppressContentEditableWarning
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onBlur={(e) => updateBlockData(index, { text: e.currentTarget.textContent || '' })}
                        dangerouslySetInnerHTML={{ __html: block.data.text || '' }}
                    ></div>
                </div>
                );
            case 'title':
                return (
                <div onMouseLeave={blockLeaveHandler} onMouseEnter={() =>blockHoverHandler(block.id)} className="relative !mb-4 !p-2 rounded group border flex items-center border-transparent hover:border-gray-200" key={block.id}>
                    <div className={`${hoveredIndex === block.id ? 'opacity-40 cursor-pointer' : 'invisible'}`}>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                    <div
                        className={`outline-none min-h-[24px] !px-2 !py-1 focus:bg-gray-50 rounded font-bold ${
                            block.data.level === 1 ? 'text-2xl' : 
                            block.data.level === 2 ? 'text-xl' : 
                            'text-lg'
                        }`}
                        contentEditable
                        suppressContentEditableWarning
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onBlur={(e) => updateBlockData(index, { text: e.currentTarget.textContent || '' })}
                        dangerouslySetInnerHTML={{ __html: block.data.text || '' }}
                    ></div>
                </div>
                );
                
            case 'list':
                return (
                <div className="relative mb-4 p-2 rounded group border border-transparent hover:border-gray-200" key={block.id}>
                    <div className="absolute left-0 top-0 -ml-10 hidden group-hover:flex flex-col gap-1">
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 p-1 rounded text-xs w-8 h-8 flex items-center justify-center"
                        onClick={() => changeBlockType(index, 'paragraph')}
                    >
                        P
                    </button>
                    </div>
                    <ul className="list-disc pl-5 space-y-1">
                    {(block.data.items || ['']).map((item, itemIndex) => (
                        <li key={itemIndex} className="pl-1">
                        <div
                            className="outline-none min-h-[24px] focus:bg-gray-50 rounded px-2 py-1"
                            contentEditable
                            suppressContentEditableWarning
                            onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const newItems = [...(block.data.items || [''])];
                                newItems.splice(itemIndex + 1, 0, '');
                                updateBlockData(index, { items: newItems });
                            }
                            }}
                            onBlur={(e) => {
                            const newItems = [...(block.data.items || [''])];
                            newItems[itemIndex] = e.currentTarget.textContent || '';
                            updateBlockData(index, { items: newItems });
                            }}
                            dangerouslySetInnerHTML={{ __html: item }}
                        />
                        </li>
                    ))}
                    </ul>
                </div>
                );
                
            case 'image':
                return (
                <div className="relative mb-4 p-2 rounded group border border-transparent hover:border-gray-200" key={block.id}>
                    <div className="absolute left-0 top-0 -ml-10 hidden group-hover:flex flex-col gap-1">
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 p-1 rounded text-xs w-8 h-8 flex items-center justify-center"
                        onClick={() => changeBlockType(index, 'paragraph')}
                    >
                        P
                    </button>
                    </div>
                    <div className="space-y-2">
                    <input 
                        type="text" 
                        placeholder="이미지 URL 입력"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                        value={block.data.url || ''}
                        onChange={(e) => updateBlockData(index, { url: e.target.value })}
                    />
                    {block.data.url && (
                        <div className="mt-2 mb-2 border rounded p-2 bg-gray-50">
                        <img 
                            src={block.data.url} 
                            alt="이미지 미리보기" 
                            className="max-w-full max-h-96 object-contain mx-auto"
                        />
                        </div>
                    )}
                    <input 
                        type="text" 
                        placeholder="이미지 설명"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                        value={block.data.caption || ''}
                        onChange={(e) => updateBlockData(index, { caption: e.target.value })}
                    />
                    </div>
                </div>
                );
                
            default:
            return null;
        }
    }, [handleKeyDown, updateBlockData, changeBlockType ,hoveredIndex]);

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