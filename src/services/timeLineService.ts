import apiConfig from "../config/apiConfig"
import { TimelineEvent } from "../types";


export const getTimelines = async () => {
    try
    {
        const response = await apiConfig.api.get(`${apiConfig.apiPaths.timeline}`);
        return response.data;
    }
    catch(err)
    {
        console.error(err);
        throw err;
    }
}

export const postTimeline = async (timeline: Omit<TimelineEvent, 'id'>) => {
    try 
    {
        if(!timeline) return;
        const response = await apiConfig.api.post(`${apiConfig.apiPaths.timeline}`, timeline);
        return response.data;
    } 
    catch(err) 
    {
        console.error(err);
        throw err;
    }
}

export const deleteTimeline = async (id : string) => {
    try
    {
        if(!id) return;
        const response = await apiConfig.api.delete(`${apiConfig.apiPaths.timeline}/${id}`);
        return response.data;
    }
    catch(err)
    {
        console.error(err);
        throw err;
    }
}