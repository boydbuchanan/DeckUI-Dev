import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  Sidebar,
  Input,
  Button,
  RadioGroup,
  Text,
  Combobox,
  Icon
} from "@deckai/deck-ui";
import * as CMS from "@deckai/client/types/cms";
import AvatarEditor from "react-avatar-editor";
import { formatFileSize } from "@deckai/client/utils";
import FileDrop from "@deckai/client/components/DragonUpload/FileDrop";
import FilePreview, {
  Preview
} from "@deckai/client/components/DragonUpload/FilePreview";

import {
  editImageUrl,
  getFileInfo,
  getFileVideoInfo,
  getImageInfo,
  getVideoInfo,
  getWorkImageUrl
} from "@deckai/client/media";
import { MediaFileInfo, MediaInfo } from "@deckai/client/types";
import MediaScaler from "@deckai/client/components/MediaScaler";

type Platform = "Instagram" | "Tiktok" | "Youtube";

type EditWorkSidebarProps = {
  open: boolean;
  onClose: () => void;
  options: CMS.Category[];
  work: CMS.Work | undefined;
  newInterest?: CMS.Interest | null;
  handleSaveWork: (
    documentId?: string | undefined,
    workProperties?: CMS.UpdateWork
  ) => Promise<CMS.Work | null>;
  handleContentUpload: (
    work: CMS.Work,
    contentSize: MediaInfo,
    contentFile: File
  ) => Promise<boolean>;
  handleCoverUpload: (
    work: CMS.Work,
    contentSize: MediaInfo,
    blob: Blob,
    coverFile?: File
  ) => Promise<boolean>;
};

