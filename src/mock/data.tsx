import type {
  BadgeProps,
  BreadcrumbsProps,
  ContactItemProps,
  CreatorCardProps,
  SocialCardProps
} from "@deckai/deck-ui";

import type { TileProps } from "@deckai/client/features/home/TileGrid";

import { creator1, creator2, creator3, creator4 } from "./imgs";


export const messageFilled = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.6816 16.25C14.9627 16.2563 16.5 14.3822 16.5 12.0788V6.92751C16.5 4.62412 14.9627 2.75 12.6816 2.75H5.31835C3.03734 2.75 1.5 4.62412 1.5 6.92751V12.0788C1.5 14.3822 3.03734 16.2563 5.31835 16.25H12.6816Z" fill="#089CCB" stroke="#089CCB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.426 7.13843L10.0936 9.84821C9.46395 10.3477 8.5781 10.3477 7.94848 9.84821L4.58789 7.13843" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const globalFilled = `
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 18.3334C13.1421 18.3334 16.5 14.6024 16.5 10C16.5 5.39765 13.1421 1.66669 9 1.66669C4.85786 1.66669 1.5 5.39765 1.5 10C1.5 14.6024 4.85786 18.3334 9 18.3334Z" fill="#089CCB" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.99995 2.5H6.74995C5.28745 7.36667 5.28745 12.6333 6.74995 17.5H5.99995" fill="#089CCB"/>
<path d="M5.99995 2.5H6.74995C5.28745 7.36667 5.28745 12.6333 6.74995 17.5H5.99995" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.25 2.5C12.7125 7.36667 12.7125 12.6333 11.25 17.5V2.5Z" fill="#089CCB"/>
<path d="M11.25 2.5C12.7125 7.36667 12.7125 12.6333 11.25 17.5" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 13.3333V12.5C6.63 14.125 11.37 14.125 15.75 12.5V13.3333" fill="#089CCB"/>
<path d="M2.25 13.3333V12.5C6.63 14.125 11.37 14.125 15.75 12.5V13.3333" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 7.5C6.63 5.875 11.37 5.875 15.75 7.5" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const socialCardsData: SocialCardProps[] = [
  {
    icon: "instagram-filled",
    followers: "2M",
    engagement: "7.2%"
  },
  {
    icon: "youtube-filled",
    followers: "1.5M",
    engagement: "5.2%"
  },
  {
    icon: "tiktok-filled",
    followers: "1.2M",
    engagement: "3.6%"
  }
];

export const interests = [
  "Travel",
  "Fashion/Beauty",
  "Lifestyle",
  "Food",
  "Music"
];

export const contactItems: ContactItemProps[] = [
  {
    icon: messageFilled,
    children: "fiona@fionasun.com",
    href: "mailto:fiona@fionasun.com"
  },
  {
    icon: globalFilled,
    children: "fionasun.com",
    href: "https://fionasun.com"
  }
];

export const breadcrumbs: BreadcrumbsProps = {
  items: [
    {
      label: "Creator Profile",
      href: ""
    }
  ],
  onHomeClick: () => {}
};

export const description = `Hi, I'm Fiona! Welcome to my world of travel and beauty. I've worked
        with major brands like Hyatt, Ritz Carlton, Marriott Bonvoy, Delta,
        REVOLVE, and Fenty Beauty to name a few. I've generated hundreds of
        thousands in sales and amassed millions of views across all platforms.
        Message me for partnership inquiries!`;

export const badges: BadgeProps[] = [
  {
    iconName: "medal-star",
    children: "Top Creator"
  },
  {
    iconName: "message-text",
    children: "Responds Quickly"
  }
];

