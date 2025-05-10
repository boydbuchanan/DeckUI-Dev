import {
  Interest,
  Category,
  ExternalLink,
  Upload,
  User,
  Work,
  AuthCallback,
  SessionUser,
  Offer,
  OfferType,
  OfferState,
  StripeAccountStatus,
  Order,
  OrderState
} from "@deckai/client/types/cms";
import { profileImage, workImage } from "./imgs";
import { categoryTiles } from "./data";
import { SessionData } from "@deckai/client/types/session";


const getRandomElements = (arr: any, count = 3) => {
  return arr.sort(() => Math.random() - 0.5).slice(0, count);
};

export const mockInterests: Interest[] = categoryTiles.flatMap((tile, index) => {
  const baseId = index * 10 + 100;
  return [
    new Interest().deserialize({
      id: baseId,
      Display: `${tile.title} Tips`
    }),
    new Interest().deserialize({
      id: baseId + 1,
      Display: `${tile.title} Trends`
    })
  ];
});

const generateInterests = (baseId: number, categoryTitle: string): Interest[] => [
  new Interest().deserialize({
    id: baseId,
    Display: `${categoryTitle} Tips`
  }),
  new Interest().deserialize({
    id: baseId + 1,
    Display: `${categoryTitle} Trends`
  })
];
export const mockCategories: Category[] = categoryTiles.map((tile, index) => {
  return new Category().deserialize({
    id: index + 1,
    Display: tile.title,
    IconName: tile.iconName,
    Description: `Content related to ${tile.title.toLowerCase()}.`,
    interests: generateInterests(index * 10 + 100, tile.title)
  });
});
export const mockCategory = mockCategories[0]; // Technology

export const mockUserInterests: Interest[] = mockInterests.filter(
  (i) => i.id === 101 || i.id === 201 || i.id === 301
);

// Assign avatar
export const mockAvatar: Upload = new Upload();
mockAvatar.id = 1;
mockAvatar.name = "profile-pic.jpg";
mockAvatar.url = profileImage;

export const mockUser: User = new User();

mockUser.id = 1;
mockUser.username = "fiona_chen";
mockUser.email = "fiona.chen@email.com";
mockUser.createdAt = "2024-02-25T10:00:00Z";
mockUser.displayName = "Fiona Chen";
mockUser.firstName = "Fiona";
mockUser.lastName = "Chen";
mockUser.aboutMe = "Passionate about technology, travel, and fitness.";
mockUser.website = "https://johndoe.dev";
mockUser.location = "San Francisco, CA";
mockUser.contactEmail = "contact@email.com";
mockUser.avatar = mockAvatar;
mockUser.IsCreatorAvailable = true;
mockUser.IsVerifiedCreator = true;
mockUser.stripeAccountStatus = StripeAccountStatus.Active;
mockUser.stripeChargesEnabled = true;
mockUser.Url = "fiona-chen";

// Assign interests (referencing 3 from mockInterests)
mockUser.interests = mockInterests.filter((i) =>
  [101, 201, 301].includes(i.id)
);

// Assign external links
mockUser.externalLinks = [
  new ExternalLink("LinkedIn", "https://linkedin.com/in/fiona.che"),
  new ExternalLink("GitHub", "https://github.com/fiona.che"),
  new ExternalLink("Twitter", "https://twitter.com/fiona.che")
];

export const mockNewUser: User = new User();
mockNewUser.id = 2;
mockNewUser.email = "new@email.com";

