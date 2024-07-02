import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const axiosInterceptor = axios.create({
    headers: {
        Accept: 'application/json',
    }
});

createAuthRefreshInterceptor(axiosInterceptor, (_ =>
    axiosInterceptor.get('api/account/refresh').then(_ => {
        return Promise.resolve();
    }))
  );
  
export default axiosInterceptor;

