import { Button, Text, TextArea } from "@deckai/deck-ui";
import { useState, useCallback } from "react";
import LinkManager from "@deckai/client/components/LinkManager";
import type { LinkType } from "@deckai/client/components/LinkManager";
import { SidebarTab } from "./ProfileEditor";
import { useToast } from "@deckai/deck-ui";
import * as CMS from "@deckai/client/types/cms";

const transformUserToContactLinks = (user: CMS.User): LinkType[] => [
  {
    id: "email",
    platform: "Email",
    handle: user.contactEmail || "",
    enabled: !!user.contactEmail,
    iconName: "sms"
  },
  {
    id: "website",
    platform: "Website",
    handle: user.website || "",
    enabled: !!user.website,
    url: user.website || "",
    iconName: "global"
  }
];

const transformUserToSocialLinks = (user: CMS.User): LinkType[] => [
  {
    id: "instagram",
    platform: "Instagram",
    handle: user.displayName,
    enabled: true,
    url: undefined,
    iconName: "instagram-filled"
  },
  {
    id: "tiktok",
    platform: "TikTok",
    handle: user.displayName,
    enabled: true,
    url: undefined,
    iconName: "tiktok-filled"
  },
  {
    id: "youtube",
    platform: "YouTube",
    handle: user.displayName,
    enabled: true,
    url: undefined,
    iconName: "youtube-filled"
  }
];
const transformContactLinksToUserUpdate = (
  links: LinkType[]
): Partial<CMS.UpdateUser> => {
  return {
    contactEmail: links.find((l) => l.id === "email")?.handle || "",
    website: links.find((l) => l.id === "website")?.url || ""
  };
};

type EditAboutProps = {
  setCurrentTab: (tab: SidebarTab) => void;
  onSave: (updateData: Partial<CMS.UpdateUser>) => void;
  user: CMS.User;
};

export const EditContact = ({
  setCurrentTab,
  onSave,
  user
}: EditAboutProps) => {
  const { show } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [contactLinks, setContactLinks] = useState<LinkType[]>(() =>
    transformUserToContactLinks(user)
  );

  const handleUpdateContactLinks = useCallback(async (newLinks: LinkType[]) => {
    setContactLinks(newLinks);
    return Promise.resolve();
  }, []);

  const [socialLinks, setSocialLinks] = useState<LinkType[]>(() =>
    transformUserToSocialLinks(user)
  );

  const onSocialLinksChange = (newValue: LinkType[]) => {
    setSocialLinks(newValue);
    setHasChanges(true);
  };

  const handleUpdateLinks = useCallback(async (newLinks: LinkType[]) => {
    onSocialLinksChange(newLinks);
    return Promise.resolve();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const updateData: Partial<CMS.UpdateUser> = {
        ...transformContactLinksToUserUpdate(contactLinks)
      };

      onSave(updateData);
      show({
        message: "Profile updated successfully",
        variant: "success"
      });
      setCurrentTab(SidebarTab.Work);
    } catch (error) {
      console.error("Failed to update contact links:", error);
      show({
        message: "Failed to update contact links",
        variant: "error"
      });
      return Promise.reject(error);
    }
  }, [contactLinks, setCurrentTab, show, onSave]);

  return (
    <div className="flex flex-col h-full px-1">
      <div className="flex flex-col gap-8 pt-8">
        <LinkManager
          links={socialLinks}
          onUpdateLinks={handleUpdateLinks}
          title="Social Media Links"
          description="Connect your social media accounts, and choose whether to show them on your profile."
          requireUrl={true}
          handleLabel="Handle"
          urlLabel="Profile URL"
        />
        <LinkManager
          links={contactLinks}
          onUpdateLinks={handleUpdateContactLinks}
          title="Contact Information"
          description="Add your contact information and choose what to display on your profile."
          requireUrl={false}
          handleLabel="Contact"
          urlLabel="URL"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-0.5 bg-white">
        <Button
          color="black"
          variant="filled"
          onClick={handleSave}
          disabled={!hasChanges}
          className="w-full py-4"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};
