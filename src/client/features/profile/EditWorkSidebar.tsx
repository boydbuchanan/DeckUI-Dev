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
  Icon,
  ProgressBar,
  Spinner,
  cn
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
import Me from "@me";

type Platform = "Instagram" | "Tiktok" | "Youtube";

type EditWorkSidebarProps = {
  open: boolean;
  onClose: () => void;
  options?: CMS.Category[];
  work: CMS.Work | undefined;
  newInterest?: CMS.Interest | null;
  handleSaveWork: (
    documentId?: string | undefined,
    workProperties?: CMS.UpdateWork
  ) => Promise<CMS.Work | null>;
  onWorkUpdate?: () => void;
};

export const EditWorkSidebar: React.FC<EditWorkSidebarProps> = ({
  open,
  onClose,
  options,
  work,
  newInterest,
  handleSaveWork,
  onWorkUpdate
}) => {
  // Interest
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);
  const isNewWork = useMemo(() => !documentId, [documentId]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | undefined>(undefined);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const selectedInterest = useMemo(() => {
    var id = parseInt(selectedValue);
    return options
      ?.flatMap((category) => category.interests)
      ?.find((interest) => interest.id === id);
  }, [options, selectedValue]);

  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [coverUpdated, setCoverUpdated] = useState(false);
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
  const [saveProgress, setSaveProgress] = useState<number>(0);
  
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

  var updateData: CMS.UpdateWork = useMemo(() => {
    return {
      Title: editWork.Title || undefined,
      Platform: editWork.Platform || undefined,
      interest: editWork.interest?.id || undefined,
      PostUrl: editWork.PostUrl || undefined
    };
  }, [work]);
  const [formData, setFormData] = useState(updateData);

  const onFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      console.log("Form Change", name, value === "", work);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  
  const isModified = useMemo(() => {
    return (
      coverFile !== undefined ||
      contentFile !== undefined ||
      coverUpdated ||
      formData.Title !== updateData.Title ||
      formData.Platform !== updateData?.Platform ||
      formData.interest !== updateData?.interest || 
      formData.PostUrl !== updateData?.PostUrl
    );
  }, [
    formData,
    updateData,
    work,
    coverUpdated,
    screenshot,
    selectedInterest?.id.toString()
  ]);

  // Handlers
  const handlePlatformChange = (value: string) => {
    setFormData((prev) => ({ ...prev, Platform: value, postUrl: "" }));
    // Reset URL when platform changes
    setUrlError(undefined);
  };

  const handleInterestSelect = (value: string) => {
    setSelectedValue(value);
    setFormData((prev) => ({ ...prev, interest: parseInt(value) }));
  };
  const setScreenShotAndRatio = (
    dataUrl: string,
    size: { width: number; height: number; aspectRatio: number }
  ) => {
    setScreenshot(dataUrl);
    setCoverDimensions(size);
    setCoverUpdated(true);
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
  const handleContentUpload = async (
    work: CMS.Work,
    contentSize: MediaInfo,
    contentFile: File
  ) => {
    var contentUpload = work.Content;
    var contentUploadId = contentUpload?.id || undefined;
    if (contentUploadId) {
      try {
        
        var deleteResponse = await Me.deleteUpload(contentUploadId);
        if (deleteResponse.status !== 200) {
          console.error("Failed to delete content", deleteResponse);
          return false;
        }
      } catch (error) {
        console.warn("Failed to delete content", error);
        return false;
      }
    }
    
    var ext = contentFile.name.split(".").pop();
    // Always upload a new file to get the correct mime type and dimensions
    const contentfileData = {
      alternativeText: contentFile.name,
      caption: contentFile?.size,
      height: contentSize?.height,
      width: contentSize?.width,
      ext,
    };
    try {
      setUploadMsg("Uploading Content ...");
      var contentUploadResponse = await Me.uploadWorkContent(
        contentFile,
        work,
        contentUploadId,
        contentfileData,
        (progress: number) => {
          setSaveProgress(progress);
        }
      );
      if (contentUploadResponse.status === 200) {
        console.log("Content Uploaded", contentUploadResponse);
        return true;
      }
    } catch (error) {
      console.error("Failed to upload content", error);
      return false;
    }
    return false;
  };
  const handleCoverUpload = async (
      work: CMS.Work,
      contentSize: MediaInfo,
      blob: Blob,
      coverFile?: File
    ) => {
      var coverUpload = work.DisplayImage;
      var coverUploadId = coverUpload?.id || undefined;
      var ext = (coverFile && coverFile.name.split(".").pop()) || undefined;
      const coverfileData = {
        alternativeText: coverFile?.name,
        caption: coverFile?.size,
        height: contentSize?.height,
        width: contentSize?.width,
        ext,
      };
      try {
        setUploadMsg("Uploading Cover ...");
        var coverUploadResponse = await Me.uploadWorkCover(
          blob,
          work,
          coverUploadId,
          coverfileData,
          (progress: number) => {
            setSaveProgress(progress);
          }
        );
        if (coverUploadResponse.status === 200) {
          console.log("Cover Image Uploaded", coverUploadResponse);
          onWorkUpdate?.();
          return true;
        }
      } catch (error) {
        console.warn("Cover Image Upload Failed", error);
      }
      return false;
    };

  const saveMyWork = async () => {
    setUploadMsg("Saving Work ...");
    var savedWork: CMS.Work | null = await handleSaveWork(
      documentId,
      formData
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
    onWorkUpdate?.();
  };

  return (
    <Sidebar open={open} onClose={onClose} title="Upload Work">
      <div className="flex flex-col gap-6 p-4">
        {/* Upload File Section */}
        <div className="flex flex-col gap-2">
          <Text variant="body-md">Upload Content</Text>
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
              onScreenshotText="Copy to Cover"
            />
          ) : contentEditUrl ? (
            <Preview
              src={contentEditUrl}
              isVideo={contentUpload?.mime?.includes("video") || false}
              onScreenshot={setScreenShotAndRatio}
              onScreenshotText="Copy to Cover"
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
                  onPositionChange={(position) => setCoverUpdated(true)}
                />
                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={slideValue}
                    onChange={(e) => {
                      setSlideValue(parseInt(e.target.value))
                      setCoverUpdated(true);
                    }}
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
            name="Title"
            value={formData.Title}
            onChange={onFormChange}
            placeholder="Enter title"
            required
            maxLength={40}
          />
          <RadioGroup
            label="Where is this media content from? (required)"
            value={formData.Platform}
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
            options={options && options?.map((category) => ({
              label: category.Display,
              options: category.interests.map((interest) => ({
                label: interest.Display,
                value: interest.id.toString()
              }))
            })) || []}
            label="Interest"
            placeholder="Select one"
            noOptionsMessage="No matching interest found"
          />

          <Input
            label="URL link"
            value={formData.PostUrl}
            onChange={onFormChange}
            name="PostUrl"
            placeholder={
              formData.Platform &&
              `https://www.${formData.Platform.toLowerCase()}.com/`
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
          // onClick={saveMyWork}
          onClick={async () => {
            setIsUploading(true);
            await saveMyWork();
            setIsUploading(false);            
          }}
          // onClick={async () => {
          //   setIsUploading(true);
          //   // await saveMyWork();
          //   // set interval to test progress bar, mock update the progress
          //   setUploadMsg("Uploading Content...");
          //   var interval = setInterval(() => {
          //     setSaveProgress((prev) => {
          //       if (prev >= 100) {
          //         clearInterval(interval);
          //         setIsUploading(false);
          //         return 0;
          //       }
          //       return prev + 10;
          //     });
          //   }, 500);
          // }}
          disabled={!isModified || isUploading}
        >
          <Text variant="body-lg-semibold" color="white">{!isUploading ? "Upload" : uploadMsg}</Text>
          
          <ProgressBar
            value={saveProgress || 0}
            className={cn(
              `${ isUploading ? "block" : "hidden" }`,
              "w-20 border-2 rounded-lg mx-4")
            }
          />
        </Button>
        
        
      </div>
    </Sidebar>
  );
};
