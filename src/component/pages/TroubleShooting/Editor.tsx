import React, { useRef } from 'react';
import { useEditorBlocks } from '../../../hooks/useEditorBlocks';
import { BlockData } from '../../../types';


interface EditorProps {
    initialData?: BlockData[];
    onChange?: (blocks: BlockData[]) => void;
    title : string | undefined;
}

const Editor: React.FC<EditorProps> = ({ initialData, onChange, title }) => {
    const {blocks,renderBlock} = useEditorBlocks({initialData,onChange});
    
    const editorRef = useRef<HTMLDivElement>(null);


    return (
        <section className="editor_section border border-gray-200 rounded-lg p-6 shadow-sm bg-gray mx-auto h-full overflow-auto" ref={editorRef}>
            <div className='editor_title text-[2em] !mb-4 font-sans !px-4'>{title}</div>
            {blocks.map((block, index) => renderBlock(block, index))}
            {/* <button 
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                onClick={() => addBlock(blocks.length - 1)}
            >
                + 블록 추가
            </button> */}
        </section>
    );
};


export default Editor;