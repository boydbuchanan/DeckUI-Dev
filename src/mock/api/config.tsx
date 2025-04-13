import { CmsApi } from "./cms"

export const Config = {
    CMSURL: process.env.NEXT_PUBLIC_CMS_URL,
    CMSAPIURL: process.env.CMS_API_URL,
    APITOKEN: process.env.CMS_API_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
}

export {CmsApi}