import { DeepRecursiveCopy, ShallowCopy, addPath } from "@deckai/client/utils";
import https from 'https';
import * as CMS from "@deckai/client/types/cms";
import { ApiConfig } from "site";
import Stripe from "stripe";

const agent = process.env.NODE_ENV === 'development'
  ? new https.Agent({
      rejectUnauthorized: false // Disables SSL certificate verification
    })
  : undefined;

export class ChatThread {
  other_user_id: number = 0
  type: string = ''
  name: string = ''
  description: string = ''
  image: string = ''
  lastMessage: string = ''
  lastMessageDate: Date = new Date()
  unreadCount: number = 0
}

export class Sort {
  id: number = 0
  order: number = 0
}

const Api = {
  async accountSession() {
    const res = await this.get(`stripe/account-session`);
    const json = await res.json();
    
    var data = json as Stripe.AccountSession;
    return data;
  },
  async connectedAccount() {
    const res = await this.get(`stripe/connected-account`);
    const json = await res.json();
    
    var data = json as Stripe.Account;
    return data;
  },
  async createCheckout(offer: CMS.Offer) {
    const res = await this.get(`stripe/create-checkout?offerId=${offer.documentId}`);
    const json = await res.json();
    
    var data = await json;
    return data;
  },

  async categories() {
    const res = await this.get(`categories`);
    const json = await res.json();
    
    var data = json as CMS.Category[];
    return data;
  },
  download(id: any) {
    return addPath(ApiConfig.APIURL, `download?uploadId=${id}`);
  },
  async deleteUpload(uploadId: number) {
    const res = await this.delete(`upload?id=${uploadId}`);
    const json = await res.json();
    var cmsResponse = {...json, status:res.status}
    return cmsResponse;
  },
  async upload(newImgBlob: Blob | File, refId: string, field: string, reference: string, uploadId?: number, fileData?: any) {
    
    const formData = new FormData();
    formData.append('files', newImgBlob, refId + `-${field}`);
    formData.append("refId", refId);
    formData.append("ref", reference);
    formData.append("field", field);
    if(fileData) {
      formData.append("fileInfo", JSON.stringify(fileData));
    }

    var endpoint = '/api/upload'
    if(uploadId && uploadId > 0) {
        endpoint = endpoint + `?id=${uploadId}`
    }

    const options = {
      method: 'POST',
      body: formData,
    }
    let cmsResponse: CMS.DataResponse<CMS.Upload>;
    const res = await fetch(endpoint, options)
    const json = await res.json();
    const resArray = json as CMS.Upload[];
    var upload = json as CMS.Upload;
    if(resArray.length > 0) {
      upload = resArray[0];
    }

    cmsResponse = {status: res.status, data: upload, error: null}
    return cmsResponse;
  },
  
  async uploadFileWithProgress(
    newImgBlob: Blob | File,
    refName: string,
    refId: string,
    field: string,
    reference: string,
    uploadId?: number, 
    fileData?: any,
    onProgress?: (progress: number) => void
  ): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    var name = `${refName}${refId}-${field}`;
    formData.append('files', newImgBlob, name);
    formData.append("refId", refId);
    formData.append("ref", reference);
    formData.append("field", field);
    if(fileData) {
      formData.append("fileInfo", JSON.stringify(fileData));
    }

    var endpoint = '/api/upload'
    if(uploadId && uploadId > 0) {
        endpoint = endpoint + `?id=${uploadId}`
    }
    xhr.open("POST", endpoint, true);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress?.(progress); // Call the progress callback
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ status: xhr.status, data: JSON.parse(xhr.responseText) });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed due to a network error"));

    xhr.send(formData);
  })},

  get(path: string) {
    return this.request(path, "GET");
  },
  post(path: string, data: any, isFormData: boolean = false) {
    if(isFormData)
      return this.asForm(path, 'POST', data);

    return this.asJson(path, 'POST', data);
  },
  put(path: string, data?: any, isFormData: boolean = false) {
    if (isFormData) return this.asForm(path, "PUT", data);
    return this.asJson(path, "PUT", data);
  },
  delete(path: string) {
    return this.request(path, 'DELETE');
  },
  patch(path: string, data?: any, isFormData: boolean = false) {
    if (isFormData) return this.asForm(path, "PATCH", data);
    return this.asJson(path, "PATCH", data);
  },

  request(path: string, method: string) {
    try {
      var endpoint = addPath(ApiConfig.APIURL, path);
      var requestOptions = {
        httpsAgent: agent,
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      };
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  },

  asJson(path: string, method: string, body: any) {
    return this.asForm(path, method, JSON.stringify(body), "application/json");
  },

  asForm(
    path: string,
    method: string,
    body: any,
    contentType: string = "multipart/form-data"
  ) {
    try {
      var endpoint = addPath(ApiConfig.APIURL, path);
      var requestOptions = {
        agent: agent,
        method: method,
        headers: {
          "Content-Type": contentType,
          Accept: "*/*",
        },
        body: body,
      };
      return fetch(endpoint, requestOptions);
    } catch (e) {
      console.error("api error", { e });
      throw e;
    }
  }
}


export default Api;