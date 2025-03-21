import apiConfig from '../config/apiConfig';
import { category } from '../types';
import { CategoryTypeEnum } from '../types/enum';

export const postCategory = async (category : category) => {
    try 
    {
        const response = await apiConfig.api.post(`${apiConfig.apiPaths.category}`,category);
        return response.data;
    } catch (error) 
    {
        console.error(`카테고리 등록 오류:`, error);
        throw error;
    }
};

export const getCategory = async (type:CategoryTypeEnum) => {
    try 
    {
        if(!type) return;
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.category}/${type}`);
        return response.data;
    } catch (error) 
    {
        console.error(`카테고리 등록 오류:`, error);
        throw error;
    }
};


export const deleteCategory = async (id : string) => {
    try 
    {
        const response = await apiConfig.api.delete(`${apiConfig.apiPaths.category}/${id}`);
        return response.data;
    } catch (error) 
    {
        console.error(`카테고리 등록 오류:`, error);
        throw error;
    }
};


export const putCategories = async (categories : category[]) => {
    try 
    {
        const response = await apiConfig.api.put(`${apiConfig.apiPaths.category}`,categories);
        return response.data;
    } catch (error) 
    {
        console.error(`카테고리 등록 오류:`, error);
        throw error;
    }
};