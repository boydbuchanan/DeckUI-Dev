import { Button } from "@deckai/deck-ui";

import ImageScaler, {
  VideoScaler
} from "@deckai/client/components/ImageScaler";
import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { getFileImageInfo, getFileVideoInfo } from "@deckai/client/media";
import { MediaInfo } from "@deckai/client/types";

interface FilePreviewProps {
  file: File;
  onMediaInfo?: (mediaInfo: MediaInfo) => void;
  onScreenshot?: (dataUrl: string, size: MediaInfo) => void;
  onScreenshotText?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onMediaInfo,
  onScreenshot,
  onScreenshotText = "Screenshot",
}) => {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const videoRef = createRef<HTMLVideoElement>();
  // Persist the object URL to avoid reloading
  const fileSrc = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    const calculateAspectRatio = async () => {
      try {
        const fileType = file.type.split("/")[0];
        let mediaInfo: MediaInfo;
        if (fileType === "image") {
          mediaInfo = await getFileImageInfo(file);
        } else if (fileType === "video") {
          mediaInfo = await getFileVideoInfo(file);
        } else {
          mediaInfo = { width: 0, height: 0, aspectRatio: 0 };
        }
        setAspectRatio(mediaInfo.aspectRatio);
        onMediaInfo && onMediaInfo(mediaInfo);
      } catch (error) {
        console.error("Error calculating aspect ratio:", error);
      }
    };

    calculateAspectRatio();
  }, [file, fileSrc]);

  const handleScreenshot = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const size = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
        aspectRatio: videoRef.current.videoHeight / videoRef.current.videoWidth
      };
      canvas.width = size.width;
      canvas.height = size.height;

      canvas
        .getContext("2d")
        ?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setScreenshot(dataUrl);

      onScreenshot && onScreenshot(dataUrl, size);
    }
  };

  if (aspectRatio === null || aspectRatio === undefined) {
    return <p>Loading preview...</p>;
  }

  const fileType = file.type.split("/")[0];
  //const src = URL.createObjectURL(file);

  return (
    <Preview
      src={fileSrc}
      isVideo={fileType === "video"}
      onScreenshot={onScreenshot}
      onScreenshotText={onScreenshotText}
    />
  );

  // if (fileType === "image") {
  //     return <ImageScaler src={fileSrc} pt={aspectRatio} scale={1} />;
  // } else if (fileType === "video") {

  //     return (
  //     <>
  //         {showScreenshot && screenshot && <ImageScaler src={screenshot} pt={aspectRatio} scale={1} />}
  //         <Button onClick={handleScreenshot} variant="outlined">Screenshot</Button>
  //         <VideoScaler vidRef={videoRef} src={fileSrc} pt={aspectRatio} scale={1} />
  //     </>
  // )}

  // return <p>Unsupported file type.</p>;
};

export default FilePreview;

interface PreviewProps {
  src: string;
  isVideo: boolean;
  onScreenshot?: (
    dataUrl: string,
    size: { width: number; height: number; aspectRatio: number }
  ) => void;
  onScreenshotText?: string;
}

const Preview: React.FC<PreviewProps> = ({ src, isVideo, onScreenshot, onScreenshotText = 'Screenshot' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScreenshot = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if(!isVideo) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        onScreenshot && onScreenshot(src, { width: img.width, height: img.height, aspectRatio: img.height / img.width });
      };
    }
    if (!videoRef.current || !onScreenshot) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const size = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
      aspectRatio: videoRef.current.videoHeight / videoRef.current.videoWidth
    };
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    onScreenshot(dataUrl, size);
  };

  if (!isVideo) {
    return (
      <div className="flex flex-col gap-2">
        {onScreenshot && (
          <Button variant="outlined" onClick={handleScreenshot}>
            {onScreenshotText}
          </Button>
        )}
        <div className="relative w-full rounded-lg overflow-hidden">
          <img src={src} alt="Preview" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="flex flex-col gap-2">
        {onScreenshot && (
          <Button variant="outlined" onClick={handleScreenshot}>
            {onScreenshotText}
          </Button>
        )}

        <div className="relative w-full rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={src}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return null;
};

export { Preview };
