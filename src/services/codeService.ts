import apiConfig from '../config/apiConfig';

export const getPageCode = async (pageName: string) => {
    try 
    {
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.code}/${pageName}`);
        return response.data;
    } catch (error) 
    {
        console.error(`${pageName} 페이지 코드 가져오기 오류:`, error);
        throw error;
    }
};

export const putPageCode = async (pageName: string) => {
  try {
    const response = await apiConfig.api.put(`${apiConfig.apiPaths.code}/${pageName}`);
    return response.data;
  } catch (error) {
    console.error('소스 코드 가져오기 오류:', error);
    throw error;
  }
};