import React, { useRef, useState, useCallback } from "react";
import AvatarEditor from "react-avatar-editor";
import { Avatar, Button, Icon } from "@deckai/deck-ui";

type ImageEditorProps = {
  src: string | undefined;
  height?: number;
  width?: number;
  borderRadius?: number;
  onGetBlob?: (blob: Blob, src: string | undefined) => void;
  handleSave?: (blob: Blob, src: string | undefined) => void;
};

const EditorControls: React.FC<{
  scale?: number,
  disabled?: boolean,
  handleScaleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleAccept?: () => void,
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}> = ({
  scale = 1,
  disabled,
  handleScaleChange,
  handleAccept,
  handleFileChange,
}) => {

  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
  <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="range"
        min={10}
        max={50}
        value={scale * 10}
        defaultValue={scale * 10}
        disabled={disabled}
        onChange={handleScaleChange}
        className="w-full"
      />
      <div className="flex justify-between gap-2">
        <Button
          variant="outlined"
          onClick={handleUploadClick}
          className="flex items-center gap-2"
        >
          <Icon name="export" size={20} />
          Upload Image
        </Button>
        <Button variant="filled" onClick={handleAccept} disabled={disabled}>
          Save
        </Button>
      </div>
    </div>
)};

export const ImageEditor = ({
  src,
  height = 256,
  width = 256,
  borderRadius = 0,
  onGetBlob,
  handleSave
}: ImageEditorProps) => {
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor>(null);
  const [imageSrc, setImageSrc] = useState<string | File | undefined>(src);

  // const handleScaleChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = parseFloat(e.target.value);
  //     setScale(value / 10);
  //   },
  //   []
  // );
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setScale(value / 10);
  };

  const handleAccept = useCallback(async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(
        (blob) => {
          if (blob && handleSave) {
            handleSave(blob, src);
          }
        },
        "image/jpeg",
        0.95
      );
    }
  }, [handleSave, src, imageSrc]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (onGetBlob) {
          onGetBlob(file, URL.createObjectURL(file));
        }
        setImageSrc(file);
      }
    },
    [onGetBlob, src, imageSrc]
  );

  if (!imageSrc || imageSrc == undefined) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex items-center justify-center w-[164px] h-[164px] m-4">
          <Avatar size={164} isLoading={true} />
        </div>
        <EditorControls disabled scale={scale} handleAccept={handleAccept} handleFileChange={handleFileChange} handleScaleChange={handleScaleChange} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AvatarEditor
        ref={editorRef}
        image={imageSrc}
        width={width}
        height={height}
        borderRadius={borderRadius}
        scale={scale}
        rotate={0}
        border={0}
        style={{ width: "100%", height: "100%" }}
        crossOrigin="anonymous"
      />
      <EditorControls scale={scale} handleAccept={handleAccept} handleFileChange={handleFileChange} handleScaleChange={handleScaleChange} />
    </div>
  );
};