export const longTextMockData = {
  name: "Fiona Chen-Williamson-Montgomery-Smith III",
  location:
    "New York City, New York, United States of America, North America, Earth",
  memberSince: "October 2024",
  interests: [
    "International Travel & Cultural Exploration",
    "High-End Fashion & Beauty Industry Trends",
    "Sustainable Lifestyle & Environmental Consciousness",
    "Gourmet Food & Wine Pairing",
    "Classical & Contemporary Music Appreciation",
    "Digital Content Creation & Social Media Strategy",
    "Luxury Hotel & Resort Reviews"
  ],
  description: `Hi, I'm Fiona! I'm a multi-faceted content creator with over a decade of experience in the digital space. 
    Welcome to my world of luxury travel, sustainable beauty, and authentic storytelling. Throughout my career, 
    I've had the privilege of collaborating with prestigious brands including Hyatt International, 
    The Ritz Carlton Worldwide Group, Marriott Bonvoy Exclusive Collection, Delta Airlines Premium Partners, 
    REVOLVE Fashion Network, and Fenty Beauty Global Ambassador Program, among many others. 
    My content has consistently generated substantial ROI, with documented success in driving over $500,000 in 
    direct sales through my platforms. I've amassed more than 50 million views across all social media channels, 
    with particularly strong engagement in long-form travel documentaries and beauty tutorials. 
    I'm particularly passionate about sustainable luxury and helping brands connect with conscious consumers. 
    For partnership inquiries, collaboration opportunities, or speaking engagements, please don't hesitate to reach out!`,
  socialCardsData: [
    {
      icon: "instagram-filled",
      followers: "2,547,982",
      engagement: "7.26546546544%"
    },
    {
      icon: "youtube-filled",
      followers: "1,547,233",
      engagement: "5.256545647%"
    },
    {
      icon: "tiktok-filled",
      followers: "1,234,567",
      engagement: "3.65435345438%"
    }
  ] as SocialCardProps[],
  contactItems: [
    {
      icon: messageFilled,
      children: "fiona.chen.professional.inquiries@fionasun.international.com",
      href: "mailto:fiona.chen.professional.inquiries@fionasun.international.com"
    },
    {
      icon: globalFilled,
      children: "www.fionasun.international/professional/portfolio",
      href: "https://www.fionasun.international/professional/portfolio"
    }
  ] as ContactItemProps[],
  badges: [
    {
      iconName: "medal-star",
      children: "Top Creator"
    },
    {
      iconName: "message-text",
      children: "Responds Within 24 Hours Guaranteed"
    },
    {
      iconName: "24-support",
      children: "24/7 Support"
    },
    {
      iconName: "3dcube",
      children: "Verified Creator"
    }
  ] as BadgeProps[]
};

export const categoryTiles: TileProps[] = [
  {
    title: "Food",
    iconName: "fork-and-knife",
  },
  {
    title: "Dance",
    iconName: "dance",
  },
  {
    title: "Fashion & Beauty",
    iconName: "user-octagon",
  },
  {
    title: "Fitness",
    iconName: "weight",
  },
  {
    title: "Gaming",
    iconName: "game",
  },
  {
    title: "Music & Singing",
    iconName: "music",
  },
  {
    title: "Health & Wellness",
    iconName: "health",
  },
  {
    title: "Parenting & Family",
    iconName: "baby",
  },
  {
    title: "Film & Photos",
    iconName: "video-vertical",
  },
  {
    title: "Pets & Animals",
    iconName: "pet",
  },
  {
    title: "Relationships",
    iconName: "lovely",
  },
  {
    title: "Spirituality",
    iconName: "lotus",
  },
  {
    title: "Sports",
    iconName: "basketball",
  },
  {
    title: "Tech",
    iconName: "devices",
  },
  {
    title: "Travel",
    iconName: "routing",
  }
];

