// import dotenvx from "@dotenvx/dotenvx";

import { Offer, Order, User } from "@deckai/client/types/cms"
const userPath = "/c/[path]"
const offers = "/offers"
const offerPath = offers + "/[id]"
const orderPath = "/my/orders/[id]"


export const ServerConfig = {
    UI_URL: process.env.NEXT_PUBLIC_UI_URL,
    API_KEY: process.env.API_KEY,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    CMSURL: process.env.CMS_URL,
    CMSAPIURL: process.env.CMS_API_URL,
    APITOKEN: process.env.CMS_API_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
    links: {
        home: "/",
        signIn: "/signin",
        me: "/me",
        myProfile: "/my/profile",
        explore: "/explore",
        dashboard: "/dashboard",
        userProfile: (path: string) => `/c/${path}`,
        userProfilePath: (user: User) => userPath.replace("[path]", user.Url ?? user.id),
        offer: (id: string) => `/offer/${id}`,
        creatorOffer: (offer: Offer) => { 
            var user = offer.creator;
            var creatorPath = user ? userPath.replace("[path]", user.Url ?? user.id) : "";
            return creatorPath + offerPath.replace("[id]", offer.documentId);
        },
        creatorOffers: (creator: User) => { 
            var user = creator;
            var creatorPath = user ? userPath.replace("[path]", user.Url ?? user.id) : "";
            return creatorPath + offers;
        },
        orderSuccess: (offer: Offer) => {
            var user = offer.creator;
            var creatorPath = user ? userPath.replace("[path]", user.Url ?? user.id) : "";
            return creatorPath + offerPath.replace("[id]", offer.documentId) + "/success";
        },
        orderCancel: (offer: Offer) => {
            var user = offer.creator;
            var creatorPath = user ? userPath.replace("[path]", user.Url ?? user.id) : "";
            return creatorPath + offerPath.replace("[id]", offer.documentId) + "/cancel";
        },
        myOrder: (order: Order) => { 
            return orderPath.replace("[id]", order.documentId);
        },
        offers: "/my" + offers,
        orders: "/my/orders",
        creator: "/creator",
    }
}
// export const ServerConfig = {
//     API_KEY: dotenvx.get('API_KEY'),
//     GOOGLE_MAPS_API_KEY: dotenvx.get('GOOGLE_MAPS_API_KEY'),
//     CMSURL: dotenvx.get('CMS_URL'),
//     CMSAPIURL: dotenvx.get('CMS_API_URL'),
//     APITOKEN: dotenvx.get('CMS_API_TOKEN'),
//     STRIPE_SECRET_KEY: dotenvx.get('STRIPE_SECRET_KEY') || "",
// }
