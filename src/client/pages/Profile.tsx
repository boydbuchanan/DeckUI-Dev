"use client";
import type {
  ContactItemProps,
  ReviewCardProps,
  SocialCardProps
} from "@deckai/deck-ui";
import { AboutCard, ProfileCard, SocialCard, useToast } from "@deckai/deck-ui";
import { useCallback, useMemo, useState } from "react";

import { BuyerCallout } from "@deckai/client/features/profile/BuyerCallout";
import { WorkSection } from "@deckai/client/features/profile/WorkSection";
import { NewLayout } from "@deckai/client/layout/NewLayout";
import type { MediaInfo, SocialData } from "@deckai/client/types";
import type * as CMS from "@deckai/client/types/cms";
import type { SessionData } from "@deckai/client/types/session";
import { Assets } from "@site";

import { ReviewsSection } from "@deckai/client/features/profile/ReviewsSection";

export function Profile({
  session,
  user,
  works,
  socialData,
  reviews
}: {
  session: SessionData;
  user?: CMS.User;
  works?: CMS.Work[];
  socialData?: SocialData[];
  reviews?: ReviewCardProps[];
}) {
  const { show } = useToast();

  
  const interests: string[] = useMemo(
    () => user?.interests?.map((i) => i.Display) ?? [],
    [user]
  );

  const socialCardsData: SocialCardProps[] = useMemo(() => {
    var socialCards: SocialCardProps[] = [];
    var showSocials = socialData && socialData.length > 0;

    if (showSocials) {
      var tiktokData = socialData?.find((s) => s.platform === "tiktok");
      socialCards.push({
        icon: "tiktok-filled",
        followers: tiktokData?.followerCount ?? "0",
        engagement: tiktokData?.handle ?? ""
      });
    }
    if (showSocials) {
      var youtubeData = socialData?.find((s) => s.platform === "youtube");
      socialCards.push({
        icon: "youtube-filled",
        followers: youtubeData?.followerCount ?? "0",
        engagement: youtubeData?.handle ?? ""
      });
    }
    if (showSocials) {
      var instagramData = socialData?.find((s) => s.platform === "instagram");
      socialCards.push({
        icon: "instagram-filled",
        followers: instagramData?.followerCount ?? "0",
        engagement: instagramData?.handle ?? ""
      });
    }
    return socialCards;
  }, [socialData]);

  const contactItems = useMemo<ContactItemProps[]>(() => {
    const items: ContactItemProps[] = [];
    if (!user) {
      return items;
    }
    user.website &&
      items.push({
        title: user.website,
        children: user.website,
        href: user.website,
        icon: Assets.images.websiteIcon
      });
    user.contactEmail &&
      items.push({
        title: user.contactEmail,
        children: user.contactEmail,
        href: `mailto:${user.contactEmail}`,
        icon: Assets.images.emailIcon
      });
    const externalItems: ContactItemProps[] =
      user.externalLinks?.map((link) => ({
        icon: link.url.includes("mailto:")
          ? Assets.images.emailIcon
          : Assets.images.websiteIcon,
        title: link.title,
        children: link.title,
        href: link.url
      })) ?? [];
    return items.concat(externalItems);
  }, [user]);

  return (
    <NewLayout
      user={session.Auth?.user ?? undefined}
    >
      {user && (
        <div className="mx-auto py-8 w-full">
          <div className="flex flex-col">
            <div className="flex md:flex-row flex-col justify-between pb-8 gap-10">
              <ProfileCard
                profileImage={user.avatar?.url ?? ""}
                name={user.displayName}
                location={user.location}
                interests={interests}
              />
              <div className="flex flex-col gap-10 max-w-full">
                {!socialCardsData.length ? (
                  <BuyerCallout onClick={() => {}} />
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-1 gap-4 w-full sm:w-1/2 items-end">
                    {socialCardsData.map((socialCard, index) => (
                      <SocialCard
                        key={`social-card-${index}`}
                        {...socialCard}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <AboutCard
              contactItems={contactItems}
              description={user.aboutMe}
            />
            <ReviewsSection reviews={reviews} className="mt-10" />
          </div>
          <div className="flex flex-col mt-10">
            <WorkSection works={works} />
          </div>
        </div>
      )}
    </NewLayout>
  );
}

export default Profile;
