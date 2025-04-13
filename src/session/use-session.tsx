import { defaultSession, SessionData } from "@deckai/client/types/session";
import useSWR from "swr";

import useSWRMutation from "swr/mutation";
import https from 'https';
import { addPath } from "@deckai/client/utils";
import { ApiConfig } from "site";

const sessionApiRoute = "session";
const agent = process.env.NODE_ENV === 'development'
    ? new https.Agent({
        rejectUnauthorized: false // Disables SSL certificate verification
        })
    : undefined;

async function fetchJson<JSON = unknown>(
    init?: RequestInit,
): Promise<JSON> {
    try{
        var endpoint = addPath(ApiConfig.APIURL, sessionApiRoute);
        var requestOptions = {
            httpsAgent: agent,
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            ...init,
        };
        return fetch(endpoint, requestOptions).then((res) => res.json());
    } catch (e) {
        console.error("api error", { e });
        throw e;
    }

}

function doLogin(url: string, { arg }: { arg: { email: string, password: string } }) {
    const data = {email: arg.email, password: arg.password};

    return fetchJson<SessionData>({ method: "POST", body: JSON.stringify(data), });
}

function doLogout() {
    return fetchJson<SessionData>({ method: "DELETE" });
}

function doRefresh() {
    return fetchJson<SessionData>({ method: "PATCH" });
}

export default function useSession() {
    const { data: session, isLoading } = useSWR( sessionApiRoute, fetchJson<SessionData>, { fallbackData: defaultSession } );

    const { trigger: login } = useSWRMutation(sessionApiRoute, doLogin);
    const { trigger: logout } = useSWRMutation(sessionApiRoute, doLogout);
    const { trigger: refresh } = useSWRMutation(sessionApiRoute, doRefresh);

    return { session, logout, login, refresh, isLoading };
}