export const mockWork: Work = {
  id: 1,
  documentId: "work-001",
  Title: "Building AI-Powered Web Apps",
  PostUrl: "https://fiona.che.dev/blog/ai-web-apps",
  Platform: "Blog",
  Content: {
    id: 101,
    documentId: "work-001",
    name: "ai-web-apps.pdf",
    updatedAt: "2024-02-20T10:00:00Z",
    alternativeText: "",
    caption: "",
    width: 0,
    height: 0,
    ext: ".pdf",
    mime: "application/pdf",
    url: workImage
  },
  DisplayImage: {
    id: 201,
    documentId: "work-001",
    name: "ai-web-apps-thumbnail.jpg",
    updatedAt: "2024-02-20T10:00:00Z",
    alternativeText: "",
    caption: "",
    width: 0,
    height: 0,
    ext: ".jpg",
    mime: "image/jpeg",
    url: workImage
  },
  interest: mockInterests.find((i) => i.id === 101) || null, // Artificial Intelligence
  Sort: 1,
  user: mockUser,
  createdAt: "2024-02-20T10:00:00Z",
  updatedAt: "2024-02-22T12:00:00Z",
  publishedAt: "2024-02-24T14:00:00Z"
};
export const mockWorks: Work[] = [
  mockWork,
  {
    id: 2,
    documentId: "work-002",
    Title: "Exploring Hidden Trails in Patagonia",
    PostUrl: "https://fiona.che.dev/blog/patagonia-hiking",
    Platform: "Blog",
    Content: {
      id: 102,
      documentId: "work-002",
      name: "patagonia-hiking.pdf",
      updatedAt: "2024-02-18T10:00:00Z",
      alternativeText: "",
      caption: "",
      width: 0,
      height: 0,
      ext: ".pdf",
      mime: "application/pdf",
      url: workImage
    },
    DisplayImage: {
      id: 202,
      documentId: "work-002",
      name: "patagonia-hiking-thumbnail.jpg",
      updatedAt: "2024-02-18T10:00:00Z",
      alternativeText: "",
      caption: "",
      width: 0,
      height: 0,
      ext: ".jpg",
      mime: "image/jpeg",
      url: workImage
    },
    interest: mockInterests.find((i) => i.id === 201) || null, // Backpacking
    Sort: 2,
    user: mockUser,
    createdAt: "2024-02-15T08:30:00Z",
    updatedAt: "2024-02-17T11:45:00Z",
    publishedAt: "2024-02-19T13:15:00Z"
  },

  {
    id: 3,
    documentId: "work-003",
    Title: "A Guide to Mindfulness and Yoga",
    PostUrl: "https://fiona.che.dev/blog/mindfulness-yoga",
    Platform: "YouTube",
    Content: {
      id: 103,
      documentId: "work-003",
      name: "mindfulness-yoga-video.mp4",
      updatedAt: "2024-02-10T07:45:00Z",
      alternativeText: "",
      caption: "",
      width: 0,
      height: 0,
      ext: ".mp4",
      mime: "video/mp4",
      url: workImage
    },
    DisplayImage: {
      id: 203,
      documentId: "work-003",
      name: "mindfulness-yoga-thumbnail.jpg",
      updatedAt: "2024-02-10T07:45:00Z",
      alternativeText: "",
      caption: "",
      width: 0,
      height: 0,
      ext: ".jpg",
      mime: "image/jpeg",
      url: workImage
    },
    interest: mockInterests.find((i) => i.id === 301) || null, // Yoga
    Sort: 3,
    user: mockUser,
    createdAt: "2024-02-10T07:45:00Z",
    updatedAt: "2024-02-12T09:30:00Z",
    publishedAt: "2024-02-14T11:00:00Z"
  }
];

export const mockCreators: User[] = [
  mockUser,
  new User().deserialize({
    id: 2,
    Url: "john-doe",
    email: "fiona.chen@email.com",
    createdAt: "2024-02-25T10:00:00Z",
    updatedAt: "2024-02-25T10:00:00Z",
    displayName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    headline: "Web Developer & Travel Blogger",
    aboutMe: "Lover of the outdoors and all things tech.",
    brandsWorkedWith: "Apple, Amazon",
    rates: "$40/hr",
    website: "https://johndoe.dev",
    location: "New York, NY",

    avatar: mockAvatar,
    interests: getRandomElements(mockInterests, 3)
  }),
  
]


export const sessionUser: SessionUser = {
  id: 0,
  username: "fiona",
  email: "name@email.com",
  createdAt: "2023-10-01T00:00:00.000Z",
  updatedAt: "2023-10-01T00:00:00.000Z",
  IsCreatorAvailable: true,
  IsVerifiedCreator: true,

  // Custom fields
  avatar: mockAvatar,

  displayName: "Fiona Chen",
  firstName: "Fiona",
  lastName: "Chen",
  aboutMe: "",
  location: "New York City, New York, United States of America",
  contactEmail: "fiona.chen@email.com"
};

