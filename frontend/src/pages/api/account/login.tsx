import cookie from 'cookie';
import { NextApiResponse } from 'next';

//Own files.
import axiosClient from '@/axios/axiosClient';
import { LoginUserApiRequest } from '@/constants/interfaces';
import { errorParser } from '@/helper_funcs/errorHandling';

const loginAccount = async (req: LoginUserApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const body = JSON.stringify(req.body);

        try {
            const url = axiosClient.defaults.baseURL;
            const apiRes = await axiosClient.post(`${url}/api/token/`, body, {
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
                            sameSite: 'strict', // Mitigates CSRF
                            path: '/api/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', data.refresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            maxAge: 60 * 60 * 24,
                            sameSite: 'strict', // Mitigates CSRF
                            path: '/api/'
                        }
                    )
                ]);

                return res.status(apiRes.status).json({ success: 'Logged in successfully' });
            } 
            else {
                return res.status(apiRes.status).json({ error: 'Authentication failed' });
            }
        } catch(error) {
            const [status, errorMsg] = errorParser(error);
            return res.status(status).json({ error: errorMsg });
        }
    }
    else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` })
    }
}

export default loginAccount;