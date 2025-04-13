
import { Metadata } from "next";
import { jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "../session";
import Explore from "@deckai/client/pages/Explore";
import { redirect } from "next/navigation";

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

  redirect("/");
}
