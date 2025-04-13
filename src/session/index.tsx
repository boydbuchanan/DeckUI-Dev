import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { IncomingMessage, ServerResponse } from 'http';
import { ShallowCopy } from '@deckai/client/utils';
import { CmsApi } from '@api/cms';
import { defaultSession, SessionData } from '@deckai/client/types/session';

export const sessionOptions: SessionOptions = {
  password: "FfYCY8Z4TbHKTrMpnYBNCNawkRk8PmrX7",
  cookieName: "kaizen_biscuit",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: true,
  },
};

export async function getServerSession(req: IncomingMessage | Request, res: Response | ServerResponse<IncomingMessage>) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if(session.isLoggedIn){
    await CmsApi.refreshUser(session);
  }
  return session
}

export async function clearServerSession(session: IronSession<SessionData>) {
  await session.destroy();
  // set session to default
  ShallowCopy(session, defaultSession);
  await session.save();
  return session
}

export default getServerSession;
