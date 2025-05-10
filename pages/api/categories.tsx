import {NextApiRequest, NextApiResponse} from "next";
import { CmsApi } from '@api/cms';
import { clearServerSession, getServerSession } from "session";
import { IronSession } from "iron-session";
import { SessionData } from "@deckai/client/types/session";
import { Category } from "@deckai/client/types/cms";


// entry point for /api/categories
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { passKey, userId } = request.query;
    const session = await getServerSession(request, response);
    let authUserId: number;
    
    if(!userId){
        if(!session.Auth || !session.Auth.user) {
            //response.status(401).json({ message: "request error: user not specified" });
            //return;
            authUserId = 0;
        }else{
            authUserId = session.Auth.user.id;
        }
    }else{
        authUserId = parseInt(userId?.toString() || '0');
    }

    // Get Works
    if (request.method === 'GET') {
        await handleGet(request, response, session, authUserId);
        return;
    }

    response.status(405).end();
};

async function handleGet(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>, userId: number) {
    let categories: Category[] = [];
    
    categories = await CmsApi.getCategories();
    if (!categories) {
        res.status(404).json({ error: 'Categories not found' });
        return;
    }
    
    res.status(200).json(categories);
    return;
}