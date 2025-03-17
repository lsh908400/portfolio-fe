import apiConfig from "../config/apiConfig";

const subApiConfig = {
    "purpose" : "/purpose"
}

export const getTrees = async (type: string) => {
    try {
        if(!type) return;
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.tree}/${type}`);
        return response.data;
    } catch (error) {
        console.error(`게시판 조회 오류:`, error);
        throw error;
    }
};

export const getPurpose = async (type: string) => {
    try {
        if(!type) return;
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.tree}${subApiConfig.purpose}/${type}`);
        return response.data;
    } catch (error) {
        console.error(`게시판 조회 오류:`, error);
        throw error;
    }
}
