import axios, { AxiosInstance } from 'axios';

//Own files.
import { API_URL, PROD_URL } from '@/config';

const currentEnv  = process.env.NODE_ENV;
let axiosClient: AxiosInstance;

if(currentEnv == 'development') {
    axiosClient = axios.create({
        baseURL: API_URL,
        headers: {
            Accept: 'application/json',
        }
    });
}
else {
    axiosClient = axios.create({
        baseURL: PROD_URL,
        headers: {
            Accept: 'application/json',
        }
    });
}

  
export default axiosClient;
