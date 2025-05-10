import type * as CMS from "@deckai/client/types/cms";
import type { SessionData } from "@deckai/client/types/session";

import { mockOffers, mockOrders, mockUser, mockWork, mockWorks, thisUserSessionData } from "../cms";
import { workImage } from "../imgs";
import { AccountOnboardResponse } from "@deckai/client/types/api";

// Use the first item from mockWork array for mock API responses
const firstMockWork = mockWork;

class UserApiClass {
  async register(email: string, password: string) {
    return thisUserSessionData;
  }
  async login(email: string, password: string) {
    return thisUserSessionData;
  }
  async session() {
    return thisUserSessionData;
  }
  async deleteUpload(uploadId: number) {
    return { status: 200 };
  }
  async uploadWorkCover(
    blob: Blob | File, 
    work: CMS.Work, 
    coverUploadId?: number,
    coverfileData?: any,
    onProgress?: (progress: number) => void
  ) {
    var response: CMS.DataResponse<CMS.Upload> = {
      status: 200,
      data: firstMockWork.DisplayImage,
      error: null
    };
    return response;
  }
  async uploadWorkContent(
    blob: Blob | File,
    work: CMS.Work,
    contentUploadId?: number,
    contentfileData?: any,
    onProgress?: (progress: number) => void
  ) {
    var response: CMS.DataResponse<CMS.Upload> = {
      status: 200,
      data: firstMockWork.Content,
      error: null
    }
    return response;
  }
  async uploadOrderContent(
    blob: Blob | File,
    order: CMS.Order,
    contentUploadId?: number,
    contentfileData?: any,
    onProgress?: (progress: number) => void
  ) {
    var response: CMS.DataResponse<CMS.Upload> = {
      status: 200,
      data: firstMockWork.Content,
      error: null
    }
    return response;

  }
  async uploadUserAvatar(
    blob: Blob | File,
    theUser: CMS.User,
    avatar?: CMS.Upload
  ) {
    var response: CMS.DataResponse<CMS.Upload> = {
      status: 200,
      data: mockUser.avatar,
      error: null
    };
    return response;
  }
  // *** Offers ***
  async offers() {
    
    return mockOffers;
  }
  async newOffer() {
  }
  async newOfferWith(data: any) {
    let workResponse: CMS.DataResponse<CMS.Offer>;
    workResponse = {  } as CMS.DataResponse<CMS.Offer>;
    return workResponse;
  }
  async getOffer(documentId: any) {
    var idx = mockOffers.findIndex((o) => o.documentId === documentId);
    return mockOffers[idx];
  }
  async updateOffer(documentId: any, data: any) {
    let workResponse: CMS.DataResponse<CMS.Offer>;
    workResponse = {  } as CMS.DataResponse<CMS.Offer>;
    workResponse.data = data as CMS.Offer;
    workResponse.status = 200;
    return workResponse;
  }
  // *** Orders ***
  async orders() {
    return mockOrders;
  }
  async getOrder(documentId: any) {
  }
  async updateOrder(documentId: any, data: any) {
    let workResponse: CMS.DataResponse<CMS.Order>;
    workResponse = {  } as CMS.DataResponse<CMS.Order>;
    workResponse.data = data as CMS.Order;
    workResponse.status = 200;
    return workResponse;
  }
  // *** Work ***
  async works() {
    
    return mockWorks;
  }

  async newWork() {
    let workResponse: CMS.DataResponse<CMS.Work>;
    workResponse = {data: firstMockWork} as CMS.DataResponse<CMS.Work>;
    return workResponse;
  }

  async newWorkWith(data: any) {
    let workResponse: CMS.DataResponse<CMS.Work>;
    workResponse = {data: firstMockWork} as CMS.DataResponse<CMS.Work>;
    return workResponse;
  }

  async getWork(id: any) {
    let workResponse: CMS.DataResponse<CMS.Work>;
    workResponse = {data: firstMockWork} as CMS.DataResponse<CMS.Work>;
    return workResponse;
  }

  async updateMyWork(id: any, data: any) {
    const res = { status: 200 };
    var cmsResponse = { data:firstMockWork, status: res.status };
    return cmsResponse;
  }

  workImage(id: any) {
    return workImage;
  }

  editImage(imageUrl: any) {
    return imageUrl;
  }

  async onboarding() {
    return {} as AccountOnboardResponse;
  };
  async getMe() {
    
    return mockUser;
  };

  async updateMe(data: any) {
    const res = { status: 200 };
    var cmsResponse = { data:mockUser, status: res.status };
    return cmsResponse;
  }

  async updateInterests(interestIds: number[]) {
    return this.updateMe({ interests: interestIds });
  }
}

export const Me = new UserApiClass();

export default Me;
