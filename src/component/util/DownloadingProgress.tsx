import React, { useEffect, useState } from 'react'
import { subscribeToDownloadSession } from '../../services/socketService';

interface DownloadProgressProps {
    downloadId?: string | null;
}

interface DownloadState {
    status: 'idle' | 'analyzing' | 'compressing' | 'downloading' | 'complete' | 'error';
    progress: number;
    message?: string;
    fileCount?: number;
    processedCount?: number;
    totalSizeFormatted?: string;
    processedSizeFormatted?: string;
}

const DownloadingProgress : React.FC<DownloadProgressProps> = ({downloadId}) => {

    const [downloadState, setDownloadState] = useState<DownloadState>({
        status: 'idle',
        progress: 0
    });

    useEffect(() => {
        if (!downloadId) {
            return;
        }

        const isReconnect = true; 
        
        const unsubscribe = subscribeToDownloadSession(downloadId, {
            onAnalyzing: (data) => {
                setDownloadState(prevState => ({
                    ...prevState,
                    status: 'analyzing',
                    message: data.message
                }));
            },
            onStart: (data) => {
                setDownloadState(prevState => ({
                    ...prevState,
                    status: data.status,
                    fileCount: data.fileCount,
                    totalSizeFormatted: data.totalSizeFormatted,
                    progress: 0
                }));
            },
            onProgress: (data) => {
                setDownloadState(prevState => ({
                    ...prevState,
                    status: data.status,
                    progress: data.progress,
                    processedCount: data.processedCount,
                    fileCount: data.fileCount,
                    processedSizeFormatted: data.processedSizeFormatted,
                    totalSizeFormatted: data.totalSizeFormatted
                }));
            },
            onComplete: () => {
                setDownloadState(prevState => ({
                    ...prevState,
                    status: 'complete',
                    progress: 100,
                    message: '다운로드가 완료되었습니다.'
                }));
                
                setTimeout(() => {
                    setDownloadState({
                        status: 'idle',
                        progress: 0
                    });
                }, 3000);
            },
            onError: (data) => {
                setDownloadState(prevState => ({
                    ...prevState,
                    status: 'error',
                    message: data.message || '다운로드 중 오류가 발생했습니다.'
                }));
            }
        },isReconnect);
        
        return () => {
            unsubscribe();
        };
    }, [downloadId]);
        
    if (!downloadId) return null;

    return (
        <div className="fixed bottom-6 right-4 bg-white shadow-lg rounded-lg p-4 w-80 z-50">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800">
                    {downloadState.status === 'analyzing' && '폴더 분석 중...'}
                    {downloadState.status === 'compressing' && '압축 중...'}
                    {downloadState.status === 'downloading' && '다운로드 중...'}
                    {downloadState.status === 'complete' && '다운로드 완료'}
                    {downloadState.status === 'error' && '오류 발생'}
                </h3>
                <span className="text-sm font-semibold text-blue-600">
                    {downloadState.progress}%
                </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full ${
                        downloadState.status === 'error' 
                            ? 'bg-red-500' 
                            : downloadState.status === 'complete' 
                                ? 'bg-green-500' 
                                : 'bg-blue-500'
                    }`}
                    style={{ width: `${downloadState.progress}%` }}
                ></div>
            </div>
            
            {downloadState.message && (
                <p className="text-sm text-gray-600 mt-2">{downloadState.message}</p>
            )}
            
            {downloadState.status === 'compressing' && downloadState.fileCount && (
                <p className="text-xs text-gray-500 mt-2">
                    {downloadState.processedCount || 0}/{downloadState.fileCount} 파일 처리 중
                </p>
            )}
            
            {downloadState.processedSizeFormatted && downloadState.totalSizeFormatted && (
                <p className="text-xs text-gray-500 mt-1">
                    {downloadState.processedSizeFormatted}/{downloadState.totalSizeFormatted}
                </p>
            )}
        </div>
    )
}

export default DownloadingProgress;
