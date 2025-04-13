import { Button } from "@deckai/deck-ui";

import ImageScaler, {
  VideoScaler
} from "@deckai/client/components/ImageScaler";
import React, { createRef, useState } from "react";
import { MediaInfo } from "@deckai/client/types";

interface MediaScalerProps {
  src: string;
  mimeType?: string;
  aspectRatio?: number;
  height?: number;
  width?: number;
  onLoadedMedia?: (size: MediaInfo) => void;
}
const MediaScaler: React.FC<MediaScalerProps> = ({
  src,
  mimeType,
  aspectRatio,
  height,
  width,
  onLoadedMedia
}) => {
  const videoRef = createRef<HTMLVideoElement>();

  var paddingTop: number | undefined = undefined;

  if (aspectRatio) {
    paddingTop = Math.round(aspectRatio * 100);
  } else if (width && height) {
    paddingTop = Math.round((height / width) * 100);
  }

  var mime = mimeType || "image/jpeg";

  if (!mime) {
    return <p>Unknown source type.</p>;
  }
  if (mime.includes("image")) {
    return <ImageScaler src={src} pt={paddingTop} scale={1} />;
  } else if (mime.includes("video")) {
    return (
      <VideoScaler
        vidRef={videoRef}
        src={src}
        pt={paddingTop}
        scale={1}
        onLoadedMedia={onLoadedMedia}
      />
    );
  }

  return <p>Unsupported file type.</p>;
};

export default MediaScaler;
export { MediaScaler };
