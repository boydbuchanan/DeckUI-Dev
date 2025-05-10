export type MediaFileInfo = {
  mimeType?: string;
  mediaInfo: MediaInfo;
  dataUrl: string;
};
export type MediaInfo = {
  width: number;
  height: number;
  aspectRatio: number;
  mimeType?: string;
};
export type SocialData = {
  platform: string;
  followerCount?: string;
  handle: string;
};
