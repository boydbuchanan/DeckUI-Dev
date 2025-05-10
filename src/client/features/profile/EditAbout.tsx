import { useState, useCallback, useMemo, useEffect } from "react";
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
  TextArea,
} from "@deckai/deck-ui";
import { SidebarTab } from "./ProfileEditor";
import Me from "@me";

type EditHeaderProps = {
  categories?: CMS.Category[];
  userInterests: CMS.Interest[];
  user: CMS.User;
  avatarUrl?: string;
  setCurrentTab: (tab: SidebarTab) => void;
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
    iconName: "instagram-filled",
  },
  {
    id: "tiktok",
    platform: "TikTok",
    handle: user.displayName,
    enabled: true,
    url: undefined,
    iconName: "tiktok-filled",
  },
  {
    id: "youtube",
    platform: "YouTube",
    handle: user.displayName,
    enabled: true,
    url: undefined,
    iconName: "youtube-filled",
  },
];

export function EditAbout({
  categories,
  userInterests,
  user,
  avatarUrl,
  setCurrentTab,
  handleAvatarUpload,
  handleSave,
}: EditHeaderProps) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentInterests, setCurrentInterests] = useState<CMS.Interest[]>([]);
  const editAvatarUrl = useMemo(
    () => Me.editImage(avatarUrl),
    [avatarUrl]
  );

  // Synchronize currentInterests with userInterests when userInterests changes
  useEffect(() => {
    if (userInterests) {
      setCurrentInterests(userInterests);
    }
  }, [userInterests]);
  
    // Form state
  var updateData: CMS.UpdateUser = useMemo(() => {
  return {
    displayName: user?.displayName || undefined,
    location: user?.location || undefined,
    interests: currentInterests.map((i) => i.id),
    aboutMe: user?.aboutMe || undefined,
  };
  }, [user]);
  
  const [formData, setFormData] = useState(updateData);
  
  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const onTextAreaChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const isModified = useMemo(() => {
    return (
      formData.displayName !== user?.displayName ||
      formData.location !== user?.location ||
      formData.aboutMe !== user?.aboutMe ||
      currentInterests.length !== userInterests.length ||
      currentInterests.some(
        (interest) => !userInterests.some((i) => i.id === interest.id)
      )
    );
  }, [formData, user, userInterests, currentInterests]);

  // Transform categories to match OptionProps with grouping
  const interestOptions = useMemo(
    () =>
      categories?.map((category) => ({
        label: category.Display,
        options: category.interests.map((interest) => ({
          label: interest.Display,
          value: interest.id.toString(),
        })),
      })),
    [categories]
  );

  // Transform currentInterests to match selected values format
  const selectedValues = useMemo(
    () => currentInterests.map((interest) => interest.id.toString()),
    [currentInterests]
  );

  const allInterests = useMemo(
    () => categories?.flatMap((c) => c.interests),
    [categories]
  );

  const handleInterestSelect = async (values: string[]) => {
    if (!allInterests) return;

    // Find the full interest objects for the selected IDs
    const newInterestIds = values.map((v) => parseInt(v));
    const selectedInterests = allInterests.filter((i) =>
      newInterestIds.includes(i.id)
    );

    setCurrentInterests(selectedInterests);
    setHasChanges(true);
  };

  const onSaveHeader = useCallback(async () => {
    handleSave(formData);
    setCurrentTab(SidebarTab.Contact);
  }, [formData, handleSave, setCurrentTab]);

  return (
    <div className="flex flex-col h-full px-1">
      <div className="flex flex-col gap-8 pt-8">
        {/* Profile Image Editor */}
        <div className="flex flex-col justify-center gap-2">
          <Text variant="body-md">Profile Image</Text>
          {isEditingAvatar ? (
            <ImageEditor
              src={editAvatarUrl}
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
                  <Avatar
                    src={editAvatarUrl}
                    size={164}
                    isLoading={!avatarUrl ? true : false}
                  />
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

        {/* Personal Information */}
        <div className="flex flex-col gap-1">
          <Text variant="body-md">Personal Information</Text>
          <Input
            label="Name"
            name="displayName"
            value={formData.displayName}
            onChange={onInputChange}
          />
          
          {/* <GooglePlacesAutocomplete
            selectProps={{
                    value: location ? {label: location, value: location} : null,
                    onChange: (newValue) => setLocation(newValue?.label || null),
                    placeholder: "Enter your location",
                }}
          /> */}
          <PlacesCombobox
            value={formData.location || null}
            onChange={(newValue) => {
              setFormData((prev) => ({ ...prev, location: newValue || undefined }));
              setHasChanges(true);
            }}
            label="Location"
            placeholder="Search for a city"
            className="max-w-md"
          />
        </div>

        {/* Interests */}
        <div className="flex flex-col gap-1">
          <Text variant="body-md">Interests</Text>
          <MultiSelectCombobox
            selectedValues={selectedValues}
            onSelectionChange={handleInterestSelect}
            options={interestOptions || []}
            label="The kind of content you create or enjoy"
            placeholder="Search for your interests"
            maxSelections={4}
            noOptionsMessage="No matching interests found"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <Text variant="body-md">Bio</Text>
          <TextArea
            label="Share a little about yourself and what you do."
            name="aboutMe"
            value={formData.aboutMe}
            onChange={onTextAreaChange}
            minLength={150}
            maxLength={500}
            showCharacterCount
            placeholder="Tell us what you're passionate about - your work, interests, and what makes you unique."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-0.5 bg-white">
        <Button
          color="black"
          variant="filled"
          onClick={onSaveHeader}
          disabled={!isModified}
          className="w-full py-4"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
