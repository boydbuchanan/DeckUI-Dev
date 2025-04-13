import type * as CMS from "@deckai/client/types/cms";
import type { SessionData } from "@deckai/client/types/session";

import { mockUser, mockWork, mockWorks, thisUserSessionData } from "../cms";
import { workImage } from "../imgs";

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
    coverfileData?: any
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
    contentfileData?: any
  ) {
    var response: CMS.DataResponse<CMS.Upload> = {
      status: 200,
      data: firstMockWork.Content,
      error: null
    };
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
  async works() {
    let workResponse: CMS.DataResponse<CMS.Work[]>;
    workResponse = { data: mockWorks } as CMS.DataResponse<CMS.Work[]>;
    return workResponse;
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

  async getMe() {
    let userResponse: CMS.DataResponse<CMS.User>;
    userResponse = { data: mockUser } as CMS.DataResponse<CMS.User>;
    return userResponse;
  }

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
