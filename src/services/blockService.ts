import apiConfig from '../config/apiConfig';
import { BlockData } from '../types';

export const getBlocks = async (id: string) => {
    try {
        const response = await apiConfig.api.get(
          `${apiConfig.apiPaths.blocks}?id=${id}`
        );
        return response.data;
    } catch (error) {
        console.error(`게시판 조회 오류:`, error);
        throw error;
    }
};


export const postBlocks = async (data:BlockData[],id: string | undefined) => {
  try {
      if(!id) return;
      const response = await apiConfig.api.post(`${apiConfig.apiPaths.blocks}`,{
        data,
        id
      });
      return response.data;
  } catch (error) {
      console.error(`게시판 조회 오류:`, error);
      throw error;
  }
};