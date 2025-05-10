
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import { Offer, User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import Orders from "@deckai/client/pages/Creator/Orders";
import Offers from "@deckai/client/pages/Creator/Offers";
import ViewOffers from "@deckai/client/pages/Offers/ViewOffers";
import { offersEnabled } from "@server";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Creator Offers',
}

export default async function Page({
  params
}: {
  params: Promise<{ path: string }>;
}) {
  const session = await getAppSession();
  const { path } = await params;

  let creator: User | undefined = undefined;
  let offers: Offer[] = [];
  let me: User | undefined = undefined;
  
  try {
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      me = cmsUser?.data ?? undefined;
      if(cmsUser && cmsUser.data) {
        me = cmsUser.data as User;
      }
    }

    var userResponse = await CmsApi.getUserByUrl(path);
    if(userResponse && userResponse.data) {
      creator = userResponse.data[0] as User;
    }

  } catch (error) {
    console.error("Error fetching data", error);
  }
  
  if(!creator) {
    return redirect(ServerConfig.links.explore);
  }
  
  const cmsOffers = await CmsApi.getPublicOffers(creator.id);
  offers = cmsOffers.data as Offer[] || [];

  if(me && me.id === creator.id) {
    return <Offers
      session={jsonSerializable(session)}
      creator={jsonSerializable(creator)}
      canMakeOffers={offersEnabled(me)}
      offers={jsonSerializable(offers)}
    />
  }
  
  // Forward fetched data to your Client Component
  return <ViewOffers
      session={jsonSerializable(session)}
      creator={jsonSerializable(creator)}
      offers={jsonSerializable(offers)}
      canRequestOffers={offersEnabled(creator)}
    />
  // return <p>Profile</p>
}
