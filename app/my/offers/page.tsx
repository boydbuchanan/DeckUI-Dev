
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import { Offer, User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import Orders from "@deckai/client/pages/Creator/Orders";
import Offers from "@deckai/client/pages/Creator/Offers";
import { offersEnabled } from "@server/index";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'My Offers',
}

export default async function Page() {
  const session = await getAppSession();

  let me: User | undefined = undefined;
  let myOffers: Offer[] = [];
  let canMakeOffers: boolean = false;
  
  try {
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      me = cmsUser?.data ?? undefined;
      if(cmsUser && cmsUser.data) {
        me = cmsUser.data as User;
        const cmsOffers = await CmsApi.getOffers(me.id);
        myOffers = cmsOffers.data as Offer[] || [];
      }


    }

  } catch (error) {
    console.error("Error fetching data", error);
  }
  // if not signed in redirect to sign in page
  if (!session.Auth) {
    return redirect(ServerConfig.links.signIn);
  }
  
  if(!me) {
    return redirect(ServerConfig.links.signIn);
  }

  canMakeOffers = offersEnabled(me);

  // Forward fetched data to your Client Component
  return <Offers
      session={jsonSerializable(session)}
      creator={jsonSerializable(me)}
      offers={jsonSerializable(myOffers)}
      canMakeOffers={canMakeOffers}
    />
  // return <p>Profile</p>
}
