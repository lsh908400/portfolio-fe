import apiConfig from '../config/apiConfig';

const subApiConfig = {
    "introduction" : "/introduction",
    "motivation" : "/introduction/motivation",
    "growth" : "/introduction/growth",
    "adventage" : "/introduction/adventage",
    "goals" : "/introduction/goals",
}

export const getUser = async () => {
    try 
    {
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.user}`);
        return response.data;
    } catch (error) 
    {
        console.error(`User 정보 페이지 코드 가져오기 오류:`, error);
        throw error;
    }
};

export const getIntroduction = async () => {
    try 
    {
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.user}${subApiConfig.introduction}`);
        return response.data;
    } catch (error) 
    {
        console.error(error);
        throw error;
    }
};

export const putMotivation = async (motivation : string) => {
    try
    {
        const resp = await apiConfig.api.put(`${apiConfig.apiPaths.user}${subApiConfig.motivation}`,{motivation : motivation})
        return resp.data;
    }
    catch (err)
    {
        console.error(err)
        throw err;
    }
};

export const putGrowth = async (growth : string) => {
    try
    {
        const resp = await apiConfig.api.put(`${apiConfig.apiPaths.user}${subApiConfig.growth}`,{growth : growth})
        return resp.data;
    }
    catch (err)
    {
        console.error(err)
        throw err;
    }
};

export const putAdventage = async (adventage : string) => {
    try
    {
        const resp = await apiConfig.api.put(`${apiConfig.apiPaths.user}${subApiConfig.adventage}`,{adventage : adventage})
        return resp.data;
    }
    catch (err)
    {
        console.error(err)
        throw err;
    }
};

export const putGoals = async (goals : string) => {
    try
    {
        const resp = await apiConfig.api.put(`${apiConfig.apiPaths.user}${subApiConfig.goals}`,{goals : goals})
        return resp.data;
    }
    catch (err)
    {
        console.error(err)
        throw err;
    }
};

