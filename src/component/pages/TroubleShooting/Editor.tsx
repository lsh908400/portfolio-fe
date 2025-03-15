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
    const {blocks,renderBlock,addBlock} = useEditorBlocks({
        initialData,
        onChange,
        onSave: (blocks)=>{blockSaveHandler(blocks)},
        autoSaveIntervalMs : 600000,
    });
    const lastFilteredBlocksRef = useRef<BlockData[]>([]);

    const blockSaveHandler = async (blocks : BlockData[]) => {
        const filteredBlock = blocks.filter(block => {
            if (block.data.text?.trim() !== '') {
                return true;
            }
            if (block.type === 'img' && block.data.url) {
                return true;
            }
            return false;
        });
        console.log(filteredBlock)
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
                className='editor_title text-[2em] !mb-10 font-sans !px-8'>{title}</div>
                {blocks.map((block, index) => renderBlock(block, index))}
                <div className="flex justify-start mt-4">
                    <button 
                        onClick={() => addBlock(blocks.length - 1)} 
                        className="flex items-center gap-2 px-2 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                    >
                        <i className="fa-solid fa-plus opacity-40"></i>
                    </button>
                </div>
        </section>
    );
};


export default Editor;