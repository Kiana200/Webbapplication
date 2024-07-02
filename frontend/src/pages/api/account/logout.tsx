import cookie from 'cookie';
import type { NextApiResponse } from "next";

// Own files.
import { LogOutUserApiRequest } from '@/constants/interfaces';

const logoutUser = async (req: LogOutUserApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        res.setHeader('Set-Cookie', [
            cookie.serialize(
                'access', '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    expires: new Date(0), // Set to Jan 1 1970.
                    sameSite: 'strict', // Mitigates CSRF.
                    path: '/api/'
                }
            ),
            cookie.serialize(
                'refresh', '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    expires: new Date(0), // Set to Jan 1 1970.
                    sameSite: 'strict', // Mitigates CSRF.
                    path: '/api/'
                }
            )
        ]);

        return res.status(200).json({ success: 'Successfully logged out' });
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` })
    }
}

export default logoutUser;