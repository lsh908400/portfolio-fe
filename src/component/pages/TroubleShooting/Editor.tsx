/**
 * 2025 03 11 - 이상훈
 * 1. useRef - 최신저장븕럭 / 에디터 돔 Ref / 최신 타이틀 Ref
 * 2. EditorHooks - 블럭 기능 훅
 * 3. submitDate - 블록 저장 / 전송 / title 변경 및 저장
 * 4. useEffect - 언마운트시 / 브라우저 종료시
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { useEditorBlocks } from '../../../hooks/useEditorBlocks';
import { BlockData } from '../../../types';
import { postBlocks } from '../../../services/blockService';
import { patchBoardTitle } from '../../../services/boardService';


interface EditorProps {
    initialData?: BlockData[];
    onChange?: (blocks: BlockData[]) => void;
    id : string | undefined;
    editorInfo: any;
    setEditorInfo : any;
}

const Editor: React.FC<EditorProps> = ({ initialData, onChange ,id ,setEditorInfo,editorInfo}) => {

    // 1. useRef - 최신저장븕럭 / 에디터 돔 Ref / 최신 타이틀 Ref
    const lastFilteredBlocksRef = useRef<BlockData[]>([]);
    const editorRef = useRef<HTMLDivElement>(null);
    const latestTitleRef = useRef(editorInfo.title);


    // 2. EditorHooks - 블럭 기능 훅
    const {blocks,renderBlock,addBlock} = useEditorBlocks({
        initialData,
        onChange,
        onSave: (blocks)=>{blockSaveHandler(blocks)},
        autoSaveIntervalMs : 600000,
    });
    

    // 3. submitDate - 블록 저장 / 전송 / title 변경 및 저장
    const blockSaveHandler = async (blocks : BlockData[]) => {
        lastFilteredBlocksRef.current = blocks;
    }

    const submitData = useCallback(async () => {
        const response = await patchBoardTitle(editorInfo.id, latestTitleRef.current).catch(err => {
            console.error(err)
        });
        if(!response.success) return;
    }, [editorInfo.id, editorInfo.title]);
    
    const saveToServer = useCallback(async () => {
        if (id && lastFilteredBlocksRef.current.length > 0) {
            try {
                const response = await postBlocks(lastFilteredBlocksRef.current, id);
                if(!response.success) return;
            } catch (error) {
                console.error('서버 저장 실패:', error);
            }
        }
    }, [id]);

    const titleKeyDownHandler = useCallback((e: React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            submitData();
        }
    }, [submitData]);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        latestTitleRef.current = e.target.value;
        setEditorInfo((prev:any) => ({
            ...prev,
            title: newTitle
        }));
    }, [setEditorInfo]);

    
    // 4. useEffect - 언마운트시 / 브라우저 종료시
    useEffect(() => {
        return () => {
            saveToServer();
            submitData();
        };
    }, [saveToServer, submitData, editorInfo.title]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (navigator.sendBeacon && id) {
                const blocksBlob = new Blob(
                    [JSON.stringify({ blocks: lastFilteredBlocksRef.current })],
                    { type: 'application/json' }
                );
                navigator.sendBeacon(`/api/blocks/${id}`, blocksBlob);
                
                if (id && editorInfo?.title) {
                    const titleBlob = new Blob(
                        [JSON.stringify({ id: editorInfo.id, title: editorInfo.title })],
                        { type: 'application/json' }
                    );
                    navigator.sendBeacon(`/api/board/title`, titleBlob);
                }
            }
            
            event.preventDefault();
            event.returnValue = ''; 
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [id, editorInfo?.title]);


    return (
        <section className="editor_section border border-gray-200 rounded-lg p-6 shadow-sm bg-gray mx-auto h-full overflow-y-auto !pb-40" ref={editorRef}>
            <div
                className='editor_title text-[2em] !mb-10 font-sans !px-8'>
                    <input 
                    className='w-full'
                    onKeyDown={(e)=>titleKeyDownHandler(e)}
                    onChange={handleTitleChange} 
                    value={editorInfo.title}></input>
                </div>
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