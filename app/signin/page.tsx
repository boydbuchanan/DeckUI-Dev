
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "session";
import SignInOut from "@deckai/client/pages/SignInOut";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function Page() {
  const session = await getAppSession();

  // Forward fetched data to your Client Component
  return <SignInOut
      session={jsonSerializable(session)}
    />
  // return <p>Profile</p>
}
