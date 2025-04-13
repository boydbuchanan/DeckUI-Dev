import React, { createRef, useEffect, useState } from "react";

interface DragonFileDropProps {
  onFilesSelected?: (files: File[]) => void;
  children?: React.ReactNode;
  multiple?: boolean;
  fileTypes?: string[];
  maxSizeMB?: number;
  onDragOver?: (event: any) => void;
  onDragLeave?: (event: any) => void;
}

export const DragonFileDrop: React.FC<DragonFileDropProps> = ({
  onFilesSelected,
  children,
  multiple = false,
  maxSizeMB = 10, // 10MB
  fileTypes = ["image/*", "video/*"],
  onDragOver = (event: any) => {
    event.preventDefault();
  },
  onDragLeave = (event: any) => {
    event.preventDefault();
  }
}) => {
  const browseRef = createRef<HTMLInputElement>();
  const [files, setFiles] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState("");
  const maxFileSize = maxSizeMB * 1024 * 1024;
  let validFileTypes: string[] = [];
  fileTypes.forEach((type) => {
    if (type === "image/*") {
      validFileTypes.push("image/jpeg");
      validFileTypes.push("image/png");
      //validFileTypes.push("image/gif");
      //validFileTypes.push("image/webp");
    } else if (type === "video/*") {
      validFileTypes.push("video/mp4");
      validFileTypes.push("video/webm");
      validFileTypes.push("video/ogg");
    } else {
      validFileTypes.push(type);
    }
  });

  const handleFileChange = (event: any) => {
    //const selectedFiles = event.target.files as FileList;
    const selectedFiles = validateFiles(event.target.files as FileList);
    if (selectedFiles && selectedFiles.length > 0) {
      if (multiple) {
        const newFiles = Array.from(selectedFiles);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setFiles([selectedFiles[0]]);
      }
    }
    onFilesSelected?.(files);
  };
  const handleDrop = (event: any) => {
    event.preventDefault();
    //const droppedFiles = event.dataTransfer.files as FileList;
    console.log("handleDrop: ", event.dataTransfer.files);
    const droppedFiles = validateFiles(event.dataTransfer.files as FileList);
    console.log(droppedFiles);
    if (droppedFiles.length > 0) {
      if (multiple) {
        const newFiles = Array.from(droppedFiles);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setFiles([droppedFiles[0]]);
      }
    }
    onFilesSelected?.(droppedFiles);
  };
  const getValidFiles = (files: FileList) => {
    console.log("Valid File Types", validFileTypes);
    return Array.from(files).filter(
      (file) => validFileTypes.includes(file.type) && file.size <= maxFileSize
    );
  };

  const validateFiles = (files: FileList) => {
    const validatedFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!validFileTypes.includes(file.type)) {
        errors.push(`Invalid file type: ${file.name}`);
      } else if (file.size > maxFileSize) {
        errors.push(`File too large: ${file.name}`);
      } else {
        validatedFiles.push(file);
      }
    });

    if (errors.length > 0) {
      console.log(errors.join("\n")); // Show validation errors
    }

    return validatedFiles;
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const browseFiles = () => {
    // clear the files
    setFiles([]);
    setInputValue("");
    browseRef.current?.click();
  };
  const setInputFromFiles = (files: File[]) => {
    setInputValue(files.map((file) => file.name).join(", "));
  };

  // useEffect(() => {
  //     //onFilesSelected(files);
  //     setInputFromFiles(files);
  // }, [files, onFilesSelected]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={browseFiles}
    >
      <>
        {children}

        <input
          type="file"
          hidden
          multiple={multiple}
          value={inputValue}
          ref={browseRef}
          onChange={handleFileChange}
          accept={fileTypes.join(",")}
        />
      </>
    </div>
  );
};

export default DragonFileDrop;
