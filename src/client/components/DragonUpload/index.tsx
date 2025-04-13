import React, { createRef, useEffect, useMemo, useState } from "react";
import { Button } from "@deckai/deck-ui";
import FilePreview from "./FilePreview";
import { MediaInfo } from "@deckai/client/types";

interface DragonUploadProps {
  onFilesSelected?: (files: File[]) => void;
  children?: React.ReactNode;
  onScreenshot?: (dataUrl: string, imageInfo: MediaInfo) => void;
  multiple?: boolean;
  fileTypes?: string[];
}

const DragonUpload: React.FC<DragonUploadProps> = ({
  onFilesSelected,
  children,
  onScreenshot,
  multiple = false,
  fileTypes = ["image/*", "video/*"]
}) => {
  const [files, setFiles] = useState<File[]>([]);
  // refid for browse
  const browseRef = createRef<HTMLInputElement>();

  const handleFileChange = (event: any) => {
    //const selectedFiles = event.target.files as FileList;
    const selectedFiles = getValidFiles(event.target.files as FileList);
    if (selectedFiles && selectedFiles.length > 0) {
      if (multiple) {
        const newFiles = Array.from(selectedFiles);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setFiles([selectedFiles[0]]);
      }
    }
    onFilesSelected?.(selectedFiles);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    //const droppedFiles = event.dataTransfer.files as FileList;
    const droppedFiles = getValidFiles(event.dataTransfer.files as FileList);
    if (droppedFiles.length > 0) {
      if (multiple) {
        const newFiles = Array.from(droppedFiles);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setFiles([droppedFiles[0]]);
      }
    }
  };

  const getValidFiles = (files: FileList) => {
    return Array.from(files).filter((file) => fileTypes.includes(file.type));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    browseRef.current?.click();
  };

  const handleUpload = async (index: number) => {
    var preExistingMediaId = 1;
    var myWorkId = 2;
    var field = "Content";
    //var field = "DisplayImage";

    const formData = new FormData();
    formData.append("files", files[index]);
    formData.append("refId", myWorkId.toString());
    formData.append("ref", "api::work.work");
    formData.append("field", field);

    var endpoint = "/api/upload";

    var updatePreExisting = false;
    if (updatePreExisting) {
      endpoint = endpoint + `?id=${preExistingMediaId}`;
    }

    const options = {
      method: "POST",
      body: formData
    };
    const response = await fetch(endpoint, options);
    const result = await response.json();
    alert("upload complete: " + JSON.stringify(result));
  };

  return (
    <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        {children}
      </div>
      <input
        type="file"
        hidden
        ref={browseRef}
        onChange={handleFileChange}
        accept={fileTypes.join(",")}
        multiple={multiple}
      />
      {files.length > 0 &&
        files.map((file, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 p-4 border border-background-50 rounded-lg"
          >
            <FilePreview file={file} onScreenshot={onScreenshot} />
            <div className="flex flex-col gap-1">
              <p className="text-md font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                onClick={() => handleRemoveFile(index)}
              >
                Remove
              </Button>
              <Button variant="filled" onClick={() => handleUpload(index)}>
                Upload
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DragonUpload;
