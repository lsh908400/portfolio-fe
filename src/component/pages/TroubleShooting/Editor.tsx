import React, { useRef, useEffect } from 'react';
import { useEditorBlocks } from '../../../hooks/useEditorBlocks';

interface BlockData {
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

interface EditorProps {
    initialData?: BlockData[];
    onChange?: (blocks: BlockData[]) => void;
}

const Editor: React.FC<EditorProps> = ({ initialData = [], onChange }) => {
    const {blocks,addBlock,renderBlock} = useEditorBlocks({initialData,onChange});
    
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
            if (onChange) {
            onChange(blocks);
            }
    }, [blocks, onChange]);

    return (
        <section className="editor_section border border-gray-200 rounded-lg p-6 shadow-sm bg-white mx-auto h-full overflow-auto" ref={editorRef}>
            {blocks.map((block, index) => renderBlock(block, index))}
            <button 
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                onClick={() => addBlock(blocks.length - 1)}
            >
                + 블록 추가
            </button>
        </section>
    );
};


export default Editor;