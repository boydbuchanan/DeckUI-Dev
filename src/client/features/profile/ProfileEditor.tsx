import * as CMS from "@deckai/client/types/cms";
import { IconProps, Sidebar, Tabs, Button, useToast } from "@deckai/deck-ui";
import type { TabsProps } from "@deckai/deck-ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditAbout } from "./EditAbout";
import { EditContact } from "./EditContact";
import { EditServices } from "./EditServices";
import { EditWork } from "./EditWork";
import { EditWorkSidebar } from "./EditWorkSidebar";
import { MediaInfo } from "@deckai/client/types";
import Api from "@api";
import Me from "@me";

type SocialLink = {
  platform: IconProps["name"];
  url?: string;
  enabled?: boolean;
  handle: string;
};

export type EditProfileData = {
  name: string;
  location: string;
  interests: string[];
  socialLinks: SocialLink[];
  bio: string;
};

export enum SidebarTab { 
  About= "about",
  Contact = "contact",
  Services = "services",
  Work = "work"
}

type EditProfileProps = {
  open?: boolean;
  onClose: () => void;
  currentTab?: SidebarTab;
  setCurrentTab: (tab: SidebarTab) => void;
  user: CMS.User;
  avatarUrl?: string;
  onUserUpdate?: () => void;
  onWorkUpdate?: () => void;
};

// Create refs to store update functions
export type TabUpdateFunction = () => Promise<void>;

export const ProfileEditor = ({
  open = true,
  onClose,
  currentTab,
  user,
  avatarUrl,
  setCurrentTab,
  onUserUpdate,
  onWorkUpdate
}: EditProfileProps) => {
  const [theUser, setTheUser] = useState(user);
  const [avatar, setAvatar] = useState<CMS.Upload | undefined>(user?.avatar || undefined);

  const [fetchCategories, setFetchCategories] = useState<CMS.Category[]>([]);

  useEffect(() => {
    if(!open) return;

    if (!fetchCategories || fetchCategories.length === 0) {
      
      Api.categories()
        .then((fetched) => setFetchCategories(fetched))
        .catch((error) => console.error("Failed to fetch categories:", error));
    }
  }, [fetchCategories, open]);

  const userInterestIds = useMemo(() => {
      return user?.interests?.map((i) => i.id) ?? [];
    }, [user, user?.interests, open]);


  const userInterests: CMS.Interest[] | undefined = useMemo(
    () =>
      fetchCategories
        ?.flatMap((c) => c.interests)
        ?.filter((i) => userInterestIds.includes(i.id)),
    [fetchCategories, userInterestIds]
  );
  
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
          onUserUpdate?.();
        }
      } catch (error) {
        console.error("Failed to update avatar", error);
      }
    },
    [theUser?.id, avatar]
  );
  const handleProfileSave = useCallback(
    async (updateData: Partial<CMS.UpdateUser>) => {
      try {

        var meResponse = await Me.updateMe(updateData);
        var newMe = meResponse.data as CMS.User;
        if (meResponse.status !== 200) {
          console.error("Failed to update profile", meResponse);
          return;
        }
        onUserUpdate?.();
        setTheUser(newMe);
      } catch (error) {
        console.error("Failed to save changes:", error);
      }
    },
    [theUser]
  );
    

  const tabs: TabsProps["items"] = useMemo(
    () => [
      {
        label: "About",
        value: SidebarTab.About,
        content: (
          <EditAbout
            categories={fetchCategories}
            userInterests={userInterests}
            user={user}
            avatarUrl={avatarUrl}
            setCurrentTab={setCurrentTab}
            handleAvatarUpload={handleAvatarUpload}
            handleSave={handleProfileSave}
          />
        )
      },
      {
        label: "Contact",
        value: SidebarTab.Contact,
        content: (
          <EditContact
            setCurrentTab={setCurrentTab}
            onSave={handleProfileSave}
            user={user}
          />
        )
      },
      {
        label: "Work",
        value: SidebarTab.Work,
        content: (
          <EditWork
            userInterests={userInterests}
            categories={fetchCategories}
            onWorkUpdate={onWorkUpdate}
          />
        )
      },
      {
        label: "Services",
        value: SidebarTab.Services,
        content: <EditServices />
      }
    ],
    [userInterests, fetchCategories, user]
  );

  return (
    <Sidebar open={open} onClose={onClose} title="Edit Profile" className="pb-10">
      <div className="h-full overflow-y-auto pb-10">
        <Tabs
          key={currentTab}
          variant="segmented"
          items={tabs}
          defaultValue={currentTab || SidebarTab.About}
          onChange={(value) => setCurrentTab(value as SidebarTab)}
        />
      </div>
      
    </Sidebar>
  );
};
