
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import { Offer, User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import ViewOffer from "@deckai/client/pages/Offers/ViewOffer";
import OrderSuccess from "@deckai/client/pages/Offers/OrderSuccess";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Order Success',
}

export default async function Page({
  params
}: {
  params: Promise<{ path: string, id: string }>;
}) {
  const session = await getAppSession();
  const { path, id } = await params;

  let user: User | undefined = undefined;
  let offer: Offer | undefined = undefined;
  
  try {
    var userResponse = await CmsApi.getUserByUrl(path);
    if(userResponse && userResponse.data) {
      user = userResponse.data[0] as User;
    }    

    if(!user) {
      return redirect(ServerConfig.links.explore);
    }

    var cmsOffer = await CmsApi.getOffer(id);
    
    offer = cmsOffer?.data ?? undefined;
    if(!offer) {
      return redirect(ServerConfig.links.myProfile);
    }

  } catch (error) {
    console.error("Error fetching data", error);
  }
  

  // if not signed in redirect to sign in page
  if (!session.Auth) {
    return redirect(ServerConfig.links.signIn);
  }

  // Forward fetched data to your Client Component
  return <OrderSuccess
      session={jsonSerializable(session)}
      offer={jsonSerializable(offer)}
    />
  // return <p>Profile</p>
}
