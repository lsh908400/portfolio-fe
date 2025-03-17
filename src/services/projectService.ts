import apiConfig from "../config/apiConfig"

export const getProjects = async (type:number) => {
    try
    {
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.project}/${type}`)
        return response.data
    }
    catch(err)
    {
        console.error(err);
        throw err;
    }

}