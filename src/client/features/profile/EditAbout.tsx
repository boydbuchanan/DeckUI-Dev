import { useState, useCallback, useMemo } from "react";
import * as CMS from "@deckai/client/types/cms";
import LinkManager from "@deckai/client/components/LinkManager";
import type { LinkType } from "@deckai/client/components/LinkManager";
import { PlacesCombobox } from "@deckai/client/components/PlacesCombobox";
import { ImageEditor } from "@deckai/client/components/ImageEditor";
import {
  Avatar,
  Icon,
  Text,
  Input,
  MultiSelectCombobox,
  Pressable,
  Button,
  useToast,
  TextArea,
  cn
} from "@deckai/deck-ui";
import { EditProfileTabs } from "./ProfileEditor";
import Me from "@me";
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

type EditHeaderProps = {
  categories: CMS.Category[];
  userInterests: CMS.Interest[];
  user: CMS.User;
  avatarUrl?: string;
  setCurrentTab: (tab: EditProfileTabs) => void;
  handleAvatarUpload: (blob: Blob, src: string | undefined) => Promise<void>;
  handleSave: (data: Partial<CMS.UpdateUser>) => void;
};

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

const transformSocialLinksToUserUpdate = (
  links: LinkType[]
): Partial<CMS.UpdateUser> => {
  const updates: Partial<CMS.UpdateUser> = {};

  // links.forEach((link) => {
  //   //TODO: update link with user
  // });
  console.log("TODO: Transform Social Links: ", links);

  return updates;
};

export function EditAbout({
  categories,
  userInterests,
  user,
  avatarUrl,
  setCurrentTab,
  handleAvatarUpload,
  handleSave
}: EditHeaderProps) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [name, setName] = useState<string>(user?.displayName || "");
  const [aboutMe, setAboutMe] = useState(user.aboutMe || "");
  const onNameChange = (newValue: string) => {
    setName(newValue);
    setHasChanges(true);
  };
  const [location, setLocation] = useState<string | null>(
    user?.location || null
  );
  const onLocationChange = (newValue: string | null) => {
    setLocation(newValue);
    setHasChanges(true);
  };

  const [currentInterests, setCurrentInterests] = useState<CMS.Interest[]>(
    userInterests || []
  );

  // Transform categories to match OptionProps with grouping
  const interestOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.Display,
        options: category.interests.map((interest) => ({
          label: interest.Display,
          value: interest.id.toString()
        }))
      })),
    [categories]
  );

  // Transform currentInterests to match selected values format
  const selectedValues = useMemo(
    () => currentInterests.map((interest) => interest.id.toString()),
    [currentInterests]
  );
  const allInterests = useMemo(
    () => categories.flatMap((c) => c.interests),
    [categories]
  );

  const handleInterestSelect = async (values: string[]) => {
    // Find the full interest objects for the selected IDs
    const newInterestIds = values.map((v) => parseInt(v));

    const selectedInterests = allInterests.filter((i) =>
      newInterestIds.includes(i.id)
    );

    setCurrentInterests(selectedInterests);

    setHasChanges(true);
  };

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

  const onSaveHeader = useCallback(async () => {
    const updateData: Partial<CMS.UpdateUser> = {
      displayName: name,
      location: location || "",
      interests: currentInterests.map((i) => i.id),
      ...transformSocialLinksToUserUpdate(socialLinks)
    };
    console.log("Update User: ", updateData);
    handleSave(updateData);
    setCurrentTab("contact");
  }, [
    name,
    location,
    socialLinks,
    currentInterests,
    setCurrentTab,
    handleSave
  ]);


  return (
    <div className="flex flex-col h-full px-1">
      <div className="flex flex-col gap-8 pt-8">
        <div className="flex flex-col justify-center gap-2">
        <Text variant="body-md">Profile Image</Text>
          {isEditingAvatar ? (
            
            <ImageEditor
              src={Me.editImage(avatarUrl)}
              height={1000}
              width={1000}
              borderRadius={500}
              handleSave={(blob: Blob, src: string | undefined) => {
                setIsEditingAvatar(false);
                handleAvatarUpload?.(blob, src);
              }}
            />
          ) : (
            <div className="flex flex-col justify-center items-center">
              
              <Pressable
                className="relative group flex flex-col m-4"
                onClick={() => setIsEditingAvatar(true)}
              >
                <div className="flex items-center justify-center w-[164px] h-[164px]">
                  <Avatar src={Me.editImage(avatarUrl)} size={164} isLoading={!avatarUrl ? true : false} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 rounded-full group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-center w-10 h-10 rounded bg-white opacity-80">
                    <Icon name="pen" color="primary" size={20} />
                  </div>
                </div>
                
              </Pressable>
              <Button
                variant="outlined"
                onClick={() => setIsEditingAvatar(true)}
                className="flex items-center gap-2"
              >
                <Icon name="crop" size={20} />
                Edit Image
              </Button>
            </div>
            
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="body-md">Personal Information</Text>
          <Input
            label="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />

          {/* <GooglePlacesAutocomplete
            selectProps={{
                    value: location ? {label: location, value: location} : null,
                    onChange: (newValue) => setLocation(newValue?.label || null),
                    placeholder: "Enter your location",
                }}
          /> */}
          <PlacesCombobox
            value={location}
            onChange={onLocationChange}
            label="Location"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="body-md">Interests</Text>
          <MultiSelectCombobox
            selectedValues={selectedValues}
            onSelectionChange={handleInterestSelect}
            options={interestOptions}
            label="The kind of content you create or enjoy"
            placeholder="Search for your interests"
            maxSelections={4}
            noOptionsMessage="No matching interests found"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="body-md">Bio</Text>
          <TextArea
            label="Share a little about yourself and what you do."
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            minLength={150}
            maxLength={500}
            showCharacterCount
            placeholder="Tell us what you're passionate about - your work, interests, and what makes you unique."
          />
        </div>
        
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-0.5 bg-white">
        <Button
          color="black"
          variant="filled"
          onClick={onSaveHeader}
          disabled={!hasChanges}
          className="w-full py-4"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
