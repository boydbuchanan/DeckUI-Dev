import {NextApiRequest, NextApiResponse} from "next";
import { clearServerSession, getServerSession } from "session";
import { IronSession } from "iron-session";
import { SessionData } from "@deckai/client/types/session";
import { ServerConfig } from "@server/config";

type PlacesAutocompleteResponse = {
  predictions: Array<{
    description: string;
    place_id: string;
  }>;
  status: string;
};

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

    return response.status(405).json({ error: "Method not allowed" });
};

async function handleGet(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>) {

  const { input, types } = req.query;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const params = new URLSearchParams({
      input: input as string,
      key: ServerConfig.GOOGLE_MAPS_API_KEY || "",
      ...(types && { types: types as string }),
    });

    // console.log("Fetching places with params:", params.toString());

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`
    );

    if (!response.ok) {
      console.error("Places API error:", response.status, response.statusText);
      throw new Error("Failed to fetch places");
    }

    const data = await response.json();
    // console.log("Places API response:", data);

    if (data.error_message) {
      console.error("Places API error message:", data.error_message);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return res.status(500).json({ error: "Failed to fetch places" });
  }
}
