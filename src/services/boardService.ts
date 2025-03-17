/**
 * 1. 게시판 조회
 * 2. 게시글 수정
 * 3. 게시글 제목 수정
 * 4. 게시글 삭제
 * 5. 게시글 조회
 */

import apiConfig from '../config/apiConfig';

const subApiConfig = {
    "search" : '/search',
    "title" : '/title',
}

// 1. 게시판 조회
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

// 2. 게시글 수정
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

// 3. 게시글 제목 수정
export const patchBoardTitle = async (id : string, title : string) => {
    try
    {
        if(!id || !title) return;
        const response = await apiConfig.api.patch(`${apiConfig.apiPaths.board}${subApiConfig.title}`,
            {
                id,
                title
            }
        )
        return response.data;
    }
    catch(err)
    {
        console.error('게시글 제목 수정 오류: ',err)
        throw err;
    }
}

// 4. 게시글 삭제
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
        console.error(err);
        throw err;
    }
}

// 5. 게시글 조회
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
        console.error(err);
        throw err;
    }
}