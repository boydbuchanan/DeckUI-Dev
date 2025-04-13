"use client";
import type {
  ContactItemProps,
  ReviewCardProps,
  SocialCardProps
} from "@deckai/deck-ui";
import { AboutCard, ProfileCard, SocialCard, useToast } from "@deckai/deck-ui";
import Me from "@me";
import { useCallback, useMemo, useState } from "react";

import { CreatorCallout } from "@deckai/client/features/profile/CreatorCallout";
import type { EditProfileTabs } from "@deckai/client/features/profile/ProfileEditor";
import { ProfileEditor } from "@deckai/client/features/profile/ProfileEditor";
import { WorkSection } from "@deckai/client/features/profile/WorkSection";
import { NewLayout } from "@deckai/client/layout/NewLayout";
import type { MediaInfo, SocialData } from "@deckai/client/types";
import type * as CMS from "@deckai/client/types/cms";
import type { SessionData } from "@deckai/client/types/session";

import { Assets } from "@site";

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
  const { show } = useToast();
  const [theUser, setTheUser] = useState(user);
  const [avatar, setAvatar] = useState<CMS.Upload | undefined>(
    theUser?.avatar || undefined
  );

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentTab, setCurrentTab] = useState<EditProfileTabs>("about");
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

  const handleProfileSave = useCallback(
    async (updateData: Partial<CMS.UpdateUser>) => {
      try {
        var updateints =
          updateData.interests ?? theUser?.interests?.map((i) => i.id) ?? [];

        setUserInterestIds(updateints);
        var meResponse = await Me.updateMe(updateData);
        var newMe = meResponse.data as CMS.User;
        if (meResponse.status !== 200) {
          console.error("Failed to update profile", meResponse);
          show({
            message: "Failed to save changes",
            variant: "error"
          });
          return;
        }
        
        setTheUser(newMe);
        show({
          message: "Changes saved successfully",
          variant: "success"
        });
      } catch (error) {
        console.error("Failed to save changes:", error);
        show({
          message: "Failed to save changes",
          variant: "error"
        });
      }
    },
    [show]
  );
  const openEditor = useCallback(
    async (EditProfileTabs: EditProfileTabs = "about") => {
      setCurrentTab(EditProfileTabs);
      setIsEditingProfile(true);
    },
    [setCurrentTab]
  );

  const handleAddCardClick = useCallback(() => {
    openEditor("work");
  }, [openEditor]);

  const handleAvatarUpload = useCallback(
    async (blob: Blob, src: string | undefined) => {
      try {
        const uploadResponse = await Me.uploadUserAvatar(
          blob,
          theUser!,
          avatar
        );

        if (uploadResponse.status === 200) {
          const upload = uploadResponse.data as CMS.Upload;
          setAvatar(upload);
          show({
            message: "Avatar updated successfully",
            variant: "success"
          });
        }
      } catch (error) {
        show({
          message: "Failed to update avatar",
          variant: "error"
        });
      }
    },
    [user?.id, avatar, show]
  );

  const handleWorkContentUpload = async (
    work: CMS.Work,
    contentSize: MediaInfo,
    contentFile: File
  ) => {
    var contentUpload = work.Content;
    var contentUploadId = contentUpload?.id || undefined;
    if (contentUploadId) {
      try {
        console.log("Delete Previous Content", contentUploadId);
        var deleteResponse = await Me.deleteUpload(contentUploadId);
        if (deleteResponse.status === 200) {
          console.log("Content Deleted", deleteResponse);
        } else {
          console.error("Failed to delete content", deleteResponse);
          return false;
        }
      } catch (error) {
        console.warn("Failed to delete content", error);
        return false;
      }
    }
    console.log("Uploading Content File", contentFile);
    var ext = contentFile.name.split(".").pop();
    // Always upload a new file to get the correct mime type and dimensions
    var contentfileData = {
      height: contentSize.height,
      width: contentSize.width,
      ext
    };
    try {
      var contentUploadResponse = await Me.uploadWorkContent(
        contentFile,
        work,
        contentUploadId,
        contentfileData
      );
      if (contentUploadResponse.status === 200) {
        console.log("Content Uploaded", contentUploadResponse);
        return true;
      }
    } catch (error) {
      console.error("Failed to upload content", error);
      return false;
    }
    return false;
  };

  const handleWorkCoverUpload = async (
    work: CMS.Work,
    contentSize: MediaInfo,
    blob: Blob,
    coverFile?: File
  ) => {
    var coverUpload = work.DisplayImage;
    var coverUploadId = coverUpload?.id || undefined;
    var ext = (coverFile && coverFile.name.split(".").pop()) || undefined;
    var coverfileData = {
      height: contentSize.height,
      width: contentSize.width,
      ext
    };
    try {
      var coverUploadResponse = await Me.uploadWorkCover(
        blob,
        work,
        coverUploadId,
        coverfileData
      );
      if (coverUploadResponse.status === 200) {
        console.log("Cover Image Uploaded", coverUploadResponse);
        return true;
      }
    } catch (error) {
      console.warn("Cover Image Upload Failed", error);
    }
    return false;
  };

  const handleSaveWork = async (
    documentId?: string | undefined,
    workProperties?: CMS.UpdateWork
  ) => {
    try {
      var response;
      if (!documentId) {
        response = await Me.newWorkWith(workProperties);
        var work = response.data as CMS.Work;
        documentId = work.documentId;
      } else {
        response = await Me.updateMyWork(documentId, workProperties);
      }

      if (response.status === 200 || response.status === 201) {
        console.log("Work updated", response);
        return response.data as CMS.Work;
      } else {
        console.error("Failed to update work", response);
        alert("Failed to update work");
        return null;
      }
    } catch (error) {
      console.error("Failed to save work", error);
    }
    return null;
  };

  return (
    <NewLayout
      user={session.Auth?.user ?? undefined}
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
                  <CreatorCallout onClick={() => {}} />
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
              works={works}
              launchEditMode={handleAddCardClick}
            />
          </div>
          <ProfileEditor
            open={isEditingProfile}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            categories={categories}
            userInterests={userInterests}
            onClose={() => setIsEditingProfile(false)}
            user={theUser}
            avatarUrl={avatar?.url}
            works={works}
            handleAvatarUpload={handleAvatarUpload}
            handleContentUpload={handleWorkContentUpload}
            handleCoverUpload={handleWorkCoverUpload}
            handleSave={handleProfileSave}
            handleSaveWork={handleSaveWork}
          />
        </div>
      )}
    </NewLayout>
  );
}

export default MyProfile;
