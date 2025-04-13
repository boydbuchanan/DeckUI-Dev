import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "session";
import { SessionData } from "@deckai/client/types/session";

export async function getAppSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    
    return session
}