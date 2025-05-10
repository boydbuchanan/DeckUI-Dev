
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";
import Creator from "@deckai/client/pages/Creator";
import { User } from "@deckai/client/types/cms";
import { CmsApi } from "@api/cms";
import Stripe from "stripe";

const stripe = ServerConfig.STRIPE_SECRET_KEY && new Stripe(ServerConfig.STRIPE_SECRET_KEY);

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Creator Settings',
}

export default async function Page() {
  const session = await getAppSession();

  let user: User | undefined = undefined;
  let stripeAccount: Stripe.Account | null = null;
  
  try {
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      user = cmsUser?.data ?? undefined;
    }
    if(user && user.stripeConnectedAccountId && stripe) {
      const account = await stripe.accounts.retrieve(user.stripeConnectedAccountId);
      stripeAccount = account;
    }

  } catch (error) {
    console.error("Error fetching data", error);
  }
  

  // if not signed in redirect to sign in page
  if (!session.Auth) {
    return redirect(ServerConfig.links.signIn);
  }
  

  // Forward fetched data to your Client Component
  return <Creator
      session={jsonSerializable(session)}
      currentUser={jsonSerializable(user)}
      stripeAccount={jsonSerializable(stripeAccount)}
    />
  // return <p>Profile</p>
}
