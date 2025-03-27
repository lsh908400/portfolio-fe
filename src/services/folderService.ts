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
        const response = await apiConfig.api.post(`${apiConfig.apiPaths.folder}/upload`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data;
    }
    catch (err: any) { 
        if (err.response && err.response.data) {
            throw err.response.data; 
        }
        console.error('파일 업로드 중 오류:', err);
        throw err;
    }
}

export const initializeDownload = async (downloadForm: any) => {
    try {
        if (!downloadForm.path) return;
        if (!downloadForm.name) return;

        // 다운로드 초기화 API 호출 (새로 만들어야 함)
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.folder}/initialize-download`, {
        params: {
            filePath: downloadForm.path,
            fileName: downloadForm.name
        }
        });

        return {
        downloadId: response.data.downloadId,
        downloadUrl: response.data.downloadUrl,
        fileName: response.data.fileName,
        isFile: response.data.isFile
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
};
// 2. 실제 다운로드 시작 함수
export const startDownload = async (downloadUrl: string, fileName: string) => {
    try {
        const response = await apiConfig.api.get(downloadUrl, {
        responseType: 'blob'
        });

        // blob의 type이 application/zip이면 파일 이름에 .zip 확장자가 없으면 추가
        let finalFileName = fileName;
        if (response.data.type === 'application/zip' && !finalFileName.endsWith('.zip')) {
        finalFileName += '.zip';
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', finalFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return {
        data: response.data
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
};