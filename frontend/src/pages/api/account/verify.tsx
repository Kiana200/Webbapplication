import cookie from 'cookie';
import { NextApiResponse } from 'next';

//Own files.
import axiosClient from '@/axios/axiosClient';
import { CookiesApiRequest } from '@/constants/interfaces';
import { errorParser } from '@/helper_funcs/errorHandling';

const verifyUser = async (req: CookiesApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const accessToken = cookies.access ?? '';

        if(accessToken === '') {
            return res.status(401).json({ error: 'User is unauthorized to make this request' });
        }

        const body = JSON.stringify({
            token: accessToken
        })

        try {
            const url = axiosClient.defaults.baseURL;
            const apiRes = await axiosClient.post(`${url}/api/token/verify/`, body, {
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                },
            });
            
            const data = apiRes.data;
            if(apiRes.status === 200) {
                return res.status(200).json(data);
            }
            else {
                return res.status(apiRes.status).json(data);
            }
        } catch(error) {
            const [status, errorMsg] = errorParser(error);
            return res.status(status).json({ error: errorMsg });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` })
    }
}

export default verifyUser;