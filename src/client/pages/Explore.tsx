"use client";

import type { CreatorCardProps } from "@deckai/deck-ui";
import { CreatorCard, Icon, Tag, Text } from "@deckai/deck-ui";
import { useCallback, useMemo, useRef, useState } from "react";

import { Footer } from "@deckai/client/layout/Footer";
import { NewLayout } from "@deckai/client/layout/NewLayout";
import type { SessionData } from "@deckai/client/types/session";
import { useSiteRouter } from "@site";
import Creators from "@deckai/client/features/search/Creators";
import { Category, Interest } from "@deckai/client/types/cms";

export default function Explore({
  session,
  interests,
  category,
  selected,
  page
}: {
  session: SessionData;
  interests: Interest[] | undefined;
  category: Category | undefined;
  selected?: string[];
  page?: number;
}) {
  const Router = useSiteRouter();
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [totalResults, setTotalResults] = useState(0);

  // Handle interest tag selection/deselection
  const handleInterestToggle = (interest: string) => {
    if(!selected)
      Router.explore(category?.Url, [interest], page);
    else {
      var selectedInterests = selected.includes(interest) ? selected.filter((i) => i !== interest) : [...selected, interest]
      
      Router.explore(category?.Url, selectedInterests, page);
    }
  };

  return (
    <NewLayout
      user={session.Auth?.user ?? undefined}
      contentClassName="!px-0"
      className="bg-background-0"
    >
      <div className="px-6 md:px-10 py-6">
        <Text variant="heading-lg" className="mb-2">
          Explore Creators
        </Text>
        {/* populate this from backend */}
        {category && (
          <Text variant="body-lg-semibold" color="secondary" className="mb-6">
            related to {category.Display}
          </Text>
        )}

        {/* Horizontally scrollable tag filters */}
        <div className="relative mb-8">
          {/* Tags container with horizontal scroll and fade effect */}
          <div className="relative">
            <div
              ref={tagsContainerRef}
              className="flex flex-wrap gap-2 overflow-x-auto py-2 scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */
              }}
            >
              {interests && interests.map((interest) => {
                const isSelected = selected && selected.includes(interest.Url);
                return (
                  <Tag
                    key={interest.Url}
                    backgroundColor={isSelected ? "black" : "disabled"}
                    onClick={() => handleInterestToggle(interest.Url)}
                    className="cursor-pointer whitespace-nowrap"
                    onClose={
                      isSelected
                        ? () => handleInterestToggle(interest.Url)
                        : undefined
                    }
                  >
                    {interest.Display}
                  </Tag>
                );
              })}
            </div>
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-background-0 pointer-events-none"></div>
          </div>
        </div>
        
        {/* Results Count */}
        <Text variant="body-md" className="mb-4">
            {totalResults}{" "}
            {totalResults === 1 ? "creator" : "creators"} found
        </Text>

        {/* Creator Grid */}
        <div className="flex flex-wrap md:gap-6 gap-2">
          <Creators
            category={category?.Url}
            interests={selected}
            currentPage={page}
            onSearch={(total) => {
              console.log(`Found ${total} creators`);
              setTotalResults(total);
            }}
          />
        </div>
        {totalResults > 0 && (
            <Text
                variant="body-default-bold"
                color="secondary"
                className="text-center underline cursor-pointer pt-8"
            >
                See More
            </Text>
        ) || (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <Icon
                name="search-status"
                size={64}
                className="mb-4 text-gray-400"
            />
            <Text variant="heading-sm">No creators found</Text>
            <Text variant="body-md" color="secondary" className="mb-4">
                Try adjusting your filters
            </Text>
          </div>
        )}
      </div>
      <Footer />
    </NewLayout>
  );
}
