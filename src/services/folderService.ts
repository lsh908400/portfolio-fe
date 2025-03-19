import apiConfig from "../config/apiConfig";
import { Folder } from "../types";

export const getFolder = async (id : string | undefined, dir : string) => {
    try
    {
        if(!id) return;
        if(!dir) return;
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.folder}?id=${encodeURI(id)}&dir=${encodeURI(dir)}`,)
        return response.data;
    }
    catch(err)
    {
        console.error(err);
        throw err;
    }
}

export const postFolder = async (postFolderForm : Folder) => {
    try
    {
        if(!postFolderForm) return;
        const response = await apiConfig.api.post(`${apiConfig.apiPaths.folder}`,postFolderForm)
        return response.data;
    }
    catch(err)
    {
        console.error(err)
        throw err;
    }
}

export const deleteFolder = async (name : string, path: string) => {
    try
    {
        if(!name) return;
        if(!path) return;
        const id = path
        const response = await apiConfig.api.delete(`${apiConfig.apiPaths.folder}`,{
            data : {
                name,id
            }
        })
        return response.data
    }
    catch(err)
    {
        console.error(err)
        throw err;
    }
}