
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import { Offer, Order, User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import Orders from "@deckai/client/pages/Creator/Orders";
import Offers from "@deckai/client/pages/Creator/Offers";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'My Orders',
}

export default async function Page() {
  const session = await getAppSession();

  let me: User | undefined = undefined;
  let myOrders: Order[] = [];
  
  try {
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      me = cmsUser?.data ?? undefined;
      if(cmsUser && cmsUser.data) {
        me = cmsUser.data as User;
        const workResponse = await CmsApi.getOrders(me.id);
        myOrders = workResponse.data as Order[] || [];
      }

      if(!me) {
        return redirect(ServerConfig.links.signIn);
      }

    }

  } catch (error) {
    console.error("Error fetching data", error);
  }
  

  // if not signed in redirect to sign in page
  if (!session.Auth) {
    return redirect(ServerConfig.links.signIn);
  }

  // Forward fetched data to your Client Component
  return <Orders
      session={jsonSerializable(session)}
      user={jsonSerializable(me)}
      orders={jsonSerializable(myOrders)}
    />
  // return <p>Profile</p>
}
