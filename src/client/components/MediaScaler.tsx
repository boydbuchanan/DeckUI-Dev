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
  controls?: boolean;
  autoPlay?: boolean;
  className?: string;
}
const MediaScaler: React.FC<MediaScalerProps> = ({
  src,
  mimeType,
  aspectRatio,
  height,
  width,
  onLoadedMedia,
  controls = true,
  autoPlay = false,
  className = "",
}) => {
  const videoRef = createRef<HTMLVideoElement>();
  const imgRef = createRef<HTMLImageElement>();

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
    return (
      <>
      ImageScaler {mime}
      <ImageScaler 
        ref={imgRef} 
        src={src} 
        divClass={className} 
        pt={paddingTop} 
        scale={1} 
        onLoadedMedia={onLoadedMedia} />
      </>
    );
  } else if (mime.includes("video")) {
    return (
      <>
      VideoScaler {mime}
      
      <VideoScaler
        vidRef={videoRef}
        divClass={className}
        src={src}
        pt={paddingTop}
        scale={1}
        onLoadedMedia={onLoadedMedia}
        controls={controls}
        autoPlay={autoPlay}
      />
      </>
    );
  }

  return <p>Unsupported file type.</p>;
};

export default MediaScaler;
export { MediaScaler };
