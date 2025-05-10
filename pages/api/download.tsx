import {NextApiRequest, NextApiResponse} from "next";
import { CmsApi } from '@api/cms';
import { clearServerSession, getServerSession } from "session";
import { IronSession } from "iron-session";
import { addPath } from "@deckai/client/utils";
import https from 'https';
import { SessionData } from "@deckai/client/types/session";
import { ServerConfig } from "@server/config";

const whitelistedPatterns: string[] = ['https://deck.nyc3.digitaloceanspaces.com/', 'https://nyc3.digitaloceanspaces.com/deck'];

// entry point for /api/img/work
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
        } else {
            authUserId = session.Auth.user.id;
        }
    }else{
        authUserId = parseInt(userId?.toString() || '0');
    }

    // if (!imageUrl || (imageUrl && Array.isArray(imageUrl))) {
    //     response.status(400).send({ message: "request error: imageUrl not specified" });
    //     return
    // }

    // const isAllowed = isUrlWhitelisted(imageUrl, whitelistedPatterns)

    // if (!isAllowed) {
    //     response.status(400).send({ message: "request error: imageUrl not whitelisted" });
    //     return
    // }

    // Get Works
    if (request.method === 'GET') {
        await handleGet(request, response, session, authUserId);
        return;
    }

    // New Work
    if(request.method === 'PUT') {
        await handlePut(request, response, session, authUserId);
        return;
    }
    
    // Edit Work
    if(request.method === 'PATCH') {
        await handlePatch(request, response, session, authUserId);
        return;
    }
    
    // Upload Content
    if(request.method === 'POST') {
        await handlePost(request, response, session, authUserId);
        return;
    }

    response.status(405).end();
};
async function handleGet(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>, userId: number) {
    const { uploadId } = req.query;

    if (!uploadId) {
        res.status(400).json({ message: "request error: upload not specified" });
        return;
    }

    const regResponse = await CmsApi.getUpload(uploadId as string);

    if (regResponse) {
        const upload = regResponse.data;
        if (!upload) {
            res.status(400).json({ message: "request error: upload not found" });
            return;
        }

        // Redirect the client to the actual file URL
        res.setHeader("Content-Disposition", `attachment; filename="${upload.name}"`);
        res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
        res.redirect(302, upload.url); // Use a 302 redirect to point to the actual file
        return;
    } else {
        res.status(400).json(regResponse);
        return;
    }
}

async function handleGetStream(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>, userId: number) {
    const { uploadId } = req.query;
    
    if(!uploadId) {
        res.status(400).json({ message: "request error: upload not specified" });
        return;
    }
    console.log("Upload ID", uploadId);
    
    const regResponse = await CmsApi.getUpload(uploadId as string);

    console.log("Upload Response", regResponse);

    if(regResponse) {
        var upload = regResponse.data;
        if(!upload) {
            res.status(400).json({ message: "request error: upload not found" });
            return;
        }
        
        if(upload.mime && upload.mime.startsWith('image/')) {
            console.log("Image URL", upload.url);
            const imageBlob = await fetchImageBlob(upload.url);
            const blob = await imageBlob.arrayBuffer();
            res.setHeader("Content-Type", upload.mime);
            res.send(Buffer.from(blob));
            return;
        } else if(upload.mime && upload.mime.startsWith('video/')) {
            console.log("Video URL", upload.url);
            const imageBlob = await fetchImageBlob(upload.url)
            const blob = await imageBlob.arrayBuffer();
            res.setHeader("Content-Type", upload.mime);
            
            res.setHeader("Content-Disposition", `inline; filename="${upload.name}"`);
            res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
            res.send(Buffer.from(blob));
            return;
        }

        
        // return nothing
        res.status(regResponse.status).json(regResponse);
        
        return;
    }
    else {
        res.status(400).json(regResponse);
        return;
    }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>, userId: number) {
    
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>, userId: number) {
    

}

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: IronSession<SessionData>, userId: number) {
    res.status(405).end();
}
function pipeImage(res: NextApiResponse, imageBlob: ReadableStream<Uint8Array>, options: Options) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
    
    
}
async function fetchImageBlob(url: string) {
    var requestOptions = {
        httpsAgent: new https.Agent(),
        method: 'GET',
        headers: {
            Accept: '*/*',
        }
    };
    return await fetch(url, requestOptions);
}

function isUrlWhitelisted(url: string, whitelistedPatterns: Options['whitelistedPatterns']) {
    return whitelistedPatterns.some((singleHost) => {
        return url.match(singleHost)
    })
}
interface Options {
    whitelistedPatterns: (string | RegExp)[];
    messages: {
        wrongFormat: string;
        notWhitelisted: string;
        imageFetchError: string;
    };
    fallbackUrl: string;
}