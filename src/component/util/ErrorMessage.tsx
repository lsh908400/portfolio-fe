/**
 * ErrorMessage 컴포넌트
 * 애플리케이션 전체에서 재사용 가능한 에러 메시지 표시 컴포넌트
 * 
 * Props:
 * - message: 표시할 에러 메시지
 * - onRetry: 재시도 버튼 클릭 시 실행할 함수 (선택적)
 * - variant: 에러 메시지의 스타일 변형 ('inline', 'box', 'toast' 중 하나, 기본값: 'inline')
 * - icon: 사용자 정의 아이콘 (선택적, 기본값: 경고 아이콘)
 */

import React from 'react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    variant?: 'inline' | 'box' | 'toast';
    icon?: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    variant = 'inline',
    icon,
}) => {
    // 기본 경고 아이콘
    const defaultIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
    );

    // 인라인 스타일 (간단한 인라인 에러 메시지)
    if (variant === 'inline') {
        return (
        <div className="flex justify-center items-center text-red-500 py-2">
            <span className="mr-2">{icon || defaultIcon}</span>
            <span>{message}</span>
            {onRetry && (
            <button 
                onClick={onRetry}
                className="ml-2 text-blue-500 hover:text-blue-700 underline text-sm"
            >
                다시 시도
            </button>
            )}
        </div>
        );
    }

    // 박스 스타일 (더 눈에 띄는 에러 메시지 박스)
    if (variant === 'box') {
        return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
                {icon || defaultIcon}
            </div>
            <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                {message}
                </h3>
            </div>
            </div>
            {onRetry && (
            <div className="mt-3">
                <button
                onClick={onRetry}
                className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                다시 시도
                </button>
            </div>
            )}
        </div>
        );
    }

    // 토스트 스타일 (팝업 형태의 알림)
    return (
        <div className="fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-fade-in-down">
            <div>
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                    {icon || defaultIcon}
                </div>
                <div className="ml-3 text-sm font-normal text-gray-800 dark:text-gray-200">
                    {message}
                </div>
                {onRetry && (
                <button
                onClick={onRetry}
                className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8"
                >
                <span className="sr-only">다시 시도</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
                </svg>
                </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;