export const creators: CreatorCardProps[] = [
  {
    name: "Kathryn Wood",
    profileImage: creator1,
    tags: ["UI/UX", "Branding", "Illustration"],
    badges: [
      { label: "Rising star", icon: "trend-up" },
      { label: "Verified", icon: "wallet-check" },
      { label: "Top 100", icon: "trend-up" },
      { label: "Top Creator", icon: "medal-star" }
    ],
    rating: 5,
    reviewCount: 18
  },
  {
    name: "Fiona Chen",
    profileImage: creator2,
    tags: ["Travel", "Fashion", "Beauty"],
    badges: [
      { label: "Top Creator", icon: "medal-star" },
      { label: "Top 100", icon: "trend-up" }
    ],
    rating: 4.8,
    reviewCount: 12
  },
  {
    name: "Jane Smith",
    profileImage: creator3,
    tags: ["Food", "Cooking", "Baking"],
    badges: [{ label: "New", icon: "star-1" }],
    rating: 4.5,
    reviewCount: 5
  },
  {
    name: "Alex Johnson",
    profileImage: creator4,
    tags: ["Tech", "Gadgets", "Innovation"],
    badges: [{ label: "Top Rated", icon: "star-1" }],
    rating: 4.7,
    reviewCount: 25
  },
  {
    name: "Michael Brown",
    profileImage: "https://i.pravatar.cc/300?img=13",
    tags: ["Art", "Design", "Creative"],
    badges: [{ label: "New", icon: "star-1" }],
    rating: 4.6,
    reviewCount: 10
  },
  {
    name: "Emily Davis",
    profileImage: "https://i.pravatar.cc/300?img=14",
    tags: ["Fashion", "Beauty", "Lifestyle"],
    badges: [{ label: "Top Creator", icon: "medal-star" }],
    rating: 4.9,
    reviewCount: 30
  },
  {
    name: "Daniel Wilson",
    profileImage: "https://i.pravatar.cc/300?img=36",
    tags: ["Tech", "Gadgets", "Innovation"],
    badges: [{ label: "Top Rated", icon: "star-1" }],
    rating: 4.8,
    reviewCount: 20
  }
];

export const musicInterests: string[] = [
  "Composers",
  "MusicProducers",
  "Audio Branding",
  "Audio Editing",
  "Audio Stream",
  "Beat Making",
  "Mixing",
  "Mastering",
  "Sound Design",
  "Music Licensing",
  "Music Production",
  "Music Composition",
  "Music Arrangement"
];

export const mockProfileReviews = [
  {
    userName: "Sarah Johnson",
    date: new Date("2024-03-15"),
    rating: 5,
    description:
      "Fiona is an exceptional creator! Her content is consistently high-quality and engaging. She's professional, responsive, and delivers exactly what she promises. Her travel and beauty content is particularly outstanding.",
    title: "Outstanding Creator",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    metrics: [
      { label: "Content Quality", rating: 5 },
      { label: "Communication", rating: 5 },
      { label: "Professionalism", rating: 5 },
      { label: "Value", rating: 5 }
    ]
  },
  {
    userName: "Michael Chen",
    date: new Date("2024-03-10"),
    rating: 4,
    description:
      "Great collaboration experience. Fiona's attention to detail and creative vision brought our campaign to life. Her audience engagement is impressive.",
    title: "Professional and Creative",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    metrics: [
      { label: "Content Quality", rating: 4 },
      { label: "Communication", rating: 5 },
      { label: "Professionalism", rating: 5 },
      { label: "Value", rating: 4 }
    ]
  },
  {
    userName: "Emma Wilson",
    date: new Date("2024-03-05"),
    rating: 5,
    description:
      "Working with Fiona was a game-changer for our brand. Her authentic approach to content creation and deep understanding of her audience helped us achieve remarkable results. The quality of her work is consistently excellent.",
    title: "Game-Changing Collaboration",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    metrics: [
      { label: "Content Quality", rating: 5 },
      { label: "Communication", rating: 5 },
      { label: "Professionalism", rating: 5 },
      { label: "Value", rating: 5 }
    ]
  },
  {
    userName: "David Brown",
    date: new Date("2024-02-28"),
    rating: 3,
    description:
      "While Fiona's content quality is good, there were some delays in communication and delivery. The final product was satisfactory but not exceptional.",
    title: "Mixed Experience",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    metrics: [
      { label: "Content Quality", rating: 4 },
      { label: "Communication", rating: 2 },
      { label: "Professionalism", rating: 3 },
      { label: "Value", rating: 3 }
    ]
  }
];

export const mockSocialData = [
  {
    platform: "tiktok",
    followerCount: "1.2M",
    handle: "@fionasun"
  },
  {
    platform: "youtube",
    followerCount: "850K",
    handle: "@fionasun"
  },
  {
    platform: "instagram",
    followerCount: "2.1M",
    handle: "@fionasun"
  }
];

export const mockNewUserSocialData = [
  {
    platform: "tiktok",
    followerCount: "0",
    handle: "@newcreator"
  }
];
