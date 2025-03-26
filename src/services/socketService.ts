// src/services/socketService.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let activeDownloadId: string | null = null;

// 단일 다운로드 세션에 대한 처리된 이벤트 추적
let processedEvents = new Set<string>();

// 소켓 연결 초기화 함수
export const initializeSocket = (): Socket => {
  if (socket) {
    socket.removeAllListeners(); // 모든 리스너 제거
    socket.disconnect();
    socket = null;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  socket = io(apiUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });
  
  // 기본 이벤트 리스너 설정
  socket.on('connect', () => {
    console.log('소켓 서비스: 연결 성공, ID:', socket?.id);
  });
  
  socket.on('connect_error', (error) => {
    console.error('소켓 서비스: 연결 오류', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('소켓 서비스: 연결 종료, 이유:', reason);
  });
  
  return socket;
};

// 다운로드 세션 구독 함수
export const subscribeToDownloadSession = (downloadId: string, callbacks: {
  onAnalyzing?: (data: any) => void;
  onStart?: (data: any) => void;
  onProgress?: (data: any) => void;
  onComplete?: (data: any) => void;
  onError?: (data: any) => void;
  onCanceled?: (data: any) => void;
}) => {
  const socketInstance = initializeSocket();
  activeDownloadId = downloadId;
  
  processedEvents.clear();
  
  const handleEvent = (eventType: string, data: any, callback?: (data: any) => void) => {
    if (data.downloadId !== downloadId) return;
    
    const eventId = `${downloadId}:${eventType}`;
    
    if (processedEvents.has(eventId)) {
      return;
    }
    
    processedEvents.add(eventId);
    
    if (callback) callback(data);
  };
  
  // 모든 이전 이벤트 리스너 제거
  socketInstance.off();
  
  // 새 리스너 등록
  if (callbacks.onAnalyzing) {
    socketInstance.on('download:analyzing', (data) => 
      handleEvent('analyzing', data, callbacks.onAnalyzing));
  }
  
  if (callbacks.onStart) {
    socketInstance.on('download:start', (data) => 
      handleEvent('start', data, callbacks.onStart));
  }
  
  if (callbacks.onProgress) {
    socketInstance.on('download:progress', (data) => 
      handleEvent('progress', data, callbacks.onProgress));
  }
  
  if (callbacks.onComplete) {
    socketInstance.on('download:complete', (data) => 
      handleEvent('complete', data, callbacks.onComplete));
  }
  
  if (callbacks.onError) {
    socketInstance.on('download:error', (data) => 
      handleEvent('error', data, callbacks.onError));
  }
  
  if (callbacks.onCanceled) {
    socketInstance.on('download:canceled', (data) => 
      handleEvent('canceled', data, callbacks.onCanceled));
  }
  
  // 상태 이벤트 리스너
  socketInstance.on('download:status', (data) => {
    if (data.downloadId !== downloadId) return;
    
    // 상태에 따라 적절한 콜백 호출
    if (data.status === 'analyzing' && callbacks.onAnalyzing) {
      handleEvent('analyzing-status', data, callbacks.onAnalyzing);
    } else if ((data.status === 'compressing' || data.status === 'downloading') && callbacks.onProgress) {
      handleEvent('progress-status', data, callbacks.onProgress);
    } else if (data.status === 'complete' && callbacks.onComplete) {
      handleEvent('complete-status', data, callbacks.onComplete);
    } else if (data.status === 'error' && callbacks.onError) {
      handleEvent('error-status', data, callbacks.onError);
    }
  });
  
  // 서버에 다운로드 세션 참여 요청 
  socketInstance.emit('download:start', downloadId);
  
  // 서버에 현재 다운로드 상태 요청
  socketInstance.emit('download:request-status', downloadId);
  
  return () => {
    console.log(`소켓 서비스: 다운로드 세션 구독 해제 ID: ${downloadId}`);
    
    // 이벤트 리스너 제거
    socketInstance.off();
    
    // 이벤트 처리 상태 정리
    processedEvents.clear();
    activeDownloadId = null;
  };
};

// 소켓 연결 해제
export const disconnectSocket = () => {
  if (socket) {
    console.log('소켓 서비스: 연결 종료');
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    activeDownloadId = null;
    processedEvents.clear();
  }
};