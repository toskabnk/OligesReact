import { API_URL } from "../config/constants.js"
import axios from "axios";

const oligesManagementApi = axios.create({
    baseURL: API_URL,
});

oligesManagementApi.interceptors.request.use(config => {
    if(config.bearerToken) {
        let bearer = `Bearer ${config.bearerToken}`
        config.headers.Authorization = bearer
    }
    
    return config;
});

export default oligesManagementApi;