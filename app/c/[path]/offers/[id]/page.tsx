
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import { Offer, OfferState, OfferType, User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import ViewOffer from "@deckai/client/pages/Offers/ViewOffer";
import { offersEnabled } from "@server";
import { isOfferExpired } from "@deckai/client";
import ViewMyOffer from "@deckai/client/pages/Offers/ViewMyOffer";
import PrivateOffer from "@deckai/client/pages/Offers/PrivateOffer";

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
  const { path, id } = await params;

  let me: User | undefined = undefined;
  let isSignedIn: boolean = false;
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
      isSignedIn = me !== undefined;
    }

    var userResponse = await CmsApi.getUserByUrl(path);
    if(userResponse && userResponse.data) {
      creator = userResponse.data[0] as User;
    }

    var cmsOffer = await CmsApi.getOffer(id);
    
    offer = cmsOffer?.data ?? undefined;
    
  } catch (error) {
    console.error("Error fetching data", error);
  }

  var redirectTo = isSignedIn ? ServerConfig.links.offers : ServerConfig.links.explore;
  
  if(!creator || !offer) {
    return redirect(redirectTo);
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

  if(offer.Type === OfferType.Template) {
    return redirect(redirectTo);
  }

  if(offer.State !== OfferState.Enabled){
    return <PrivateOffer
      session={jsonSerializable(session)}
      creator={jsonSerializable(creator)}
      />
  }

  if((offer.ForEmail || offer.Type === OfferType.Private) && (!session.Auth || !me || offer.ForEmail !== me.email)) {
    return <PrivateOffer
      session={jsonSerializable(session)}
      creator={jsonSerializable(creator)}
      />
  }

  // if not signed in redirect to sign in page
  // if (!session.Auth) {
  //   return redirect(ServerConfig.links.signIn);
  // }

  // Forward fetched data to your Client Component
  return <ViewOffer
    session={jsonSerializable(session)}
    creator={jsonSerializable(creator)}
    offer={jsonSerializable(offer)}
    isAvailable={isAvailable}
  />
  // return <p>Profile</p>
}
