import cookie from 'cookie';
import { NextApiResponse } from 'next';

//Own files.
import axiosClient from '@/axios/axiosClient';
import { errorParser } from '@/helper_funcs/errorHandling';
import { CookiesApiRequest } from '@/constants/interfaces';

const getReceivedFriendRequests = async (req: CookiesApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const accessToken = cookies.access ?? '';

        if(accessToken === '') {
            return res.status(401).json({ error: 'User is unauthorized to make this request' });
        }

        try {
            const url = axiosClient.defaults.baseURL;
            const apiRes = await axiosClient.get(`${url}/api/friend_request/getreceived`, {
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  Authorization: `Bearer ${accessToken}`
                },
            });

            const data = apiRes.data;

            if(apiRes.status === 200) {
                return res.status(200).json(data);
            }
            else {
                return res.status(apiRes.status).json(data);
            }
        } catch (error) {
            const [status, errorMsg] = errorParser(error);
            return res.status(status).json({ error: errorMsg });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` })
    }
}

export default getReceivedFriendRequests;