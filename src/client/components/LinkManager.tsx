import { useState, useCallback, useMemo, memo } from "react";
import { Text, Switch, Button, Icon, useToast, Input } from "@deckai/deck-ui";
import type { IconProps } from "@deckai/deck-ui";

export type LinkType = {
  id: string;
  platform: string;
  handle: string;
  enabled: boolean;
  url?: string;
  iconName: IconProps["name"];
};

export type EditingState = {
  id: string | null;
  handle: string;
  url: string;
};

export type LinkManagerProps = {
  links: LinkType[];
  onUpdateLinks: (links: LinkType[]) => Promise<void>;
  title?: string;
  description?: string;
  requireUrl?: boolean;
  urlLabel?: string;
  handleLabel?: string;
};

function LinkManager({
  links: initialLinks,
  onUpdateLinks,
  title = "Links",
  description = "Manage your links and choose whether to show them.",
  requireUrl = true,
  urlLabel = "Profile URL",
  handleLabel = "Handle"
}: LinkManagerProps) {
  const { show } = useToast();
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    handle: "",
    url: ""
  });

  const [localLinks, setLocalLinks] = useState(initialLinks);

  useMemo(() => {
    setLocalLinks(initialLinks);
  }, [initialLinks]);

  const handleToggle = useCallback(
    async (id: string) => {
      const link = localLinks.find((l) => l.id === id);
      if (!link) return;

      // If enabling and no handle exists, start editing
      if (!link.enabled && !link.handle) {
        setEditing({
          id,
          handle: "",
          url: ""
        });
        return;
      }

      const newLinks = localLinks.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      );
      setLocalLinks(newLinks);

      try {
        await onUpdateLinks(newLinks);
        show({
          message: "Links updated successfully",
          variant: "success"
        });
      } catch (error) {
        console.error("Failed to update links:", error);
        show({
          message: "Failed to update links",
          variant: "error"
        });
        // Revert the UI state on error
        setLocalLinks(localLinks);
      }
    },
    [localLinks, show, onUpdateLinks]
  );

  const handleEditClick = useCallback((link: LinkType) => {
    setEditing({
      id: link.id,
      handle: link.handle,
      url: link.url || ""
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!editing.id) return;

    // Validate both handle and URL if required
    if (!editing.handle || (requireUrl && !editing.url)) {
      show({
        message: `Please provide ${
          requireUrl ? "both handle and URL" : "a handle"
        }`,
        variant: "error"
      });
      return;
    }

    const newLinks = localLinks.map((link) =>
      link.id === editing.id
        ? {
            ...link,
            handle: editing.handle,
            enabled: true,
            url: editing.url
          }
        : link
    );

    try {
      await onUpdateLinks(newLinks);
      setLocalLinks(newLinks);
      show({
        message: "Link updated successfully",
        variant: "success"
      });
    } catch (error) {
      console.error("Failed to update link:", error);
      show({
        message: "Failed to update link",
        variant: "error"
      });
    }
    setEditing({ id: null, handle: "", url: "" });
  }, [editing, localLinks, show, onUpdateLinks, requireUrl]);

  const linkedItems = useMemo(
    () => localLinks.filter((link) => link.handle && link.enabled),
    [localLinks]
  );

  const unlinkedItems = useMemo(
    () => localLinks.filter((link) => !link.handle || !link.enabled),
    [localLinks]
  );

  const renderEditForm = (link: LinkType) => (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        editing.id === link.id
          ? "max-h-[200px] opacity-100"
          : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex flex-col gap-1 py-4">
        <div className={`flex gap-2 ${requireUrl ? "flex-row" : "flex-col"}`}>
          <div className="flex-1">
            <Input
              label={handleLabel}
              value={editing.handle}
              onChange={(e) =>
                setEditing((prev) => ({ ...prev, handle: e.target.value }))
              }
              placeholder={`Enter your ${
                link.platform
              } ${handleLabel.toLowerCase()}`}
              className="w-full"
            />
          </div>
          {requireUrl && (
            <div className="flex-1">
              <Input
                label={urlLabel}
                value={editing.url}
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder={`Enter your ${
                  link.platform
                } ${urlLabel.toLowerCase()}`}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outlined"
            onClick={() => setEditing({ id: null, handle: "", url: "" })}
          >
            Cancel
          </Button>
          <Button variant="filled" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Text variant="body-md">{title}</Text>
        <Text variant="label-default" color="secondary">
          {description}
        </Text>
      </div>
      {linkedItems.length > 0 && (
        <div className="flex flex-col gap-2">
          {linkedItems.map((link) => (
            <div key={`linked-${link.id}`} className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name={link.iconName} size={24} />
                  <Text variant="body-default-semibold">{link.handle}</Text>
                </div>
                <div className="flex items-center gap-4">
                  <Text
                    variant="body-default-semibold"
                    color="secondary"
                    className="cursor-pointer underline"
                    onClick={() => handleEditClick(link)}
                  >
                    Update
                  </Text>
                  <Switch
                    checked={link.enabled}
                    onChange={() => handleToggle(link.id)}
                  />
                </div>
              </div>
              {renderEditForm(link)}
            </div>
          ))}
        </div>
      )}

      {unlinkedItems.length > 0 && (
        <div className="flex flex-col gap-2">
          {unlinkedItems.map((link) => (
            <div key={`unlinked-${link.id}`} className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Icon name={link.iconName} size={24} />
                  <Text
                    variant="body-default-semibold"
                    className="cursor-pointer underline"
                    color="secondary"
                    onClick={() => handleEditClick(link)}
                  >
                    {link.handle || `Add ${link.platform}`}
                  </Text>
                </div>
                {link.handle && (
                  <div className="flex items-center gap-4">
                    <Text
                      variant="body-default-semibold"
                      color="secondary"
                      className="cursor-pointer"
                      onClick={() => handleEditClick(link)}
                    >
                      Update
                    </Text>
                    <Switch
                      checked={link.enabled}
                      onChange={() => handleToggle(link.id)}
                    />
                  </div>
                )}
              </div>
              {renderEditForm(link)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(LinkManager);
