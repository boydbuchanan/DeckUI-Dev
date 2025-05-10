import { ShallowCopy, addPath, jsonSerializable } from "@deckai/client/utils";
import https from 'https';
import * as CMS from "@deckai/client/types/cms";
import { NextApiRequest, NextApiResponse } from 'next';

import { IronSession } from "iron-session";
import qs from "qs";
//npm i --save-dev @types/qs

import { defaultSession, SessionData } from "@deckai/client/types/session";
import { ServerConfig } from "@server/config";
import { mockCategories, mockCreators, mockOffers, mockOrders, mockUser, mockWork, newUserSessionData, thisUserSessionData } from "@mock/cms";

const agent = process.env.NODE_ENV === 'development'
  ? new https.Agent({
      rejectUnauthorized: false // Disables SSL certificate verification
    })
  : undefined;

export const CmsApi = {
  getMedialUrl: function(path: string) {
    return `${ServerConfig.CMSURL}${path}`;
  },
  uploadMedia: async function(blob: Blob, name: string) {
    return null;
  },
  
  redirectUpload: async function(req: NextApiRequest, res: NextApiResponse) {
      return;
  },

  async updateUpload(uploadId: string, data: FormData) {
    
    return {} as CMS.Upload;
  },
  async deleteUpload(uploadId: string) {
    return {} as CMS.DataResponse<CMS.Upload>;
  },
  async getUpload(uploadId: string) {
    return {} as CMS.DataResponse<CMS.Upload>;
  },
  async getCreators(interestIds: number[]) {
    let response: CMS.DataArrayResponse<CMS.User>;
    response = {} as CMS.DataArrayResponse<CMS.User>;

    return response;
  },
  async getPublicOffers(userId: number) {
    let response: CMS.DataArrayResponse<CMS.Offer>;
    response = {} as CMS.DataArrayResponse<CMS.Offer>;
    response.data = mockOffers;

    return response;
  },
  async getOffers(userId: number) {
    let response: CMS.DataArrayResponse<CMS.Offer>;
    response = {} as CMS.DataArrayResponse<CMS.Offer>;
    response.data = mockOffers;

    return response;
  },
  async getOffer(offerDocumentId: any) {
    let response: CMS.DataResponse<CMS.Offer>;
    response = {} as CMS.DataResponse<CMS.Offer>;
    var idx = mockOffers.findIndex((o) => o.documentId === offerDocumentId);
    response.data = mockOffers[idx];

    return response;
  },
  async newOffer(userId: number, data: any) {
  },
  async updateOffer(offerDocumentId: any, data: any) {
  },
  async getOrders(userId: number) {
    let response: CMS.DataArrayResponse<CMS.Order>;
    response = {} as CMS.DataArrayResponse<CMS.Order>;
    response.data = mockOrders;

    return response;
  },
  async getOrderBySessionId(orderSessionId?: string) {
  },
  async getOrder(orderDocumentId: any) {
    let response: CMS.DataResponse<CMS.Order>;
    response = {} as CMS.DataResponse<CMS.Order>;
    var idx = mockOrders.findIndex((o) => o.documentId === orderDocumentId);
    response.data = mockOrders[idx];

    return response;
  },
  async newOrder(data: any, userId?: number, ) {
  },
  async getWorks(userId: number) {
    let worksResponse: CMS.DataArrayResponse<CMS.Work>;
    worksResponse = {} as CMS.DataArrayResponse<CMS.Work>;

    return worksResponse;
  },
  async getWork(workDocumentId: any) {
    let workResponse: CMS.DataResponse<CMS.Work>;
    workResponse = {} as CMS.DataResponse<CMS.Work>;
    return workResponse;
  },

  async newWork(userId: number) {
    
    let workResponse: CMS.DataResponse<CMS.Work>;
    workResponse = {} as CMS.DataResponse<CMS.Work>;
    return workResponse;
  },
  async getInterestsByUrl(urls: string[]) {
    let worksResponse: CMS.DataArrayResponse<CMS.Interest>;
    worksResponse = {} as CMS.DataArrayResponse<CMS.Interest>;

    return worksResponse;
  },
  async getCategoryByUrl(url: string) {
    // Url is unique, so we can return the first one
    return {} as CMS.Category;
  },

  async getCategories() {
    return mockCategories;
  },

  async getInfo() {
    let infoResponse: CMS.DataResponse<CMS.Info>;
    infoResponse = {} as CMS.DataResponse<CMS.Info>;
    return infoResponse;
  },
  async register(email: string, password: string) {
    
    let cmsResponse: CMS.DataResponse<CMS.AuthCallback>;
    cmsResponse = {data: newUserSessionData.Auth, status: newUserSessionData.Auth?.status } as CMS.DataResponse<CMS.AuthCallback>;
    return cmsResponse;
  },
  async signIn(email: string, password: string) {
    
    let cmsResponse: CMS.DataResponse<CMS.AuthCallback>;
    cmsResponse = {data: thisUserSessionData.Auth, status: thisUserSessionData.Auth?.status } as CMS.DataResponse<CMS.AuthCallback>;
    return cmsResponse;
  },
  async authCallback(provider: string | string[] | undefined, parsedURLQueryParams: string) {
    
    let cmsResponse: CMS.DataResponse<CMS.AuthCallback>;
    cmsResponse = {} as CMS.DataResponse<CMS.AuthCallback>;
    return cmsResponse;
  },

  async refreshUser(session: IronSession<SessionData>) {
    
  },
  async getUserByStripeCustomerId(customerId: string) {
  },
  async getUserByUrl(path: string) {
    var users = mockCreators.filter((u) => u.Url === path || u.id.toString() === path);
    let userResponse: CMS.DataArrayResponse<CMS.User>;
    userResponse = { data: users } as CMS.DataArrayResponse<CMS.User>;
    return userResponse;
  },
  async getUser(id?: number, withAllFields: boolean = false) {
    
    let userResponse: CMS.DataResponse<CMS.User>;
    userResponse = {data: mockUser} as CMS.DataResponse<CMS.User>;
    return userResponse;
  },
  
  async getUserAs<T>(user: any, id?: number) {
  },
  async updateWork(id: any, work: any) {
    let cmsResponse: CMS.DataResponse<CMS.Work>;
    cmsResponse = {data: mockWork} as CMS.DataResponse<CMS.Work>;
    return cmsResponse;
  },
  async updateUser(id: number, user: any) {
    let userResponse: CMS.DataResponse<CMS.User>;
    userResponse = {data: mockUser} as CMS.DataResponse<CMS.User>;
    return userResponse;
  },
  async updateUserInterests(intIds: number[], id: number) {
    let userResponse: CMS.DataResponse<CMS.User>;
    userResponse = {data: mockUser} as CMS.DataResponse<CMS.User>;
    return userResponse;
  },

  cmsGet(path: string) {
    try{
      var endpoint = addPath(ServerConfig.CMSAPIURL, path);
      var requestOptions = {
        httpsAgent: agent,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${ServerConfig.APITOKEN}`
        },
        validateStatus: (status: number) => true
      };
      console.log("GET: ", endpoint);
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    } 
  },
  
  cmsDelete(path: string) {
    try{
      var endpoint = addPath(ServerConfig.CMSAPIURL, path);
      var requestOptions = {
        httpsAgent: agent,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${ServerConfig.APITOKEN}`
        },
        validateStatus: (status: number) => true
      };
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  },
  // User does not use the data field when updating, so it has it's own very special method
  userPut(path: string, data: any) {
    try{
      var endpoint = addPath(ServerConfig.CMSAPIURL, path);
      var requestOptions = {
        agent: agent,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${ServerConfig.APITOKEN}`
        },
        body: JSON.stringify(data),
        validateStatus: (status: number) => true
      };
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  },
  cmsPut(path: string, data: any) {
    try{
      var endpoint = addPath(ServerConfig.CMSAPIURL, path);
      var requestOptions = {
        agent: agent,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${ServerConfig.APITOKEN}`
        },
        body: JSON.stringify({data: data}),
        validateStatus: (status: number) => true
      };
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  },
  cmsPost(path: string, data: any, isFormData: boolean = false) {
    if(isFormData)
      return this.cmsForm(path, 'POST', data);

    return this.cmsJson(path, 'POST', data);
  },
  
  cmsJson(path: string, method: string, data: any) {
    try{
      var endpoint = addPath(ServerConfig.CMSAPIURL, path);
      var requestOptions = {
        agent: agent,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${ServerConfig.APITOKEN}`
        },
        body: JSON.stringify({data: data}),
        validateStatus: (status: number) => true
      };
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  },
  cmsForm(path: string, method: string, body: FormData) {
    try{
      var endpoint = addPath(ServerConfig.CMSAPIURL, path);
      var requestOptions = {
        agent: agent,
        method: method,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${ServerConfig.APITOKEN}`
        },
        body: body,
        validateStatus: (status: number) => true
      };
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  },
  
  cmsRequest(method: string, path: string, data: any) {
    try{
      var endpoint = addPath(ServerConfig.CMSAPIURL, path);
      var requestOptions = {
        agent: agent,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${ServerConfig.APITOKEN}`
        },
        body: JSON.stringify(data),
        validateStatus: (status: number) => true
      };
      //return axios.post(endpoint, requestOptions);
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  }
}

export const getDisplayName = (profile: CMS.User) => {
  var displayName = profile.firstName;

  if (profile.lastName)
    displayName += ` ${profile.lastName}`;

  return displayName || profile.username
}

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {}
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        Accept: '*/*',
        Authorization: `Bearer ${ServerConfig.APITOKEN}`
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    path = `${path}${queryString ? `?${queryString}` : ""}`;
    var requestUrl = addPath(ServerConfig.CMSAPIURL, path);
    
    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    
    const data = await response.json();
    
    return data;
    
  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your server is running and you set all the required tokens.`);
  }
}