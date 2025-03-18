import apiConfig from "../config/apiConfig";
import { Snippet } from "../types";
import { SnipetParams, SnipetResponse } from "../types/serach";

export const getSnippets = async ({ cursor, limit, searchTerm, tags }: SnipetParams): Promise<SnipetResponse> => {
    try 
    {
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.snippet}`, {
            params: {
            cursor,
            limit,
            searchTerm,
            tags
            }
        });
        return response.data;
        
    } 
    catch(err) 
    {
        console.error(err);
        throw err;
    }
};

export const postSnippet = async (formData : Omit<Snippet, 'id' | 'createdAt'>) => {
    try
    {
        const response = await apiConfig.api.post(`${apiConfig.apiPaths.snippet}`,formData)
        return response.data
    }
    catch(err)
    {
        console.error(err)
        throw err;
    }
}

export const putSnippet = async  (formData : Snippet) => {
    try
    {
        const response = await apiConfig.api.put(`${apiConfig.apiPaths.snippet}`,formData)
        return response.data;
    }
    catch(err)
    {
        console.error(err)
        throw err;
    }
}

export const deleteSnippet = async (id: string) => {
    try
    {
        const response = await apiConfig.api.delete(`${apiConfig.apiPaths.snippet}/${id}`)
        return response.data
    }
    catch(err)
    {
        console.error(err)
        throw err;
    }
}
