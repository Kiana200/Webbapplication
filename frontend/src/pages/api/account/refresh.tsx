import cookie from 'cookie';
import { NextApiResponse } from 'next';

//Own files.
import axiosClient from '@/axios/axiosClient';
import { CookiesApiRequest } from '@/constants/interfaces';
import { errorParser } from '@/helper_funcs/errorHandling';

const refreshAccessToken = async (req: CookiesApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const refreshToken = cookies.refresh ?? '';

        if(refreshToken === '') {
            return res.status(401).json({ error: 'User is unauthorized to make this request' });
        }

        const body = JSON.stringify({
            refresh: refreshToken
        })

        try {
            const url = axiosClient.defaults.baseURL;
            const apiRes = await axiosClient.post(`${url}/api/token/refresh/`, body, {
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                },
            });
            
            const data = apiRes.data;

            if(apiRes.status === 200) {
                res.setHeader('Set-Cookie', [
                    cookie.serialize(
                        'access', data.access, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            maxAge: 60 * 5,
                            sameSite: 'strict', // Mitigates CSRF.
                            path: '/api/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', data.refresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            maxAge: 60 * 60 * 24,
                            sameSite: 'strict', // Mitigates CSRF.
                            path: '/api/'
                        }
                    )
                ]);

                return res.status(apiRes.status).json({ success: 'Successfully refreshed access token' });
            }
            else {
                return res.status(apiRes.status).json({ error: 'Failed refresh request' });
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

export default refreshAccessToken;