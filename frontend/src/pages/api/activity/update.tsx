import type { NextApiResponse } from 'next';
import cookie from 'cookie';

//Own files.
import axiosClient from '@/axios/axiosClient';
import { UpdateActivityApiRequest } from '@/constants/interfaces';
import { errorParser } from '@/helper_funcs/errorHandling';

const updateActivity = async (req: UpdateActivityApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
        const body = JSON.stringify(req.body);

        const cookies = cookie.parse(req.headers.cookie ?? '');
        const accessToken = cookies.access ?? '';

        if(accessToken === '') {
            return res.status(401).json({ error: 'User is unauthorized to make this request' });
        }

        try {
            const url = axiosClient.defaults.baseURL;
            const apiRes = await axiosClient.put(`${url}/api/activities/update`, body, {
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  Authorization: `Bearer ${accessToken}`
                },
            });
            
            const data = apiRes.data;

            if(apiRes.status === 200) {
                return res.status(apiRes.status).json({ success: data });
            } 
            else {
                return res.status(apiRes.status).json({ error: data.error });
            }
        } catch(error) {
            const [status, errorMsg] = errorParser(error);
            return res.status(status).json({ error: errorMsg });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` })
    }
}

export default updateActivity;