export const newUser: SessionUser = {
  id: 1,
  username: "john",
  email: "john.doe@email.com",
  createdAt: "2023-10-01T00:00:00.000Z",
  updatedAt: "2023-10-01T00:00:00.000Z",
  IsCreatorAvailable: false,
  IsVerifiedCreator: false,
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  aboutMe: "",
  location: "",
  contactEmail: "john.doe@contact.com",
  avatar: null
};

const thisUserCallback: AuthCallback = {
  status: 200,
  jwt: "jwt",
  user: sessionUser
};

const newUserCallback: AuthCallback = {
  status: 200,
  jwt: "jwt",
  user: newUser
};

export const thisUserSessionData: SessionData = {
  isLoggedIn: true,
  Auth: thisUserCallback
};

export const newUserSessionData: SessionData = {
  isLoggedIn: true,
  Auth: newUserCallback
};

export const mockOffers: Offer [] = [
  {
    id: 1,
    documentId: "offer-001",
    Title: "AI-Powered Web App Development",
    Details: "Looking for a developer to create a web app using AI technologies.",
    Delivery: "2 days",
    Amount: 500,
    Type: OfferType.Private,
    State: OfferState.Enabled,
    ForEmail: "",
    Expires: "2024-03-01T00:00:00Z",
    buyer: null,
    creator: mockUser,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    publishedAt: "2023-10-01T00:00:00.000Z",

  },
  {
    id: 2,
    documentId: "offer-002",
    Title: "Travel Photography Session",
    Details: "Seeking a photographer for a travel shoot in the mountains.",
    Delivery: "3 days",
    Amount: 300,
    Type: OfferType.Public,
    State: OfferState.Enabled,
    ForEmail: "",
    Expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: null,
    creator: mockUser,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    publishedAt: "2023-10-01T00:00:00.000Z",
  },
  {
    id: 3,
    documentId: "offer-003",
    Title: "Yoga Retreat in Bali",
    Details: "Join me for a rejuvenating yoga retreat in Bali.",
    Delivery: "5 days",
    Amount: 1200,
    Type: OfferType.Private,
    State: OfferState.Enabled,
    ForEmail: "test@email.com",
    Expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: null,
    creator: mockUser,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    publishedAt: "2023-10-01T00:00:00.000Z",
  },
  {
    id: 4,
    documentId: "offer-004",
    Title: "Personalized Fitness Coaching",
    Details: "Offering one-on-one fitness coaching tailored to your needs.",
    Delivery: "1 day",
    Amount: 200,
    Type: OfferType.Public,
    State: OfferState.Disabled,
    ForEmail: "",
    Expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: null,
    creator: mockUser,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    publishedAt: "2023-10-01T00:00:00.000Z",
  },
  {
    id: 5,
    documentId: "offer-005",
    Title: "Custom Travel Itinerary Planning",
    Details: "Need help planning a unique travel itinerary? Let's collaborate!",
    Delivery: "4 days",
    Amount: 400,
    Type: OfferType.Public,
    State: OfferState.Unavailable,
    ForEmail: "",
    Expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: null,
    creator: mockUser,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    publishedAt: "2023-10-01T00:00:00.000Z",
  },
  {
    id: 6,
    documentId: "offer-006",
    Title: "Web Development for Nonprofits",
    Details: "Offering discounted web development services for nonprofit organizations.",
    Delivery: "7 days",
    Amount: 800,
    Type: OfferType.Public,
    State: OfferState.Enabled,
    ForEmail: "",
    Expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: null,
    creator: mockUser,
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    publishedAt: "2023-10-01T00:00:00.000Z",
  }
];

export const mockOrders: Order[] = [
  {
    id: 1,
    documentId: "order-001",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-22T12:00:00Z",
    publishedAt: "2024-02-24T14:00:00Z",
    Title: "AI-Powered Web App Development",
    Details: "Looking for a developer to create a web app using AI technologies.",
    Delivery: "2 days",
    Amount: 500,
    State: OrderState.Pending,
    Content: null,
    workStartedAt: new Date().toISOString(),
    totalWorkTime: 120,
    creator: mockUser,
    buyer: mockUser,
    stripeCreatedAt: "2024-02-20T10:00:00Z",
  }
];