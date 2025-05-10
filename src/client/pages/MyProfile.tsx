"use client";
import type {
  ContactItemProps,
  ReviewCardProps,
  SocialCardProps
} from "@deckai/deck-ui";
import { AboutCard, ProfileCard, SocialCard, useToast } from "@deckai/deck-ui";
import Me from "@me";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CreatorCallout } from "@deckai/client/features/profile/CreatorCallout";
import { SidebarTab } from "@deckai/client/features/profile/ProfileEditor";
import { ProfileEditor } from "@deckai/client/features/profile/ProfileEditor";
import { WorkSection } from "@deckai/client/features/profile/WorkSection";
import { NewLayout } from "@deckai/client/layout/NewLayout";
import type { MediaInfo, SocialData } from "@deckai/client/types";
import type * as CMS from "@deckai/client/types/cms";
import type { SessionData } from "@deckai/client/types/session";

import { Assets, useSiteRouter } from "@site";

import { ReviewsSection } from "../features/profile/ReviewsSection";
import { profileImage } from "@deckai/client/types/cms";

export function MyProfile({
  session,
  categories,
  user,
  works,
  socialData,
  reviews
}: {
  session: SessionData;
  categories: CMS.Category[];
  user?: CMS.User;
  works?: CMS.Work[];
  socialData?: SocialData[];
  canEditProfile?: boolean;
  reviews?: ReviewCardProps[];
}) {
  const siteRouter = useSiteRouter();
  const [theUser, setTheUser] = useState(user);
  const [avatar, setAvatar] = useState<CMS.Upload | undefined>(
    theUser?.avatar || undefined
  );
  const [userWorks, setWorks] = useState<CMS.Work[] | undefined>(works);
  

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentTab, setCurrentTab] = useState<SidebarTab>(SidebarTab.About);
  const [userInterestIds, setUserInterestIds] = useState<number[]>(
    theUser?.interests?.map((i) => i.id) ?? []
  );
  const userInterests: CMS.Interest[] | undefined = useMemo(
    () =>
      categories
        .flatMap((c) => c.interests)
        .filter((i) => userInterestIds.includes(i.id)),
    [categories, userInterestIds]
  );

  const interests: string[] = useMemo(
    () => userInterests?.map((i) => i.Display) ?? [],
    [userInterests]
  );

  const socialCardsData: SocialCardProps[] = [];

  const contactItems = useMemo<ContactItemProps[]>(() => {
    const items: ContactItemProps[] = [];
    if (!theUser) {
      return items;
    }
    theUser.website &&
      items.push({
        title: theUser.website,
        children: theUser.website,
        href: theUser.website,
        icon: Assets.images.websiteIcon
      });
    theUser.contactEmail &&
      items.push({
        title: theUser.contactEmail,
        children: theUser.contactEmail,
        href: `mailto:${theUser.contactEmail}`,
        icon: Assets.images.emailIcon
      });
    const externalItems: ContactItemProps[] =
      theUser.externalLinks?.map((link) => ({
        icon: link.url.includes("mailto:")
          ? Assets.images.emailIcon
          : Assets.images.websiteIcon,
        title: link.title,
        children: link.title,
        href: link.url
      })) ?? [];
    return items.concat(externalItems);
  }, [theUser]);

  const openEditor = useCallback(
    async (EditProfileTabs: SidebarTab = SidebarTab.About) => {
      setCurrentTab(EditProfileTabs);
      setIsEditingProfile(true);
    },
    [setCurrentTab]
  );

  const handleAddCardClick = useCallback(() => {
    openEditor(SidebarTab.Work);
  }, [openEditor]);

  const handleUserChange = useCallback(
    async () => {
      var cmsMe = await Me.getMe();
      const newMe = cmsMe as CMS.User;
      if (!newMe)
        return;
      
      setTheUser(newMe);
      setUserInterestIds(newMe.interests?.map((i) => i.id) ?? []);
    },
    [setTheUser, setUserInterestIds]
  );
  const handleWorkChange = async () => {
    Me.works()
        .then((fetched) => setWorks(fetched))
        .catch((error) => console.error("Failed to fetch works:", error));
  }

  return (
    <NewLayout
      user={user}
      launchEditMode={() => setIsEditingProfile(true)}
    >
      {session.isLoggedIn && theUser && (
        <div className="mx-auto py-8 w-full">
          <div className="flex flex-col">
            <div className="flex md:flex-row flex-col justify-between pb-8 gap-10">
              <ProfileCard
                profileImage={profileImage(theUser) || undefined}
                name={theUser.displayName}
                location={theUser.location}
                interests={interests}
              />
              <div className="flex flex-col gap-10 max-w-full">
                {!socialCardsData.length ? (
                  <CreatorCallout onClick={() => siteRouter.creator()} />
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
              description={theUser.aboutMe}
            />
            <ReviewsSection reviews={reviews} className="mt-10" />
          </div>
          <div className="flex flex-col mt-10">
            <WorkSection
              works={userWorks}
              launchEditMode={handleAddCardClick}
            />
          </div>
          <ProfileEditor
            open={isEditingProfile}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            onClose={() => setIsEditingProfile(false)}
            user={theUser}
            avatarUrl={avatar?.url}
            onUserUpdate={handleUserChange}
            onWorkUpdate={handleWorkChange}
            
          />
        </div>
      )}
    </NewLayout>
  );
}

export default MyProfile;
