import {create} from 'zustand';

interface Store {
    isAsideCollapsed: boolean;
    active: () => void;   // 파라미터 없이 상태를 변경하는 함수
    inactive: () => void; // 파라미터 없이 상태를 변경하는 함수
}

export const useAsideStateStore = create<Store>((set) => ({
  isAsideCollapsed: false,
  active: () => set({ isAsideCollapsed: true }),   // isAsideCollapsed를 true로 설정
  inactive: () => set({ isAsideCollapsed: false }), // isAsideCollapsed를 false로 설정
}));