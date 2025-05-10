
import { Metadata } from "next";

import { getAppSession } from "session";
import Home from "@deckai/client/pages/Home";
import { CreatorCardProps } from "@deckai/deck-ui";
import { TileProps } from "@deckai/client/features/home/TileGrid";
import { jsonSerializable } from "@deckai/client/utils";
import { CmsApi } from "@api/cms";
import { Category, User } from "@deckai/client/types/cms";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Deck',
}

export default async function Page() {
  const session = await getAppSession();
  let categories: Category[] = [];

  try {
    categories = await CmsApi.getCategories();
  }

  catch (error) {
    console.error("Error fetching data", error);
  }

  // Forward fetched data to your Client Component
  return <Home
      session={jsonSerializable(session)}
      categories={jsonSerializable(categories)}
    />
  // return <p>Profile</p>
}
