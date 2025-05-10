
import { Metadata } from "next";
import { CmsApi } from "@api/cms";
import * as CMS from "@deckai/client/types/cms";
import { jsonSerializable } from "@deckai/client/utils";
import { MyProfile } from "@deckai/client/pages/MyProfile";
import { getAppSession } from "session";
import { redirect } from "next/navigation";
import { ServerConfig } from "@server/config";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'My Profile',
}

export default async function Page() {
  const session = await getAppSession();

  let user: CMS.User | undefined = undefined;

  if(!session.Auth || !session.Auth.user) {
    redirect("/");
  }

  try {
    if (session.Auth && session.Auth.user) {
      var userId = session.Auth.user.id;
      const cmsUser = await CmsApi.getUser(userId, true);
      user = cmsUser?.data ?? undefined;
    }

  } catch (error) {
    console.error("Error fetching data", error);
  }

  // redirect to user url

  if(user){
    redirect(ServerConfig.links.userProfilePath(user));
  }else {
    redirect(ServerConfig.links.home);
  }

  return <p>Profile</p>
}