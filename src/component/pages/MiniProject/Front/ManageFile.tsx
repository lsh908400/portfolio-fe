/**
 * 2025 03 18 - 이상훈
 * 1. useState - 폴더 / 파일 / 업로드 파일정보 / 상위경로 / 모달상태 / Submit폼
 * 2. useRef - 업로드 인풋
 * 3. useQuery - 유저 / 폴더
 * 4. mutation - 폴더 등록 / 삭제 / 업로드
 * 5. trigger mutation - 폴더 등록 / 삭제 / 폴더 열기 / 닫기 / 업로드 / 업로드파일 관리 / 확장자별 이미지 변환 / 파일 열기
 * 6. modal - 등록 모달 / 업로드 모달 /
 * 7. useEffect - 폴더 정렬 / 초기설정 및 초기화
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import { getUser } from '../../../../services/profileService';
import { deleteFolder, downloadFolderOrFile, getFolder, postFolder, uploadFolder } from '../../../../services/folderService';
import { Files, Folder } from '../../../../types';
import Loading from '../../../util/Loading';
import ErrorMessage from '../../../util/ErrorMessage';
import CommonBtn from '../../../util/CommonBtn';
import CommonModal from '../../../util/CommonModal';
import VariableInfo from '../../../util/VariableInfo';
import { flushSync } from 'react-dom';
import * as pathJoin from 'path-browserify';
import DownloadingProgress from '../../../util/DownloadingProgress';

const ManageFile : React.FC = () => {
    const queryClient = useQueryClient();

    // 1. useState - 폴더 / 파일 / 업로드 파일정보 / 상위경로 / 모달상태 / Submit폼
    const [folderId,setFolderId] = useState<string>();
    const [folder, setFolder] = useState<Folder[]>();
    const [file, setFile] = useState<Files[]>();
    const [folderInfo, setFolderInfo] = useState<{
        name: string;
        fileCount: number;
        files: File[];
    } | null>(null);
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
        maxSizeFormatted : '',
        currentSizeFormatted : ''
    });
    const [contextMenu, setContextMenu] = useState<{
        visible : boolean,
        x : number,
        y : number,
        folderName : string,
    }>({
        visible: false,
        x: 0,
        y: 0,
        folderName: ''
    });
    const [currentDownloadId, setCurrentDownloadId] = useState<string | null>();


    // 2. useRef - 업로드 인풋
    const uploadRef = useRef<HTMLInputElement>(null);


    // 3. useQuery - 유저 / 폴더
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


    // 4. mutation - 폴더 등록 / 삭제 / 업로드
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

    const uploadMutation = useMutation({
        mutationKey : ['upload'],
        mutationFn : async (formData : FormData) => {
            const response = await uploadFolder(formData)
            alert(response.message) 
            return;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
            setFolderInfo({
                name : '',
                fileCount : 0,
                files : []
            })
            setModalState({...modalState, upload : false})
        },
        onError: (err : any) => {
            alert(err.message)
        }
    })

    const downloadMutation = useMutation({
        mutationKey : ['download'],
        mutationFn : async (downLoadForm : any) => {
            const response = await downloadFolderOrFile(downLoadForm)
            if (response?.downloadId) {
                setCurrentDownloadId(response.downloadId);
            }
            return response;
        },
        onSuccess : () => {
        },
        onError : () => {
            alert('다운로드 에러')
        }
    })


    // 5. trigger mutation - 폴더 등록 / 삭제 / 폴더 열기 / 닫기 / 업로드 / 업로드파일 관리 / 확장자별 이미지 변환 / 파일 열기
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
        queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
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
        queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
    }

    const postUploadHandler = () => {
        const files = uploadRef.current?.files;
    
        if (files && files.length > 0) {
            // 폴더 이름 추출 (첫 번째 파일의 경로에서)
            const firstFilePath = files[0].webkitRelativePath;
            const folderName = firstFilePath.split('/')[0];

            let totalSize = 0;
            Array.from(files).forEach(file => {
                totalSize += file.size;
            });

            const formData = new FormData();
            formData.append('folderName', folderName); // 폴더 이름 전달
            formData.append('folderPath', folderId ? folderId : '');
            formData.append('totalSize', totalSize.toString());
            // 각 파일을 FormData에 추가
            Array.from(files).forEach(file => {
                // 폴더 내부 경로를 그대로 유지
                formData.append('files', file, file.webkitRelativePath);
            });

            uploadMutation.mutate(formData);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        
        if (files && files.length > 0) {
            // 첫 번째 파일의 경로에서 폴더 이름 추출
            const firstFilePath = files[0].webkitRelativePath;
            const folderName = firstFilePath.split('/')[0];
            
            setFolderInfo({
                name: folderName,
                fileCount: files.length,
                files: Array.from(files)
            });
        } else {
            setFolderInfo(null);
        }
    };

    const getImageSourceUrl = (ext : string) => {
        switch (ext.toLowerCase()) {
            case 'pdf':
                return `${import.meta.env.VITE_API_URL}/uploads/pdf-icon.png`;
            case 'doc':
            case 'docx':
                return `${import.meta.env.VITE_API_URL}/uploads/word-icon.png`;
            case 'xls':
            case 'xlsx':
                return `${import.meta.env.VITE_API_URL}/uploads/excel-icon.png`;
            case 'ppt':
            case 'pptx':
                return `${import.meta.env.VITE_API_URL}/uploads/powerpoint-icon.png`;
            case 'jpg':
            case 'jpeg':
                return `${import.meta.env.VITE_API_URL}/uploads/jpg-icon.png`;
            case 'png':
                return `${import.meta.env.VITE_API_URL}/uploads/png-icon.png`;
            case 'gif':
                return `${import.meta.env.VITE_API_URL}/uploads/gif-icon.png`;
            case 'bmp':
                return `${import.meta.env.VITE_API_URL}/uploads/bmp-icon.png`;
            case 'zip':
            case 'rar':
                return `${import.meta.env.VITE_API_URL}/uploads/zip-icon.png`;
            case '7z':
                return `${import.meta.env.VITE_API_URL}/uploads/7z-icon.png`;
            case 'txt':
                return `${import.meta.env.VITE_API_URL}/uploads/txt-icon.png`;
        }
    }

    const handleFileOpen = (file: Files) => {
        const BASE_SERVER_PATH = import.meta.env.VITE_API_URL;
        let fileUrl;
        if (BASE_SERVER_PATH.includes("localhost")) {
            const normalizedPath = file.path.replace(/\\/g, '/');
            fileUrl = `${BASE_SERVER_PATH}/folders/${normalizedPath}`;
        } else {
            fileUrl = `${BASE_SERVER_PATH}/folders/${file.path}`;
        }
        window.open(fileUrl.toString(), '_blank');
    };

    const downloadHandler = (fileName : string) => {
        const newDownloadForm = {
            path : postFolderForm.path,
            name : fileName
        }
        downloadMutation.mutate(newDownloadForm)
    }


    // 6. modal - 등록 모달 / 업로드 모달 /
    const postFolderModal = () => {
        flushSync(()=>{
            setPostFolderForm({...postFolderForm, maxSizeBytes : 10485760})
        })
        setModalState({folder : true, upload : false , edit : false})
    }

    const postUploadModal = () => {
        setModalState({folder : false, upload : true , edit : false})
    }

    const rightClickModal = (e: React.MouseEvent, folderName: string) => {
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            folderName: folderName
        });
    }


    // 7. useEffect - 폴더 정렬 / 초기설정 및 초기화
    useEffect(()=>{
        if(!folderData) return;
        const folderArray : Folder[] = [];
        const fileArray : Files[] = [];
        folderData.map((v:any)=>{
            if(v.isDirectory)
            {
                folderArray.push({
                    name : v.name,
                    path : v.path,
                    maxSizeBytes : v.maxSizeBytes,
                    maxSizeFormatted : v.maxSizeFormatted,
                    currentSizeFormatted : v.currentSizeFormatted,
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

    useEffect(() => {
        const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
        document.addEventListener('click', handleClick);
        
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);


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
                <div 
                    onContextMenu={(e) => {
                        e.preventDefault(); // 기본 컨텍스트 메뉴를 방지
                        // 여기에 오른쪽 클릭 시 실행할 로직을 작성
                        rightClickModal(e, v.name);
                    }}
                    onClick={()=>openFolderHandler(v.name)} key={`folder-${v.name}`} className='w-[200px] h-[200px] flex flex-col items-center justify-center cursor-pointer relative'>
                    {modalState.edit && 
                        <div onClick={(e)=>{e.stopPropagation(); deleteFolderHandler(v.name)}} className='border rounded-full w-[20px] h-[20px] flex justify-center items-center absolute top-[10px] left-[145px] hover:bg-gray-400 hover:translate-x-1 hover:text-white '>
                            <i className='fa-solid fa-minus'></i>
                        </div>
                    }
                    <img src={`${import.meta.env.VITE_API_URL}/uploads/folder.png`}></img>
                    <div>{v.name}</div>
                    <div>{v.currentSizeFormatted}</div>
                </div>
                ))}
                {file?.map((f) => (
                <div
                    onContextMenu={(e) => {
                        e.preventDefault(); // 기본 컨텍스트 메뉴를 방지
                        // 여기에 오른쪽 클릭 시 실행할 로직을 작성
                        rightClickModal(e, f.name);
                    }}
                    key={`file-${f.name}`}
                    className='w-[200px] h-[200px] flex flex-col items-center justify-center cursor-pointer relative'
                    onClick={() => handleFileOpen(f)}
                    >
                    {modalState.edit && 
                        <div onClick={(e)=>{e.stopPropagation(); deleteFolderHandler(f.name)}} className='border rounded-full w-[20px] h-[20px] flex justify-center items-center absolute top-[10px] left-[145px] hover:bg-gray-400 hover:translate-x-1 hover:text-white '>
                            <i className='fa-solid fa-minus'></i>
                        </div>
                    }
                    <img src={getImageSourceUrl(f.ext)}></img>
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
            <CommonModal 
                isOpen={modalState.upload}
                onClose={()=>setModalState(prev => ({...prev, upload : false}))}
                title='업로드'
                onConfirm={postUploadHandler}
                className='w-[350px] h-[500px] overflow-auto !p-2'
            >
                <div className="p-4">
                    <div className='flex justify-between items-center !mt-10 text-[1em]'>
                        <label className="w-[80px] font-bold">업로드</label>
                        <i 
                            onClick={() => {uploadRef.current?.click()}} 
                            className="fa-solid fa-upload text-[1.2em] cursor-pointer"
                        ></i>
                        <input
                            ref={uploadRef}
                            type='file'
                            // @ts-ignore
                            webkitdirectory="true"
                            directory="true"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* 선택된 폴더 정보 표시 */}
                    {folderInfo && (
                        <div className="!mt-12 p-4 border rounded">
                            <p>폴더명: <span className="font-medium">{folderInfo.name}</span></p>
                            <p>파일 개수: <span className="font-medium">{folderInfo.fileCount}개</span></p>
                            
                            {/* 선택적으로 파일 목록 표시 */}
                            <div className="mt-2">
                                <p className="font-medium mb-1">파일 목록:</p>
                                <ul className="max-h-40 overflow-y-auto text-sm">
                                    {folderInfo.files.map((file, index) => (
                                        <li key={index} className="truncate">
                                            {file.webkitRelativePath}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </CommonModal>
            {contextMenu.visible && (
                <div 
                    className="absolute bg-white shadow-md rounded py-2" 
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div className="px-4 py-1 hover:bg-gray-100 cursor-pointer" onClick={()=>downloadHandler(contextMenu.folderName)}>
                    다운로드
                    </div>
                </div>
            )}
            {<DownloadingProgress downloadId={currentDownloadId} />}
        </section>
    )
}

export default ManageFile;
