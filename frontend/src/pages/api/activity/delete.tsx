import cookie from 'cookie';
import { NextApiResponse } from 'next';

//Own files.
import axiosClient from '@/axios/axiosClient';
import { DeleteApiRequest } from '@/constants/interfaces';
import { errorParser } from '@/helper_funcs/errorHandling';

const deleteActivity = async (req: DeleteApiRequest, res: NextApiResponse) => {
    if (req.method === 'DELETE') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const accessToken = cookies.access ?? '';

        if(accessToken === '') {
            return res.status(401).json({ error: 'User is unauthorized to make this request' });
        }

        const body = JSON.stringify(req.body);

        try {
            const url = axiosClient.defaults.baseURL;
            const apiRes = await axiosClient.delete(`${url}/api/activities/delete`, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${accessToken}`
                },
                data: body
            });
            
            const data = apiRes.data;
            if(apiRes.status === 200) {
                return res.status(200).json({ success: data });
            }
            else {
                return res.status(apiRes.status).json({ error: data.error });
            }
        } catch(error) {
            const [status, errorMsg] = errorParser(error);
            return res.status(status).json({ error: errorMsg });
        }
    }
    else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` })
    }
}

export default deleteActivity;