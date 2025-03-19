/**
 * 2025 03 18 - 이상훈
 * 1. useState - 폴더 / 파일 / 상위경로 / 모달상태 / Submit폼
 * 2. useQuery - 유저 / 폴더
 * 3. mutation - 폴더 등록 / 삭제 
 * 4. trigger mutation - 폴더 등록 / 삭제 / 폴더 열기 / 닫기
 * 5. modal - 등록 모달 / 업로드 모달 /
 * 6. useEffect - 폴더 정렬 / 초기설정 및 초기화
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getUser } from '../../../../services/profileService';
import { deleteFolder, getFolder, postFolder } from '../../../../services/folderService';
import { File, Folder } from '../../../../types';
import Loading from '../../../util/Loading';
import ErrorMessage from '../../../util/ErrorMessage';
import CommonBtn from '../../../util/CommonBtn';
import CommonModal from '../../../util/CommonModal';
import VariableInfo from '../../../util/VariableInfo';
import { flushSync } from 'react-dom';
import * as pathJoin from 'path-browserify';

const ManageFile : React.FC = () => {
    const queryClient = useQueryClient();

    // 1. useState - 폴더 / 파일 / 상위경로 / 모달상태 / Submit폼
    const [folderId,setFolderId] = useState<string>();
    const [folder, setFolder] = useState<Folder[]>();
    const [file, setFile] = useState<File[]>();
    const [superDir, setSuperDir] = useState<{
        isSuper : boolean,
        dir : string
    }>();
    const [modalState, setModalState] = useState<{
        folder : boolean,
        upload : boolean,
        edit : boolean,
    }>({folder : false, upload : false, edit : false});
    const [postFolderForm,setPostFolderForm] = useState<Folder>({
        name : '',
        path : '',
        maxSizeBytes : 0,
        maxSizeFormatted : ''
    });


    // 2. useQuery - 유저 / 폴더
    const { data: userData, isLoading: isUserLoading, isError: isUserError,} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await getUser();
            return response.data;
        },
        enabled : true
    })

    const {data : folderData, isLoading : isFolderLoading, isError : isFolderError, refetch : refetchFolder} = useQuery({
        queryKey: ['folder',folderId],
        queryFn: async () => {
            const response = await getFolder(folderId,postFolderForm.path);
            return response.data
        },
        enabled : !!folderId
    })


    // 3. mutation - 폴더 등록 / 삭제 
    const postFolderMutation = useMutation({
        mutationKey : ['folder',folderId],
        mutationFn: async () => {
            const response = await postFolder(postFolderForm);
            alert(response.message)
            return;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
            setPostFolderForm({...postFolderForm,
                name : '',
                maxSizeBytes : 0,
                maxSizeFormatted : ''
            })
            setModalState({...modalState,folder : false})
        },
    })

    const deleteFolderMutation = useMutation({
        mutationKey : ['folder',folderId],
        mutationFn: async (name : string) => {
            const response = await deleteFolder(name,postFolderForm.path);
            alert(response.message)
            return;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
            setModalState({...modalState,edit : false})
        }
    })


    // 4. trigger mutation - 폴더 등록 / 삭제 / 폴더 열기 / 닫기
    const postFolderHandler = () => {
        postFolderMutation.mutate();
    }

    const deleteFolderHandler = (name : string) => {
        deleteFolderMutation.mutate(name)
    }

    const openFolderHandler = (name : string) => {
        
        flushSync(()=>{
            if(folderId)
            {
                setSuperDir({
                    isSuper : true,
                    dir : folderId
                })
                const newId = pathJoin.join(folderId, name);
                setFolderId(newId)
            }
        })
        const newPath = pathJoin.join(postFolderForm.path, name);
        setPostFolderForm({...postFolderForm, path : newPath});
    }

    const closeFolder = () => {
        setFolderId(superDir?.dir)
        setPostFolderForm({...postFolderForm, path : superDir?.dir ? superDir.dir : ''})
        if(!superDir?.dir.includes("/"))
        {
            setSuperDir({
                isSuper : false,
                dir: ''
            })
        }
        else 
        {
            const lastSlashIndex = superDir.dir.lastIndexOf("/");
    
            if (lastSlashIndex === 0) {
                setSuperDir({
                    isSuper: true,
                    dir: '/'
                });
            } else {
                const parentDir = superDir.dir.substring(0, lastSlashIndex);
                
                setSuperDir({
                    isSuper: true,
                    dir: parentDir
                });
            }
        }
    }


    // 5. modal - 등록 모달 / 업로드 모달 /
    const postFolderModal = () => {
        flushSync(()=>{
            setPostFolderForm({...postFolderForm, maxSizeBytes : 10485760})
        })
        setModalState({folder : true, upload : false , edit : false})
    }

    const postUploadModal = () => {
        setModalState({folder : false, upload : true , edit : false})
    }


    // 6. useEffect - 폴더 정렬 / 초기설정 및 초기화
    useEffect(()=>{
        if(!folderData) return;
        const folderArray : Folder[] = [];
        const fileArray : File[] = [];
        folderData.map((v:any)=>{
            if(v.isDirectory)
            {
                folderArray.push({
                    name : v.name,
                    path : v.path,
                    maxSizeBytes : v.maxSizeBytes,
                    maxSizeFormatted : v.maxSizeFormatted,
                })
            }
            else
            {
                if(v.name === '.folder-config.json') return;
                fileArray.push({
                    name : v.name,
                    path : v.path,
                    ext : v.name.split('.')[1]
                })
            }
        })

        setFolder(folderArray)
        setFile(fileArray)
    },[folderData])

    useEffect(()=>{
        if(!userData) return;
        setFolderId(userData._id)
        setPostFolderForm({...postFolderForm, path : userData._id})
        return () => {
            queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    },[userData])




    return (
        <section id='manage_file' className='font-sans !p-6'>
            <div className='text-[1.6em] border-b !mb-4'>
                {isUserLoading ? (<Loading />)
                : isUserError ? (<ErrorMessage message='유저 로드 중 에러' variant='inline' />)
                : userData ? (
                <div className='flex justify-between'>
                    <div className='flex gap-4 items-center'>
                        {superDir?.isSuper &&
                            <i onClick={closeFolder} className='fa-solid fa-arrow-left opacity-60 cursor-pointer hover:-translate-x-1 hover:opacity-80'></i>
                        }
                        <p>{userData.name}님의 폴더</p>
                        <i onClick={()=>setModalState({folder : false, upload : false , edit : !modalState.edit})} className='fa-solid fa-gear opacity-60 cursor-pointer hover:opacity-80'></i>
                    </div>
                    <div className='flex gap-2 items-center !pb-4'>
                        <CommonBtn className='w-[100px] text-[0.8em] h-[30px]' buttonName='폴더 생성' onClick={postFolderModal}/>
                        <CommonBtn className='w-[100px] text-[0.8em] h-[30px]' buttonName='업로드' onClick={postUploadModal}/>
                    </div>
                </div>)
                : '유저 정보가 없습니다.'
                }
            </div>
            {isFolderLoading ? (<Loading/>) 
            : isFolderError ? (<ErrorMessage message='폴더 로드 중 에러' variant='inline' onRetry={refetchFolder}/>)
            : folderData?.length > 0 ? (
            <div className='flex flex-wrap gap-4'>
                {folder?.map((v) => (
                <div onClick={()=>openFolderHandler(v.name)} key={`folder-${v.name}`} className='w-[200px] h-[200px] flex flex-col items-center justify-center cursor-pointer relative'>
                    {modalState.edit && 
                        <div onClick={(e)=>{e.stopPropagation(); deleteFolderHandler(v.name)}} className='border rounded-full w-[20px] h-[20px] flex justify-center items-center absolute top-[10px] left-[145px] hover:bg-gray-400 hover:translate-x-1 hover:text-white '>
                            <i className='fa-solid fa-minus'></i>
                        </div>
                    }
                    <img src={`${import.meta.env.VITE_API_URL}/uploads/folder.png`}></img>
                    <div>{v.name}</div>
                    <div>{v.maxSizeFormatted}</div>
                </div>
                ))}
                {file?.map((f) => (
                <div key={`file-${f.name}`} className='w-[200px] h-[200px] flex flex-col items-center justify-center cursor-pointer'>
                    <img src='/public/assets/folder.png'></img>
                    <div>{f.name}</div>
                </div>
                ))}
            </div>
            ) : (
                <div>데이터가 없습니다.</div>
            )}
            <CommonModal 
                isOpen={modalState.folder}
                onClose={()=>setModalState(prev => ({...prev, folder : false}))}
                title='폴더 생성'
                onConfirm={postFolderHandler}
                className='w-[500px] h-[300px]'
            >
                <VariableInfo
                    layout="vertical"
                    className="font-bold text-[1em] !mt-[2em]"
                    fields={[
                    {
                        type: 'input',
                        label: '폴더이름',
                        onChange: (e)=>setPostFolderForm({...postFolderForm,name : e.target.value}),
                        value: postFolderForm.name,
                        className: 'board_title flex justify-between !mb-[30px] w-full h-[30px]',
                    },
                    {
                        type: 'select',
                        label: '용량',
                        onChange: (e)=>setPostFolderForm({...postFolderForm,maxSizeBytes : Number(e.target.value)}),
                        value: postFolderForm.maxSizeBytes,
                        className: 'board_title flex justify-between !mb-[30px] w-full h-[30px]',
                        options : [
                            {value : '10485760', label : '10MB'},
                            {value : '20971520', label : '20MB'},
                            {value : '31457280', label : '30MB'}
                        ]
                    },
                ]}
                />
            </CommonModal>
        </section>
    )
}

export default ManageFile;
