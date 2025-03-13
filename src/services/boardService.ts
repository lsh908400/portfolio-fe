import apiConfig from '../config/apiConfig';

const subApiConfig = {
    "search" : '/search'
}

export const getBoards = async (categoryId : (string | null |undefined)) => {
    try 
    {
        if(categoryId===null || undefined) return;
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.board}/${categoryId}`);
        return response.data;
    } catch (error) 
    {
        console.error(`게시판 조회 오류:`, error);
        throw error;
    }
};


export const postBoard = async (categoryId : (string | null |undefined), title : string) => {
    try 
    {
        if(categoryId===null || undefined) return;
        if(title === null || undefined) return;
        const response = await apiConfig.api.post(`${apiConfig.apiPaths.board}`,{
            categoryId,
            title
        });
        return response.data;
    } catch (error) 
    {
        console.error(`게시글 등록 오류:`, error);
        throw error;
    }
};


export const deleteBoards = async (deleteIds : (string|number)[]) => {
    try
    {
        if(!deleteIds) return;
        const response = await apiConfig.api.delete(`${apiConfig.apiPaths.board}`,{
            data : {deleteIds : deleteIds}
        })
        return response.data;
    }
    catch(err)
    {
        console.error(`게시글 삭제 오류:`, err)
    }
}


export const searchBoards = async (option: string, keyword: string, categoryId : string) => {
    try
    {
        if(!keyword)
        {
            keyword = '0';
        }
        if(!option || !categoryId) return;
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.board}${subApiConfig.search}/${option}/${keyword}/${categoryId}`)
        return response.data;
    }
    catch(err)
    {
        console.error(`게시글 삭제 오류:`, err)
    }
}