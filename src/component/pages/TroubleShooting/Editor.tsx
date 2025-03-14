import React, { useCallback, useEffect, useRef } from 'react';
import { useEditorBlocks } from '../../../hooks/useEditorBlocks';
import { BlockData } from '../../../types';
import { postBlocks } from '../../../services/blockService';


interface EditorProps {
    initialData?: BlockData[];
    onChange?: (blocks: BlockData[]) => void;
    title : string | undefined;
    id : string | undefined;
}

const Editor: React.FC<EditorProps> = ({ initialData, onChange, title ,id }) => {
    const {blocks,renderBlock} = useEditorBlocks({
        initialData,
        onChange,
        onSave: (blocks)=>{blockSaveHandler(blocks)},
        autoSaveIntervalMs : 600000
    });
    const lastFilteredBlocksRef = useRef<BlockData[]>([]);

    const blockSaveHandler = async (blocks : BlockData[]) => {
        const filteredBlock = blocks.filter(block => block.data.text?.trim() !== '')
        lastFilteredBlocksRef.current = filteredBlock;
    }
    
    const editorRef = useRef<HTMLDivElement>(null);

    const saveToServer = useCallback(async () => {
        if (id && lastFilteredBlocksRef.current.length > 0) {
            try {
                const response = await postBlocks(lastFilteredBlocksRef.current, id);
                alert(response.message)
            } catch (error) {
                console.error('서버 저장 실패:', error);
            }
        }
    }, [id]);

    useEffect(() => {
    return () => {
        saveToServer();
    };
    }, [saveToServer]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (navigator.sendBeacon && id) {
                const blob = new Blob(
                [JSON.stringify({ blocks: lastFilteredBlocksRef.current })], 
                { type: 'application/json' }
                );
                
                navigator.sendBeacon(`/api/blocks/${id}`, blob);
            }
        
            event.preventDefault();
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [id]);


    return (
        <section className="editor_section border border-gray-200 rounded-lg p-6 shadow-sm bg-gray mx-auto h-full overflow-auto" ref={editorRef}>
            <div
                className='editor_title text-[2em] !mb-4 font-sans !px-4'>{title}</div>
            {blocks.map((block, index) => renderBlock(block, index))}
        </section>
    );
};


export default Editor;