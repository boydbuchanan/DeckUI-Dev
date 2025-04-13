import {
  Button,
  Combobox,
  Icon,
  Pressable,
  Text,
  cn,
  useMediaQuery
} from "@deckai/deck-ui";
import type { IconName } from "@deckai/icons";
import React, { useCallback, useState } from "react";

import { Assets } from "@site";

const buyerImage = Assets.images.buyerHero2;
const sellerImage = Assets.images.creatorHero;

// Options for content type combobox
const contentTypeOptions = [
  { value: "music", label: "Music" },
  { value: "photography", label: "Photography" },
  { value: "video", label: "Video" },
  { value: "design", label: "Design" },
  { value: "writing", label: "Writing" }
];

export const HeroSlide = ({
  isActive,
  peekHeading,
  peekIcon,
  children,
  backgroundImage,
  className,
  onToggle,
  style
}: {
  isActive: boolean;
  peekHeading: string;
  peekIcon: IconName;
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  onToggle: () => void;
  style?: React.CSSProperties;
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div
      className={cn(
        "transition-[width,height] duration-200 ease-in-out bg-cover bg-center relative overflow-hidden",
        isActive && isMobile && "h-[278px] w-full",
        isActive && !isMobile && "w-full",
        !isActive && isMobile && "w-full h-20",
        !isActive && !isMobile && "w-[144px] md:h-full",
        className
      )}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        ...style
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {isActive ? (
        // Active slide shows full content
        <div className="flex flex-col h-full p-8 md:p-12 lg:p-16 justify-center text-white relative z-10">
          {children}
        </div>
      ) : (
        // Collapsed slide shows only the peek bar
        <Pressable
          onClick={onToggle}
          className={cn(
            "absolute inset-0 flex items-center justify-center z-10",
            "bg-black/40 transition-colors cursor-pointer"
          )}
        >
          <div className="flex items-center justify-center h-full">
            <div
              className={cn(
                "flex items-center transform whitespace-nowrap gap-2",
                isMobile ? "rotate-0" : "rotate-90"
              )}
            >
              <Icon name={peekIcon} size={24} color="white" />
              <Text
                variant={["sm:heading-xs", "body-default-medium"]}
                color="white"
              >
                {peekHeading}
              </Text>
            </div>
          </div>
        </Pressable>
      )}
    </div>
  );
};

// Buyer slide content component
const BuyerSlideContent = () => {
  const [contentType, setContentType] = useState("music");

  return (
    <div className="max-w-xl">
      <Text
        variant="body-xxs-semibold"
        color="white"
        className="uppercase tracking-wider mb-4"
      >
        A NEW ERA OF CONTENT CREATION
      </Text>
      <Text
        variant={["sm:heading-lg", "heading-sm"]}
        color="white"
        className="mb-6 drop-shadow-md"
      >
        Bring Your Vision to Life
      </Text>
      <Text
        variant={["sm:body-default-medium", "body-xxs-medium"]}
        color="white"
        className="mb-8"
      >
        Connect with talented video content creators across all platforms. Get
        the content you need, hassle-free.
      </Text>

      <div className="flex flex-row sm:gap-4 gap-2 sm:max-w-md items-center">
        <Text
          variant={["sm:body-default-semibold", "body-xs-medium"]}
          color="white"
          className="min-w-fit"
        >
          I need content for
        </Text>
        <Combobox
          id="content-type"
          options={contentTypeOptions}
          value={contentType}
          onChange={(value) => {}}
          onSelected={setContentType}
          placeholder="eg: Music"
          autocomplete
          end={
            <Pressable className="bg-primary rounded p-1.5">
              <Icon name="search-normal" size={16} color="white" />
            </Pressable>
          }
        />
      </div>
    </div>
  );
};

// Creator slide content component
const CreatorSlideContent = () => (
  <div className="max-w-xl flex flex-col">
    <Text
      variant="body-xxs-semibold"
      color="white"
      className="uppercase tracking-wider sm:mb-4 mb-2"
    >
      GROW YOUR AUDIENCE AND GET PAID ON TIME
    </Text>
    <Text
      variant={["sm:heading-lg", "heading-sm"]}
      color="white"
      className="sm:mb-6 mb-3"
    >
      Build your Brand
    </Text>
    <Text
      variant={["sm:body-default-medium", "body-xxs-medium"]}
      color="white"
      className="mb-8"
    >
      Connect with clients seeking high-quality video content. Showcase your
      talent and book more projects.
    </Text>
    <Button
      variant="filled"
      className="sm:px-8 px-6 sm:h-[60px] h-[48px] items-center w-fit self-center sm:self-start"
      textVariant={["sm:body-default-bold", "body-default-semibold"]}
      color="white"
    >
      Start selling my services
    </Button>
  </div>
);

export type HeroProps = {
  initialActiveSide?: "buyer" | "creator";
};

export const Hero = ({ initialActiveSide = "buyer" }: HeroProps) => {
  const [activeSide, setActiveSide] = useState<"buyer" | "creator">(
    initialActiveSide
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const toggleSide = useCallback(() => {
    setActiveSide((current) => (current === "buyer" ? "creator" : "buyer"));
  }, []);

  return (
    <div className="flex w-full overflow-hidden gap-2 md:flex-row flex-col h-[366px] md:h-[752px] min-h-[366px] md:min-h-[752px]">
      <HeroSlide
        isActive={activeSide === "buyer"}
        peekHeading="Buy"
        peekIcon="shopping-cart"
        backgroundImage={buyerImage}
        onToggle={toggleSide}
      >
        <BuyerSlideContent />
      </HeroSlide>

      <HeroSlide
        isActive={activeSide === "creator"}
        peekHeading="Create"
        peekIcon="user"
        backgroundImage={sellerImage}
        onToggle={toggleSide}
      >
        <CreatorSlideContent />
      </HeroSlide>
    </div>
  );
};
