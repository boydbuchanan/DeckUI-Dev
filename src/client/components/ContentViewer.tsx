import React, { useCallback, useRef, useState } from "react";
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
   * The aspect ratio of the video
   */
  aspectRatio?: number;
  /**
   * Additional class names to be applied to the video container
   */
  className?: string;
  height?: number;
  width?: number;
  mimeType?: string;
};


export function ContentViewer({
  src,
  open,
  onClose,
  caption,
  aspectRatio = 1,
  height,
  width,
  //mimeType = "image/jpeg",
  mimeType = "video/mp4",
  className
}: VideoPlayerProps) {
  
  const [isHovering, setIsHovering] = useState(false);
  const [mediaAspectRatio, setMediaAspectRatio] = useState<number | undefined>(aspectRatio);
  const [aspectRatioClasses, setAspectRatioClasses] = useState<string | undefined>(undefined);
  

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
          "max-h-[90vh]",
          "relative w-full h-full flex items-center justify-center overflow-hidden"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          aspectRatio: mediaAspectRatio,
        }}
      >
        <MediaScaler
          src={src}
          aspectRatio={mediaAspectRatio}
          mimeType={mimeType}
          height={height}
          width={width}
          onLoadedMedia={onLoadedMedia}
        />
        
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
