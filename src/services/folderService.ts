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

export const uploadFolder = async (formData : FormData) => {
    try
    {
        const response =await apiConfig.api.post(`${apiConfig.apiPaths.folder}/upload`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log("========")
        return response.data;
    }
    catch (err: any) { // err를 any로 타입 지정
        // 서버에서 보낸 에러 메시지를 가져오기
        console.log("======")
        console.log(err)
        if (err.response && err.response.data) {
            throw err.response.data; // 서버에서 반환한 에러 객체를 그대로 throw
        }
        console.error('파일 업로드 중 오류:', err);
        throw err;
    }
}