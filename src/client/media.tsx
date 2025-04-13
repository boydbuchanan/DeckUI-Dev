import { addPath } from "@deckai/client/utils";
import { ApiConfig } from "@site";
import { MediaFileInfo, MediaInfo } from "./types";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}
export type { ImageProps };

export const editImageUrl = (imageUrl: any) => {
  return addPath(ApiConfig.APIURL, `img/edit/?imageUrl=${imageUrl}`);
};
export const getWorkImageUrl = (id: any) => {
  return addPath(ApiConfig.APIURL, `img/work/?workId=${id}`);
};

export const horizontalStyle = {
  width: "auto",
  height: "100%",
};
export const verticalStyle = {
  width: "100%",
  height: "auto",
};
export const getStyle = (aspectRatio: number) => {
  if (aspectRatio > 1) {
    return horizontalStyle;
  } else {
    return verticalStyle;
  }
}

export const getFileInfo = (
  file: File,
  onload?: (size: MediaFileInfo) => void
): Promise<MediaInfo> => {
  var fileType = file.type.split("/")[0];
  var fileInfo: MediaFileInfo = {
    mimeType: file.type,
    mediaInfo: { width: 0, height: 0, aspectRatio: 0 },
    dataUrl: URL.createObjectURL(file)
  };
  if (fileType === "image") {
    return getImageInfo(fileInfo.dataUrl, (size) => {
      fileInfo.mediaInfo = size;
      if (onload) onload(fileInfo);
    });
  } else if (fileType === "video") {
    return getVideoInfo(fileInfo.dataUrl, (size) => {
      fileInfo.mediaInfo = size;
      if (onload) onload(fileInfo);
    });
  } else {
    return Promise.reject("Unsupported file type");
  }
};

export const getFileImageInfo = (
  file: File,
  onload?: (size: MediaInfo) => void
): Promise<MediaInfo> => {
  var src = URL.createObjectURL(file);
  return getImageInfo(src, onload);
};
export const getImageInfo = (
  src: string,
  onload?: (size: MediaInfo) => void
): Promise<MediaInfo> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const imageSize = {
        width: img.width,
        height: img.height,
        aspectRatio: img.height / img.width
      };
      if (onload) onload(imageSize);
      resolve(imageSize);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

export const getFileVideoInfo = (
  file: File,
  onload?: (size: MediaInfo) => void
): Promise<MediaInfo> => {
  var src = URL.createObjectURL(file);
  return getVideoInfo(src, onload);
};

export const getVideoInfo = (
  src: string,
  onload?: (size: MediaInfo) => void
): Promise<MediaInfo> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      const dimension = {
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoHeight / video.videoWidth
      };
      if (onload) onload(dimension);
      resolve(dimension);
    };
    video.onerror = (err) => reject(err);
    video.src = src;
  });
};
export const getMediaInfo = (
  src: string,
  mimeType: string,
  onload?: (size: MediaInfo) => void
): Promise<MediaInfo> => {
  if (mimeType.startsWith("image/")) {
    return getImageInfo(src, onload);
  } else if (mimeType.startsWith("video/")) {
    return getVideoInfo(src, onload);
  } else {
    return Promise.reject("Unsupported mime type");
  }
}

export const imageUrlToDataUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    // console log error
    img.onerror = (err) => {
      console.error(err);
      reject(err);
    };
    //img.onerror = (err) => reject(err);
    img.src = url;
  });
};
