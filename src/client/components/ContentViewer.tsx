import React, { createRef, useCallback, useRef, useState } from "react";
import { cn, Modal, Text } from "@deckai/deck-ui";
import { MediaScaler } from "@deckai/client/components/MediaScaler";
import { MediaInfo } from "@deckai/client/types";
import { getStyle } from "@deckai/client/media";

export type VideoPlayerProps = {
  /**
   * The URL of the video to play
   */
  src: string;
  /**
   * Whether the video modal is open
   */
  open: boolean;
  /**
   * Callback fired when the video modal is closed
   */
  onClose: () => void;
  /**
   * The caption to display in the bottom left corner
   */
  caption?: React.ReactNode;
  /**
   * Additional class names to be applied to the video container
   */
  className?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  autoPlay?: boolean;
};


export function ContentViewer({
  src,
  open,
  onClose,
  caption,
  //mimeType = "image/jpeg",
  mimeType = "video/mp4",
  autoPlay = false,
  className
}: VideoPlayerProps) {
  
  const [isHovering, setIsHovering] = useState(false);
  const [mediaAspectRatio, setMediaAspectRatio] = useState<number | undefined>(1);
  const [aspectRatioClasses, setAspectRatioClasses] = useState<string | undefined>(undefined);
  const videoRef = createRef<HTMLVideoElement>();
  const imgRef = createRef<HTMLImageElement>();
  

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);
  

  const onLoadedMedia = (
    (size: MediaInfo) => {
      setMediaAspectRatio(size.aspectRatio);
      var classes = "";
      if (size.aspectRatio > 1) {
        classes = "w-full h-auto";
      } else {
        classes = "h-full w-auto";
      }
      setAspectRatioClasses(classes);

      console.log("Media loaded:", size);
    }
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseButton={isHovering}
      className={cn("rounded-xl overflow-hidden bg-gray-200", className, aspectRatioClasses)}
    >
      <div
        className={cn(
          "w-full h-full flex items-center justify-center overflow-hidden bg-black"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          aspectRatio: mediaAspectRatio,
        }}
      >
        {mimeType?.includes("video") ? (
          <video
            ref={videoRef}
            src={src}
            controls={true}
            autoPlay={autoPlay}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                const video = videoRef.current;
                onLoadedMedia?.({
                  width: video.videoWidth,
                  height: video.videoHeight,
                  aspectRatio: video.videoWidth / video.videoHeight,
                });
              }
            }}
            className={"absolute top-0 left-0 w-full h-full object-contain"}
          />
        ) : (
          <img
            src={src}
            alt="Media"
            className={"absolute top-0 left-0 w-full h-full object-contain"}
            onLoad={() => {
              onLoadedMedia?.({
                width: imgRef.current?.naturalWidth || 0,
                height: imgRef.current?.naturalHeight || 0,
                aspectRatio: imgRef.current?.naturalWidth
                  ? imgRef.current.naturalHeight / imgRef.current.naturalWidth
                  : 1,
              });
            }}
          />
        )}
        
        {caption && (
          <div className="absolute left-4 bottom-16 flex flex-col gap-1 p-2 rounded-lg bg-overlay max-w-[80%]">
            <Text variant="body-default-medium" className="text-white">
              {caption}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
}

ContentViewer.displayName = "ContentViewer";
