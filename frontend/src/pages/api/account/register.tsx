import type { NextApiResponse } from "next";

//Own files.
import axiosClient from "@/axios/axiosClient";
import { RegisterUserApiRequest } from "@/constants/interfaces";
import { errorParser } from "@/helper_funcs/errorHandling";

const registerUser = async (req: RegisterUserApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const body = JSON.stringify(req.body);

        try {
            const url = axiosClient.defaults.baseURL;
            const apiRes = await axiosClient.post(`${url}/api/account/register`, body, {
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                },
            });
            
            const data = apiRes.data;

            if(apiRes.status === 201) {
                return res.status(201).json(data);
            } 
            else {
                return res.status(apiRes.status).json({ error: data.error });
            }
        } catch(error) {
            const [status, errorMsg] = errorParser(error);
            return res.status(status).json({ error: errorMsg });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` })
    }
}

export default registerUser;