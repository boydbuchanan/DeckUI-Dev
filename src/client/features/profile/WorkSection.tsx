"use client";

import {
  Text,
  Carousel,
  AddWorkCard,
  WorkCard,
  Combobox,
  Icon,
  Tabs,
  useMediaQuery,
  Button
} from "@deckai/deck-ui";
import type { TabsProps, WorkCardProps } from "@deckai/deck-ui";
import React, { useState, useMemo } from "react";
import * as CMS from "@deckai/client/types/cms";
import { ContentViewer } from "@deckai/client/components/ContentViewer";

type SocialPlatform = "instagram-filled" | "youtube-filled" | "tiktok-filled";

const platformToIcon: Record<string, SocialPlatform> = {
  Instagram: "instagram-filled",
  Youtube: "youtube-filled",
  Tiktok: "tiktok-filled"
};

export const MyWorkCarousel = ({
  title,
  cards,
  handleAddWork
}: {
  title?: string;
  cards: WorkCardProps[];
  handleAddWork?: () => void;
}) => {
  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4" key={title}>
          <Text variant="body-md" color="secondary">
            {title} {cards.length}
          </Text>
          <Carousel>
            {handleAddWork && <AddWorkCard onClick={handleAddWork} />}
            {cards.map((workCard, index) => (
              <WorkCard key={`${title}-work-${index}`} {...workCard} />
            ))}
          </Carousel>
        </div>
    </div>
  );
};

function EmptyTab({ onClick }: { onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <Text variant="heading-md">No work yet</Text>
      <Text variant="body-default" color="secondary">
        Add your first piece of work to showcase your talent
      </Text>
      {onClick && (
        <Button onClick={onClick} variant="filled" color="black">
          Add Work
        </Button>
      )}
    </div>
  );
}

const DesktopWorkSection = ({
  works,
  launchEditMode
}: {
  works: Record<string, WorkCardProps[]>;
  launchEditMode?: () => void;
}) => {
  const myWorkTabs: TabsProps["items"] = Object.entries(works).map(
    ([platform, works]) => {
      return {
        value: platform,
        label: platform,
        id: `platform-${platform}`,
        content: (
          <MyWorkCarousel
            cards={works}
            handleAddWork={launchEditMode}
          />
        )
      };
    }
  );

  return (
    <Tabs items={myWorkTabs} defaultValue="All" className="hidden sm:block" />
  );
};

const MobileWorkSection = ({
  works,
  launchEditMode
}: {
  works: Record<string, WorkCardProps[]>;
  launchEditMode?: () => void;
}) => {
  const [selectedOption, setSelectedOption] = useState("All");
  return (
    <>
      <Combobox
        options={Object.keys(works).map((platform) => ({
          value: platform,
          label: platform
        }))}
        value={selectedOption}
        onSelected={setSelectedOption}
        end={<Icon name="arrow-down" size={12} />}
      />
      {works[selectedOption] && (
        <MyWorkCarousel
          cards={works[selectedOption]}
          handleAddWork={launchEditMode}
        />
      )}
    </>
  );
};

export const WorkSection = ({
  launchEditMode,
  works
}: {
  works?: CMS.Work[];
  launchEditMode?: () => void;
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [content, setContentUpload] = useState<CMS.Upload | undefined>(undefined);
  const [videoPlayerSource, setVideoPlayerSource] = useState("");
  
  const [caption, setCaption] = useState("");
  const transformWorkToCards = (work: CMS.Work): WorkCardProps => {
    return {
      iconName: platformToIcon[work.Platform] ?? "instagram-filled",
      caption: work.Title,
      backgroundImage: work.DisplayImage?.url ?? "",
      onClick: () => {
        console.log("Work clicked", work.Content);
        if (work.Content) {
          setContentUpload(work.Content);
          setVideoPlayerSource(work.Content.url);
          setCaption(work.Title);
          setVideoPlayerOpen(true);
        } else if (work.PostUrl) {
          window.open(work.PostUrl, "_blank");
        }
      }
    };
  };
  const worksBy = useMemo(() => {
    const worksByPlatform: Record<string, WorkCardProps[]> = {
      All: []
    };

    works?.forEach((work) => {
      const platform = work.Platform;
      worksByPlatform["All"].push(transformWorkToCards(work));
      if (!platform) return;

      if (!worksByPlatform[platform]) {
        worksByPlatform[platform] = [];
      }
      worksByPlatform[platform].push(transformWorkToCards(work));
    });
    return worksByPlatform;
  }, [works]);

  return (
    <div className="flex relative flex-col sm:py-10 py-4 sm:gap-10 gap-6">
      {!works || works.length === 0 ? (
        <EmptyTab onClick={launchEditMode} />
      ) : isMobile ? (
        <MobileWorkSection
          works={worksBy}
          launchEditMode={launchEditMode}
        />
      ) : (
        <DesktopWorkSection
          works={worksBy}
          launchEditMode={launchEditMode}
        />
      )}
      
      {content && (
        <ContentViewer
          open={videoPlayerOpen}
          onClose={() => setVideoPlayerOpen(false)}
          src={content.url}
          caption={caption}
          mimeType={content.mime}
          aspectRatio={content.width / content.height}
          height={content.height}
          width={content.width}
        />
      )}
    </div>
  );
};

