import { copyProperties } from "@deckai/client/utils";

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

export class Offer {
  id: number = 0;
  documentId: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  publishedAt: string = "";

  Title: string = "";
  Details: string = "";
  Delivery: string = "";
  Amount: number = 0;
  Type: OfferType = OfferType.Template;
  State: OfferState = OfferState.Unavailable;
  ForEmail: string = "";
  Expires: string = "";
  creator: User | null = null;
  buyer: User | null = null;
}

export class Order {
  id: number = 0;
  documentId: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  publishedAt: string = "";

  Title: string = "";
  Details: string = "";
  Delivery: string = "";
  Amount: number = 0;

  State: OrderState = OrderState.Pending;
  Content: Upload[] | null = null;

  workStartedAt?: string = "";
  inReviewAt?: string = "";
  acceptedAt?: string = "";
  completedAt?: string = "";
  firstStartedAt?: string = "";
  firstSubmittedAt?: string = "";
  rejectedAt?: string = "";
  refundRequestAt?: string = "";
  totalWorkTime: number = 0;
  
  creator: User | null = null;
  buyer?: User | null = null;

  stripeSessionId?: string = ""; // Stripe session ID
  stripeCustomerId?: string = ""; // Stripe customer ID
  stripeCustomerEmail?: string = ""; // Stripe customer email
  stripeCustomerName?: string = ""; // Stripe customer name
  stripeCreatedAt: string = ""; // Stripe customer name
}
export class UpdateOrder {
  Title?: string;
  Details?: string;
  Delivery?: string;
  Amount?: number;
  
  State?: OrderState = OrderState.Pending;

  totalWorkTime?: number;

  workStartedAt?: string;
  inReviewAt?: string;
  acceptedAt?: string;
  completedAt?: string;
  firstStartedAt?: string;
  firstSubmittedAt?: string;
  rejectedAt?: string;
  refundRequestAt?: string;
  
  creator?: number;
  buyer?: number;

  stripeSessionId?: string; // Stripe session ID
  stripeCustomerId?: string; // Stripe customer ID
  stripeCustomerEmail?: string; // Stripe customer email
  stripeCustomerName?: string; // Stripe customer name
  stripeCreatedAt?: string; // Stripe customer name
}

export class OfferDetails {
  Title: string = ""
  Details: string = ""
  Delivery: string = ""
  Amount: number = 0
}
const offerProps: string[] = Object.keys(new OfferDetails());

export function createOrderFromOffer(offer?: Offer): UpdateOrder {
  const template = copyProperties<UpdateOrder>(offer, offerProps);
  return Object.assign(new UpdateOrder(), template);
}

export function createOfferFromOrder(order: Order): Offer {
  const template = copyProperties<Offer>(order, offerProps);
  return Object.assign(new Offer(), template);
}


export enum OfferType {
  Template = 'template',
  Public = 'public',
  Private = 'private',
}

export enum OfferState {
  Unavailable = 'unavailable',
  Disabled = 'disabled',
  Enabled = 'enabled',
}

export enum OrderState {
  Pending = "pending",
  InProgress = "in-progress",
  RefundRequest = "refund-request",
  Submitted = "submitted",
  Rejected = "rejected",
  Accepted = "accepted",
  Completed = "completed"
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
  ContentReferenceName: "WorkContent",
  CoverReferenceName: "WorkCover",
  Reference: "api::work.work",
  ContentField: "Content",
  CoverField: "DisplayImage"
};

export const OrderFields = {
  ReferenceName: "Order",
  Reference: "api::order.order",
  ContentField: "Content",
};

export const UserFields = {
  Reference: "plugin::users-permissions.user",
  AvatarField: "avatar"
};

export class Upload {
  id: number = 0;
  documentId: string = "";
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

  IsVerifiedCreator: boolean = false; // isVerifiedCreator
  IsCreatorAvailable: boolean = false; // isCreatorAvailable

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

  // Accounts
  stripeConnectedAccountId: string = "";
  stripeAccountStatus?: StripeAccountStatus; // active, pending, restricted, incomplete, none
  stripeDetailsSubmitted: boolean = false; // details_submitted
  stripeChargesEnabled: boolean = false; // charges_enabled
  stripePayoutsEnabled: boolean = false; // payouts_enabled

  IsVerifiedCreator: boolean = false; // isVerifiedCreator
  IsCreatorAvailable: boolean = false; // isCreatorAvailable

  // Relationships are not populated by default
  avatar: Upload | null = null;

  // Get works explicitly to also populate relationship (upload) fields
  // works: Work[] = []
  interests: Interest[] = [];
  offers: Offer[] = [];

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

export enum StripeAccountStatus {
  Active = 'active',
  Incomplete = 'incomplete',
  Restricted = 'restricted',
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

  IsVerifiedCreator?: boolean; // isVerifiedCreator
  IsCreatorAvailable?: boolean; // isCreatorAvailable

  stripeAccountStatus?: StripeAccountStatus
  stripeDetailsSubmitted?: boolean; // details_submitted
  stripeChargesEnabled?: boolean; // charges_enabled
  stripePayoutsEnabled?: boolean; // payouts_enabled
}

export class UpdateOffer {
  Title?: string = "";
  Details?: string = "";
  Delivery?: string = "";
  Amount?: number = 0;
  Type?: OfferType = OfferType.Template;
  State?: OfferState = OfferState.Unavailable;
  ForEmail?: string = "";
  Expires?: string = "";
  
  creator?: number;
  buyer?: number;
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