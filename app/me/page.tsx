
import { Metadata } from "next";
import { CmsApi } from "@api/cms";
import * as CMS from "@deckai/client/types/cms";
import { jsonSerializable } from "@deckai/client/utils";
import { MyProfile } from "@deckai/client/pages/MyProfile";
import { getAppSession } from "../session";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'My Profile',
}

const mockProfileReviews = [
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

export default async function Page() {
  const session = await getAppSession();

  let categories: CMS.Category[] = [];
  let works: CMS.Work[] = [];
  let user: CMS.User | undefined = undefined;

  try {
    categories = await CmsApi.getCategories();
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      user = cmsUser?.data ?? undefined;
      
      const workResponse = await CmsApi.getWorks(userId);
      works = workResponse.data as CMS.Work[] || [];
    }

  } catch (error) {
    console.error("Error fetching data", error);
  }

  // Forward fetched data to your Client Component
  return <MyProfile
      session={jsonSerializable(session)}
      categories={jsonSerializable(categories)}
      user={jsonSerializable(user)}
      works={jsonSerializable(works)}
      canEditProfile={true}
      reviews={mockProfileReviews}
    />
  // return <p>Profile</p>
}