export const EditWorkSidebar: React.FC<EditWorkSidebarProps> = ({
  open,
  onClose,
  options,
  work,
  newInterest,
  handleSaveWork,
  handleContentUpload,
  handleCoverUpload
}) => {
  // Interest
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);
  const isNewWork = useMemo(() => !documentId, [documentId]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const selectedInterest = useMemo(() => {
    var id = parseInt(selectedValue);
    return options
      .flatMap((category) => category.interests)
      .find((interest) => interest.id === id);
  }, [options, selectedValue]);

  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [contentEditUrl, setContentEditUrl] = useState<string | null>(null);

  const editWork = useMemo(() => {
    setDocumentId(work?.documentId);
    if (!work?.documentId) {
      setSelectedValue(newInterest?.id.toString() || "");
    } else {
      setSelectedValue(work?.interest?.id.toString() || "");
      if (work.DisplayImage?.url) {
        var workImageUrl = getWorkImageUrl(work.documentId);

        setScreenshot(workImageUrl);
      }
      if (work?.Content?.url) {
        setContentEditUrl(editImageUrl(work?.Content?.url));
      }
    }
    return work || new CMS.Work();
  }, [work, open]);

  // Cover Image
  const [coverFile, setCoverFile] = useState<File>();
  const [coverDimensions, setCoverDimensions] = useState({
    height: 0,
    width: 0,
    aspectRatio: 0
  });
  const [coverUpload, setCoverUpload] = useState<CMS.Upload | undefined>(
    editWork.DisplayImage || undefined
  );
  const [coverHover, setCoverHover] = useState<boolean>(false);

  // Video
  const [contentFile, setContentFile] = useState<File>();
  const [contentUpload, setContentUpload] = useState<CMS.Upload | undefined>(
    editWork.Content || undefined
  );
  const [videoDimensions, setVideoDimensions] = useState<MediaFileInfo>({
    mimeType: "",
    dataUrl: "",
    mediaInfo: { width: 0, height: 0, aspectRatio: 0 }
  });

  const [contentHover, setContentHover] = useState<boolean>(false);

  useEffect(() => {
    if (screenshot) {
      getImageInfo(screenshot, setCoverDimensions);
    }
  }, [screenshot]);

  useEffect(() => {
    if (contentFile) {
      getFileInfo(contentFile, setVideoDimensions);
    }
  }, [contentFile]);

  // Error state
  const [urlError, setUrlError] = useState<string | undefined>(undefined);

  // Form state
  const cropRef = useRef<AvatarEditor>(null);

  const [slideValue, setSlideValue] = useState(10);

  const [formData, setFormData] = useState({
    title: editWork.Title,
    platform: editWork.Platform,
    interest: selectedInterest?.id.toString() || null,
    postUrl: editWork.PostUrl
  });
  const onFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Handlers
  const handlePlatformChange = (value: string) => {
    setFormData((prev) => ({ ...prev, platform: value, postUrl: "" }));
    // Reset URL when platform changes
    setUrlError(undefined);
  };

  const handleInterestSelect = (value: string) => {
    setSelectedValue(value);
    setFormData((prev) => ({ ...prev, interest: value }));
  };
  const setScreenShotAndRatio = (
    dataUrl: string,
    size: { width: number; height: number; aspectRatio: number }
  ) => {
    setScreenshot(dataUrl);
    setCoverDimensions(size);
  };
  const onContentFilesSelected = async (files: File[]) => {
    setContentHover(false);
    if (files.length > 0) setContentFile(files[0]);
    else setContentFile(undefined);
  };
  const onCoverFileSelected = async (files: File[]) => {
    setCoverHover(false);
    if (!files || files.length <= 0) {
      setCoverFile(undefined);
    } else {
      const dataUrl = URL.createObjectURL(files[0]);

      setCoverFile(files[0]);
      setScreenshot(dataUrl);
    }
  };
  const saveMyWork = async () => {
    var workProperties: CMS.UpdateWork = {
      Title: formData.title,
      Platform: formData.platform,
      interest: selectedInterest?.id || undefined,
      PostUrl: formData.postUrl
    };
    var savedWork: CMS.Work | null = await handleSaveWork(
      documentId,
      workProperties
    );
    if (!savedWork) {
      console.error("Failed to save work");
      return;
    }

    try {
      // upload photo and video
      if (screenshot) {
        console.log("Uploading Cover Image");
        var dataUrl = screenshot;
        let coverInfo: MediaInfo = {
          width: coverDimensions.width,
          height: coverDimensions.height,
          aspectRatio: coverDimensions.aspectRatio
        };
        console.log(
          "Original Height:",
          coverInfo.height,
          " OriginalWidth: ",
          coverInfo.width
        );
        if (cropRef && cropRef.current) {
          dataUrl = cropRef.current.getImageScaledToCanvas().toDataURL();
          coverInfo.height = cropRef.current.getImageScaledToCanvas().height;
          coverInfo.width = cropRef.current.getImageScaledToCanvas().width;
          coverInfo.aspectRatio = coverInfo.height / coverInfo.width;
          console.log(
            "Cropped Height:",
            coverInfo.height,
            " Cropped Width: ",
            coverInfo.width
          );
        }

        const result = await fetch(dataUrl);
        const blob = await result.blob();

        // Upload cover image
        var coverSuccess = await handleCoverUpload(
          savedWork,
          coverInfo,
          blob,
          coverFile
        );
        if (!coverSuccess) {
          console.error("Failed to upload cover image");
          return;
        }
      }
      if (contentFile) {
        console.log("Uploading Content File");
        var contentSuccess = await handleContentUpload(
          savedWork,
          videoDimensions.mediaInfo,
          contentFile
        );

        if (!contentSuccess) {
          console.error("Failed to upload content file");
          return;
        }
      }
    } catch (error) {
      console.error("Failed to save work", error);
    }
  };

  return (
    <Sidebar open={open} onClose={onClose} title="Upload Work">
      <div className="flex flex-col gap-6 p-4">
        {/* Upload File Section */}
        <div className="flex flex-col gap-2">
          <Text variant="body-md">Upload file</Text>
          <Text variant="label-default" color="secondary">
            Supported video file formats: mp4, MOV, WMV, WEBM
          </Text>
          <FileDrop
            onFilesSelected={onContentFilesSelected}
            fileTypes={["image/*", "video/*"]}
            maxSizeMB={100}
            onDragOver={(event) => {
              event.preventDefault();
              setContentHover(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setContentHover(false);
            }}
          >
            <div
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg ${contentHover ? "bg-secondary-400" : ""} border-primary-${contentHover ? 100 : 500} transition-colors cursor-pointer`}
            >
              {contentFile ? (
                <div className="flex flex-col items-center gap-2">
                  <Text variant="body-lg-semibold">{contentFile.name}</Text>
                  <Text variant="label-default" color="secondary">
                    {formatFileSize(contentFile?.size || 0)}
                  </Text>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </>
              )}
            </div>
          </FileDrop>
          {contentFile ? (
            <FilePreview
              file={contentFile}
              onScreenshot={setScreenShotAndRatio}
            />
          ) : contentEditUrl ? (
            <Preview
              src={contentEditUrl}
              isVideo={true}
              onScreenshot={setScreenShotAndRatio}
            />
          ) : contentUpload && contentUpload.url ? (
            <MediaScaler
              src={contentUpload.url}
              mimeType={contentUpload.mime}
              aspectRatio={contentUpload.width / contentUpload.height}
            />
          ) : (
            <></>
          )}
        </div>

        {/* Cover Image Section */}
        <div className="flex flex-col gap-2">
          <Text variant="body-md">Cover image</Text>
          <Text variant="label-default" color="secondary">
            File limit: 15MB. Supported files: .jpg, .png
          </Text>
          <FileDrop
            onFilesSelected={onCoverFileSelected}
            fileTypes={["image/*"]}
            maxSizeMB={15}
            onDragOver={(event) => {
              event.preventDefault();
              setCoverHover(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setCoverHover(false);
            }}
          >
            <div
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg ${coverHover ? "bg-secondary-400" : ""} border-primary-${coverHover ? 100 : 500} transition-colors cursor-pointer`}
            >
              {screenshot && contentFile ? (
                <div className="flex flex-col items-center gap-2">
                  <Text variant="body-lg-semibold">Screenshot</Text>
                  <Text variant="label-default" color="secondary">
                    {contentFile.name}
                  </Text>
                </div>
              ) : coverFile ? (
                <div className="flex flex-col items-center gap-2">
                  <Text variant="body-lg-semibold">{coverFile.name}</Text>
                  <Text variant="label-default" color="secondary">
                    {formatFileSize(coverFile?.size || 0)}
                  </Text>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </>
              )}
            </div>
          </FileDrop>

          {screenshot ? (
            <div className="border border-background-50 rounded-lg p-4">
              <div className="flex flex-col items-center gap-2">
                <AvatarEditor
                  ref={cropRef}
                  image={screenshot || ""}
                  width={128}
                  height={256}
                  scale={slideValue / 10}
                  rotate={0}
                  border={20}
                  color={[255, 255, 255, 0.6]} // RGBA
                  // style={{ width: "100%", height: "100%" }}
                  crossOrigin="anonymous"
                />
                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={slideValue}
                    onChange={(e) => setSlideValue(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ) : coverFile ? (
            <FilePreview file={coverFile} />
          ) : (
            coverUpload &&
            coverUpload.url && (
              <MediaScaler
                src={coverUpload.url}
                mimeType={coverUpload.mime}
                aspectRatio={1}
              />
            )
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Text variant="body-md">Content</Text>
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={onFormChange}
            placeholder="Enter title"
            required
            maxLength={40}
          />
          <RadioGroup
            label="Where is this media content from? (required)"
            value={formData.platform}
            onChange={handlePlatformChange}
            options={[
              { value: "Instagram", label: "Instagram" },
              { value: "Tiktok", label: "Tiktok" },
              { value: "Youtube", label: "Youtube" }
            ]}
          />
          <Combobox
            value={selectedValue}
            onSelected={handleInterestSelect}
            options={options.map((category) => ({
              label: category.Display,
              options: category.interests.map((interest) => ({
                label: interest.Display,
                value: interest.id.toString()
              }))
            }))}
            label="Interest"
            placeholder="Select one"
            noOptionsMessage="No matching interest found"
          />

          <Input
            label="URL link"
            value={formData.postUrl}
            onChange={onFormChange}
            name="postUrl"
            placeholder={
              formData.platform &&
              `https://www.${formData.platform.toLowerCase()}.com/`
            }
            error={!!urlError}
            helperText={
              urlError ||
              "Link will bring your profile viewers to the designated app platform"
            }
          />
        </div>

        <Button
          variant="filled"
          color="black"
          onClick={saveMyWork}
          disabled={
            !formData.title ||
            !formData.platform ||
            selectedValue.length === 0 ||
            !!urlError
          }
          className="mt-4"
        >
          Upload
        </Button>
      </div>
    </Sidebar>
  );
};
