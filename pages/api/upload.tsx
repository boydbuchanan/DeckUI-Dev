import {NextApiRequest, NextApiResponse} from "next";
import { CmsApi } from '@api/cms';
import getServerSession from "session";
import { IronSession } from "iron-session";
import { SessionData } from "@deckai/client/types/session";
import { ServerConfig } from "@server/config";

// For preventing header corruption, specifically Content-Length header
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
  const { passKey, userId } = request.query;
  const session = await getServerSession(request, response);
  let authUserId: number;
  
  if(passKey !== ServerConfig.API_KEY && !session.Auth) {
    response.status(401).json({ message: "not logged in" });
    return;
  }
  if(!userId){
    if(!session.Auth || !session.Auth.user) {
      response.status(401).json({ message: "request error: user not specified" });
      return;
    }else{
      authUserId = session.Auth.user.id;
    }
  }else{
      authUserId = parseInt(userId?.toString() || '0');
  }

  // Get Session
  if (request.method === 'GET') {
    await handleGet(request, response, session);
    return;
  }
  // Sign In
  if (request.method === 'POST') {
      await handlePost(request, response, session);
      return;
  }
  // if (request.method === 'PATCH') {
  //     await handlePatch(request, response, session);
  //     return
  // }
  
  // Sign Out
  if(request.method === 'DELETE') {
      await handleDelete(request, response, session);
      return;
  }

  response.status(405).end();
};


async function handleGet(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
  var { id } = req.query;
  if(session && id) {
      
      const regResponse = await CmsApi.getUpload(id.toString());

      res.status(regResponse.status).json(regResponse);
      return;
  }
  else {
      res.status(400).json({ message: "Not Logged In" });
      return;
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
  res.setHeader('Content-Type', 'application/json');
  CmsApi.redirectUpload(req, res);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {
  var { id } = req.query;
  if(session && id) {
    const regResponse = await CmsApi.deleteUpload(id.toString());
    res.status(regResponse.status).json(regResponse);
    return;
  }
  else {
      res.status(400).json({ message: "Not Logged In" });
      return;
  }
}