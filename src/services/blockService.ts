import apiConfig from '../config/apiConfig';

export const getBlocks = async (id: string, title: string) => {
    try {
      console.log(id);
      const response = await apiConfig.api.get(
        `${apiConfig.apiPaths.blocks}?id=${id}&title=${encodeURIComponent(title)}`
      );
      return response.data;
    } catch (error) {
      console.error(`게시판 조회 오류:`, error);
      throw error;
    }
  };
