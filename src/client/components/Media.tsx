import React, { useEffect, useRef, useState } from "react";
import { Button, Fallback, Icon, Tag, Text } from "@deckai/deck-ui";
import type { IconName } from "@deckai/icons";
import { MediaInfo } from "@deckai/client/types";

export type MediaCardProps = {
  iconName?: IconName;
  tags?: string[];
  caption?: string;
  src: string;
  mimeType?: string;
  onLoadedMedia?: (size: MediaInfo) => void;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function MediaCard({
  iconName,
  tags,
  caption,
  src,
  mimeType,
  onLoadedMedia,
  children,
  onClick,
  className,
}: MediaCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div
      className={`flex flex-col p-2 justify-between sm:w-[227px] sm:h-[371px] w-[148px] h-[234px] rounded-2xl relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Media */}
      {mimeType?.includes("image") && (
        <img
          ref={imageRef}
          src={src}
          alt={caption || "Media"}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          onLoad={() => {
            if (imageRef.current) {
              const image = imageRef.current;
              setIsLoading(false);
              onLoadedMedia?.({
                width: image.naturalWidth,
                height: image.naturalHeight,
                aspectRatio: image.naturalWidth / image.naturalHeight,
              });
            }
          }}
        />
      )}
      {mimeType?.includes("video") && (
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          onLoadedData={() => {
            if (videoRef.current) {
              const video = videoRef.current;
              setIsLoading(false);
              onLoadedMedia?.({
                width: video.videoWidth,
                height: video.videoHeight,
                aspectRatio: video.videoWidth / video.videoHeight,
              });
            }
          }}
          muted
        />
      )}

      {/* Fallback */}
      {isLoading && (
        <Fallback variant="image" className="w-full h-full rounded-2xl absolute inset-0 z-0" />
      )}

      {/* Foreground Content */}
      <div className="flex justify-between items-center relative z-10">
        {iconName && (
          <div className="flex items-center justify-center bg-overlay h-10 w-10 rounded-full">
            <Icon name={iconName} size={20} color="white" />
          </div>
        )}
        {tags && (
          <div className="flex gap-2 items-center">
            {tags.map((tag, index) => (
              <Tag key={index} color="text">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {caption && (
        <div className="flex flex-col gap-1 p-2 rounded-lg bg-overlay max-h-[60px] overflow-hidden relative z-10">
          <Text variant="body-default-medium" className="text-white truncate">
            {caption}
          </Text>
        </div>
      )}

      <div className="absolute flex items-center justify-evenly gap-4 transform w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 z-20">
        <Button
          color="accent"
          variant="filled"
          className="!px-3 !py-3 z-20 shadow-md opacity-70 hover:opacity-100 transition-opacity duration-300"
          onClick={onClick}
        >
          <Icon name="eye" color="white" />
        </Button>
        {children}
      </div>
    </div>
  );
}
