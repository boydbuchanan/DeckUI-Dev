import * as CMS from "@deckai/client/types/cms";
import { IconProps, Sidebar, Tabs, Button, useToast } from "@deckai/deck-ui";
import type { TabsProps } from "@deckai/deck-ui";
import { useCallback, useMemo, useRef, useState } from "react";
import { EditAbout } from "./EditAbout";
import { EditContact } from "./EditContact";
import { EditServices } from "./EditServices";
import { EditWork } from "./EditWork";
import { EditWorkSidebar } from "./EditWorkSidebar";
import { MediaInfo } from "@deckai/client/types";

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

export type EditProfileTabs = "about" | "contact" | "services" | "work";

type EditProfileProps = {
  categories: CMS.Category[];
  userInterests: CMS.Interest[];
  open?: boolean;
  onClose: () => void;
  currentTab?: EditProfileTabs;
  setCurrentTab: (tab: EditProfileTabs) => void;
  user: CMS.User;
  avatarUrl?: string;
  works?: CMS.Work[];
  handleAvatarUpload: (blob: Blob, src: string | undefined) => Promise<void>;
  handleContentUpload: (
    work: CMS.Work,
    contentSize: MediaInfo,
    contentFile: File
  ) => Promise<boolean>;
  handleCoverUpload: (
    work: CMS.Work,
    contentSize: MediaInfo,
    blob: Blob,
    coverFile?: File
  ) => Promise<boolean>;
  handleSave: (data: Partial<CMS.UpdateUser>) => void;
  handleSaveWork: (
    documentId?: string | undefined,
    workProperties?: CMS.UpdateWork
  ) => Promise<CMS.Work | null>;
};

// Create refs to store update functions
export type TabUpdateFunction = () => Promise<void>;

export const ProfileEditor = ({
  categories,
  userInterests,
  open = true,
  onClose,
  currentTab,
  user,
  avatarUrl,
  setCurrentTab,
  works,
  handleAvatarUpload,
  handleContentUpload,
  handleCoverUpload,
  handleSave,
  handleSaveWork
}: EditProfileProps) => {
  const [editWork, setEditWork] = useState<CMS.Work | undefined>(undefined);
  const [isUploadSidebarOpen, setIsUploadSidebarOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<CMS.Interest | null>(
    null
  );
  const handleSidebarClose = useCallback(() => {
    setIsUploadSidebarOpen(false);
    setSelectedInterest(null);
  }, []);

  const handleWorkClick = (work: CMS.Work) => {
    setEditWork(work);
    setSelectedInterest(work.interest || null);
    setIsUploadSidebarOpen(true);
  };
  // const handleAddWorkClick = useCallback((interest?: CMS.Interest) => {
  const handleAddWorkClick = (interest?: CMS.Interest) => {
    console.log("Add work clicked for interest", interest);
    setEditWork(undefined);
    setSelectedInterest(interest || null);
    setIsUploadSidebarOpen(true);
  };

  const tabs: TabsProps["items"] = useMemo(
    () => [
      {
        label: "About",
        value: "about",
        content: (
          <EditAbout
            categories={categories}
            userInterests={userInterests}
            user={user}
            avatarUrl={avatarUrl}
            setCurrentTab={setCurrentTab}
            handleAvatarUpload={handleAvatarUpload}
            handleSave={handleSave}
          />
        )
      },
      {
        label: "Contact",
        value: "contact",
        content: (
          <EditContact
            setCurrentTab={setCurrentTab}
            onSave={handleSave}
            user={user}
          />
        )
      },
      {
        label: "Work",
        value: "work",
        content: (
          <EditWork
            userInterests={userInterests}
            handleWorkClick={handleWorkClick}
            handleAddWorkClick={handleAddWorkClick}
            userWorks={works}
          />
        )
      },
      {
        label: "Services",
        value: "services",
        content: <EditServices />
      }
    ],
    [userInterests, categories, user, handleSave]
  );

  return (
    <Sidebar open={open} onClose={onClose} title="Edit Profile">
      <div className="h-full overflow-y-auto">
        <Tabs
          key={currentTab}
          variant="segmented"
          items={tabs}
          defaultValue={currentTab || "header"}
          onChange={(value) => setCurrentTab(value as EditProfileTabs)}
        />
      </div>
      {/* Upload Work Sidebar */}
      {isUploadSidebarOpen && (
        <EditWorkSidebar
          open={isUploadSidebarOpen}
          onClose={handleSidebarClose}
          options={categories}
          work={editWork}
          newInterest={selectedInterest}
          handleSaveWork={handleSaveWork}
          handleContentUpload={handleContentUpload}
          handleCoverUpload={handleCoverUpload}
        />
      )}
    </Sidebar>
  );
};
