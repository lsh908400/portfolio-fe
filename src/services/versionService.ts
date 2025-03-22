import apiConfig from "../config/apiConfig";

export const getVersions = async () => {
    try
    {
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.version}`)
        return response.data
    }
    catch(err)
    {
        console.error(err)
        throw err;
    }
}