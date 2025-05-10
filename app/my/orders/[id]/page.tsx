
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import { Offer, Order, User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import ViewOrder from "@deckai/client/pages/Offers/ViewOrder";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Order Details',
}

export default async function Page({
  params
}: {
  params: Promise<{ path: string, id: string }>;
}) {
  const session = await getAppSession();
  const { path, id } = await params;

  let me: User | undefined = undefined;
  let order: Order | undefined = undefined;
  
  try {
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      me = cmsUser?.data ?? undefined;
    }

    if(!me) {
      return redirect(ServerConfig.links.explore);
    }

    var cmsOffer = await CmsApi.getOrder(id);
    
    order = cmsOffer?.data ?? undefined;
    if(!order) {
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
  return <ViewOrder
      session={jsonSerializable(session)}
      order={jsonSerializable(order)}
    />
  // return <p>Profile</p>
}
