
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import { Offer, User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import ViewOffer from "@deckai/client/pages/Offers/ViewOffer";
import { offersEnabled } from "@server";
import { isOfferExpired } from "@deckai/client";
import ViewMyOffer from "@deckai/client/pages/Offers/ViewMyOffer";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Offer Details',
}

export default async function Page({
  params
}: {
  params: Promise<{ path: string, id: string }>;
}) {
  const session = await getAppSession();
  const { id } = await params;

  let me: User | undefined = undefined;
  let canMakeOffers: boolean = false;

  let creator: User | undefined = undefined;
  let offer: Offer | undefined = undefined;
  let isAvailable: boolean = false;
  
  try {
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      me = cmsUser?.data ?? undefined;
      if(cmsUser && cmsUser.data) {
        me = cmsUser.data as User;
      }
    }
    var cmsOffer = await CmsApi.getOffer(id);
    
    offer = cmsOffer?.data ?? undefined;
    creator = offer?.creator as User || creator;
    
  } catch (error) {
    console.error("Error fetching data", error);
  }
  
  if(!creator) {
    return redirect(ServerConfig.links.explore);
  }
  
  if(!offer) {
    return redirect(ServerConfig.links.myProfile);
  }

  // if not signed in redirect to sign in page
  if (!session.Auth) {
    return redirect(ServerConfig.links.signIn);
  }

  isAvailable = offersEnabled(creator) && !isOfferExpired(offer);

  if(me && me.id === creator.id) {
    canMakeOffers = offersEnabled(me);
    return <ViewMyOffer
      session={jsonSerializable(session)}
      creator={jsonSerializable(creator)}
      offer={jsonSerializable(offer)}
      isAvailable={isAvailable} 
      canMakeOffers={canMakeOffers}
      />
  }

  // Forward fetched data to your Client Component
  return <ViewOffer
      session={jsonSerializable(session)}
      creator={jsonSerializable(creator)}
      offer={jsonSerializable(offer)}
      isAvailable={isAvailable}
    />
  // return <p>Profile</p>
}
