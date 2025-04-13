import {NextApiRequest, NextApiResponse} from "next";
import { CmsApi } from "@api/cms";
import { clearServerSession, getServerSession } from "session";
import { IronSession } from "iron-session";
import { defaultSession, SessionData } from "@deckai/client/types/session";

// entry point for /api/user/highlights
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const session = await getServerSession(request, response);

    // Get Session
    if (request.method === 'GET') {
        await handleGet(request, response, session);
        return;
    }
    // Sign In
    if (request.method === 'POST') {
        await handlePost(request, response, session);
        return
    }
    // Register
    if(request.method === 'PUT') {
        await handlePut(request, response, session);
        return;
    }
    // Sign Out
    if(request.method === 'DELETE') {
        await handleDelete(request, response, session);
        return;
    }

    if(request.method === 'PATCH') {
        await handlePatch(request, response, session);
        return;
    }
};

async function handleGet(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
    if(session) {
        res.status(200).json(session);
        return;
    }
    else {
        console.log("Not Logged In");
        res.status(400).json({ message: "Not Logged In" });
        return;
    }
}
async function handlePut(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
    const { email, password } = req.body;

    var regResponse = await CmsApi.register(email as string, password as string);

    if(regResponse.status === 200) {

        session.Auth = regResponse.data;
        session.isLoggedIn = true;
        await session.save();
    
        res.status(200).json(session);
        return;
    }
    else {
        res.status(400).json(regResponse);
        return;
    }

}

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
    const { email, password } = req.body;
    
    var regResponse = await CmsApi.signIn(email as string, password as string);
    
    if(regResponse.status === 200) {
        console.log("Logging In");
        session.Auth = regResponse.data;
        session.isLoggedIn = true;
        await session.save();
        res.status(200).json(session);
        return;
    }
    else {
        //await session.destroy();
        await clearServerSession(session);
        
        res.status(400).json(defaultSession);
        return;
    }

}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
    //await session.destroy();
    console.log("Logging Out");
    await clearServerSession(session);
    res.status(200).json(defaultSession);
    return;
}


async function handlePatch(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
    CmsApi.refreshUser(session);
    res.status(200).json(session);
    return;
}
