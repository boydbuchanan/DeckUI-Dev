
import { Metadata } from "next";
import { capitalizeFirstLetter, jsonSerializable } from "@deckai/client/utils";
import { getAppSession } from "../../session";
import Explore from "@deckai/client/pages/Explore";
import { CreatorCardProps } from "@deckai/deck-ui";
import { CmsApi } from "@api/cms";
import { Category } from "@deckai/client/types/cms";

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: 'Explore Creators',
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ i: string[] }>;
}) {
  const { category } = await params;
  const { i } = await searchParams;
  const session = await getAppSession();
  let mainCategory: Category | null = null;
  let selected: string[] = [];

  try {
    mainCategory = await CmsApi.getCategoryByUrl(category);
    
  }
  catch (error) {
    console.error("Error fetching data", error);
  }
  // cast i to array
  selected = i;
  if(!Array.isArray(i)) {
    selected = [i];
  }
  return <Explore
      session={jsonSerializable(session)}
      interests={jsonSerializable(mainCategory?.interests)}
      category={jsonSerializable(mainCategory)}
      selected={selected}
      page={1}
    />
}
