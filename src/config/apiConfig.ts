// src/config/apiConfig.ts
/**
 * 프론트엔드용 API 설정
 * 환경(개발/프로덕션)에 따라 자동으로 적절한 API 경로를 제공합니다
 */
import axios from "axios";

// Vite에서는 import.meta.env를 사용합니다
// Create-React-App에서는 process.env를 사용합니다
const getEnvVariable = (key: string) => {
  // Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // Create-React-App 또는 다른 환경
  else if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  // 기본값
  return undefined;
};

// 현재 환경 확인
const NODE_ENV = getEnvVariable('NODE_ENV') || getEnvVariable('MODE') || 'development';
const API_URL = getEnvVariable('REACT_APP_API_URL') || getEnvVariable('VITE_API_URL');

// 환경별 기본 설정
const apiConfig = {
  development: {
    baseUrl: API_URL || 'http://localhost:5000/api',
  },
  production: {
    baseUrl: API_URL || 'http://15.164.212.30:5000/api',
  }
};

const isDevelopment = NODE_ENV !== 'production';
const currentEnv = isDevelopment ? 'development' : 'production';

// 현재 환경에 맞는 설정 가져오기
const config = apiConfig[currentEnv];

const api = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 경로 구성
const apiPaths = {
  code: '/api/code',
  user: '/api/user',
  category: '/api/category',
  board: '/api/board',
  blocks: '/api/blocks',
};

export default {
  apiPaths,
  api,
  currentEnv
};