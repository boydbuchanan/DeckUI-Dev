
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "../session";
// import Offer from "(TempLayout)/pages/Offer";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Offer Details',
}


export default async function Page() {
  const session = await getAppSession();

  try {
    

  } catch (error) {
    console.error("Error fetching data", error);
  }

  // Forward fetched data to your Client Component
  // return <Offer
  //     session={jsonSerializable(session)}
  //   />
  // return <p>Profile</p>
  return <p>Offer</p>
}
