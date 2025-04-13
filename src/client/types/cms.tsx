export type AuthCallback = {
  status: number;
  jwt: string | null;
  user: SessionUser | null;
};
export interface HasUserProps {
  user: SessionUser | null;
}

export interface HasUserProp<TUser> {
  user: TUser | null;
}
export class Work {
  id: number = 0;
  documentId: string = "";
  Title: string = "";
  PostUrl: string = "";
  Platform: string = "";
  Content: Upload | null = null;
  DisplayImage: Upload | null = null;
  interest: Interest | null = null;
  Sort: number = 0;
  user: User | null = null;
  createdAt: string = "";
  updatedAt: string = "";
  publishedAt: string = "";
}

export const WorkFields = {
  Reference: "api::work.work",
  ContentField: "Content",
  CoverField: "DisplayImage"
};

export const UserFields = {
  Reference: "plugin::users-permissions.user",
  AvatarField: "avatar"
};

export class Upload {
  id: number = 0;
  updatedAt: string = "";
  name: string = "";
  alternativeText: string = "";
  caption: string = "";
  width: number = 0;
  height: number = 0;
  ext: string = "";
  mime: string = "";
  url: string = "";
}

// Session user has only standard fields
export class SessionUser {
  // Strapi fields
  id: number = 0;
  username: string = "";
  email: string = "";
  createdAt: string = "";
  updatedAt: string = "";

  // Custom fields
  avatar: Upload | null = null;

  displayName: string = "";
  firstName: string = "";
  lastName: string = "";
  aboutMe: string = "";
  location: string = "";
  contactEmail: string = "";
}

// Contains all user fields including relationships
export class User {
  // Strapi fields, do not use for other purposes
  id: number = 0;
  username: string = "";
  // the email the user signed up with, not for any other use
  email: string = "";
  createdAt: string = "";
  updatedAt: string = "";

  // Relationships are not populated by default
  avatar: Upload | null = null;

  // Get works explicitly to also populate relationship (upload) fields
  // works: Work[] = []
  interests: Interest[] = [];

  Url: string = "";
  firstName: string = "";
  lastName: string = "";
  aboutMe: string = "";
  website: string = "";
  location: string = "";
  contactEmail: string = "";

  displayName: string = "";
  // These are not relationships
  externalLinks: ExternalLink[] = [];

  deserialize(data: any): this {
    Object.assign(this, data);
    return this;
  }
}

// Use documentid to update work
// documentid can not be part of body
export class UpdateUser {
  displayName?: string = "";
  location?: string = "";
  aboutMe?: string = "";
  interests?: number[];
  website?: string = "";
  contactEmail?: string = "";
}
export class UpdateWork {
  Title?: string = "";
  PostUrl?: string = "";
  Platform?: string = "";
  interest?: number = 0;
  Sort?: number = 0;
}
export class ExternalLink {
  constructor(
    public title: string,
    public url: string
  ) {}
}

export class Info {
  id: number = 0;
  documentId: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  publishedAt: string = "";
  Title: string = "";
  InfoText: string = "";
}

export class Category {
  id: number = 0;
  documentId: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  publishedAt: string = "";
  Display: string = "";
  Url: string = "";
  Description: string = "";
  IconName: string = "";
  interests: Interest[] = [];

  deserialize(data: any): this {
    Object.assign(this, data);
    if (data.interests && Array.isArray(data.interests)) {
      this.interests = data.interests.map((interest: any) =>
        new Interest().deserialize(interest)
      );
    }
    return this;
  }
}

export class Interest {
  id: number = 0;
  documentId: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  publishedAt: string = "";
  Display: string = "";
  Url: string = "";
  deserialize(data: any): this {
    Object.assign(this, data);
    return this;
  }
}
export interface DataResponse<T> {
  status: number;
  data: T | null;
  error: Error | null;
}

export interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface DataArrayResponse<T> {
  status: number;
  data: T[] | null;
  error: Error | null;
  meta: Meta | null;
}

export interface ErrorResponse {
  status: number;
  error: Error;
}

export interface Error {
  status: number;
  name: string;
  message: string;
  details: any;
}

export type InterestFlat = {
  id: number;
  Display: string;
  categoryId: number;
  categoryDisplay: string;
};

export function toFlatInterests(categories: Category[]): InterestFlat[] {
  return categories.flatMap((category: Category) =>
    category.interests.map((interest: Interest) => ({
      id: interest.id,
      Display: interest.Display,
      categoryId: category.id,
      categoryDisplay: category.Display
    }))
  );
}

export function profileImage(user: User | SessionUser | null | undefined) {
  if (!user) {
    return undefined;
  }
  
  //date format YYYY-MM-DDTHH:MM:SS.sssZ
  // convert to date and get cache busting string
  var date = new Date(user.avatar?.updatedAt ?? user.updatedAt);
  var ticks = date.getTime() / 1000;
  var imgVersion = Math.floor(ticks);

  var imgUrl = user.avatar ? user.avatar.url : null;
  if (!imgUrl) {
    return null;
  }
  // cache bust the image by adding imgVersion

  return imgUrl+ "?v=" + imgVersion;
}