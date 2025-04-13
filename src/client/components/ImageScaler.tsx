import React from "react";
import { Component, createRef } from "react";
import { MediaInfo } from "@deckai/client/types";
import { horizontalStyle, verticalStyle } from "@deckai/client/media";

const ImageScaler = ({
  src,
  divClass = "",
  imgClass = "",
  height = "100%",
  pt = undefined,
  //pt = 56.25, // 16 : 9
  //pt = 178, // 9 : 16
  //pt = 133, // 4: 3
  //pt = 75, // 3: 4
  //pt = 150, // 3: 2
  //pt = 67, // 2: 3
  scale = 1,
  sx = {},
  onLoadedMedia
}: {
  src: string;
  divClass?: string;
  imgClass?: string;
  height?: string;
  pt?: number;
  scale?: number;
  sx?: any;
  onLoadedMedia?: (size: MediaInfo) => void
}) => {
  const width = 100 * scale;
  const paddingTop = pt && `${pt * scale}%`;
  const onLoadedMetadata = () => {
    
  }
  return (
    <div
      className={divClass}
      style={{
        width: `${width}%`,
        height: height,
        paddingTop: paddingTop, // 16:9 aspect ratio (adjust as needed)
        position: "relative",
        overflow: "hidden",
        ...sx
      }}
    >
      <img
        src={src}
        alt="Image"
        className={imgClass}
        onLoadedMetadata={onLoadedMetadata}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          objectFit: "cover"
        }}
      />
    </div>
  );
};

export default ImageScaler;

const VideoScaler = ({
  vidRef,
  src,
  divClass = "",
  imgClass = "",
  //pt = 56.25, // 16 : 9
  pt = 178, // 9 : 16
  //pt = 133, // 4: 3
  //pt = 75, // 3: 4
  //pt = 150, // 3: 2
  //pt = 67, // 2: 3
  scale = 1,
  controls = true,
  onLoadedMedia
}: {
  vidRef: any;
  src: string;
  divClass?: string;
  imgClass?: string;
  pt?: number;
  scale?: number;
  controls?: boolean;
  onLoadedMedia?: (size: MediaInfo) => void
}) => {
  const [dimension, setDimension] = React.useState({
    width: 0,
    height: 0,
    aspectRatio: 0
  });
  
  const [paddingTop, setPaddingTop] = React.useState(pt * scale);
  const [containerStyle, setContainerStyle] = React.useState({
    width: `${100 * scale}%`,
    height: "auto",
    paddingTop: `${pt * scale}%`,
  });
  const [videoStyle, setVideoStyle] = React.useState({
    width: "100%",
    height: "100%",
  });
  
  const onLoadedMetadata = () => {
    
    const video = vidRef.current;
    
    const dimension: MediaInfo = {
      width: video.videoWidth,
      height: video.videoHeight,
      aspectRatio: video.videoWidth / video.videoHeight
    };
    setDimension(dimension);
    setPaddingTop(dimension.aspectRatio * scale)

    if(video.videoWidth > video.videoHeight) {
      setContainerStyle({
        width: `${100 * scale}%`,
        height: "auto",
        paddingTop: `${dimension.aspectRatio * 100}%`,
      });
      setVideoStyle(verticalStyle);
    }else{
      setContainerStyle({
        width: "auto",
        height: `${100 * scale}%`,
        paddingTop: `${dimension.aspectRatio * 100}%`,
      });
      setVideoStyle(horizontalStyle);
    }
    onLoadedMedia?.(dimension);

    if (vidRef.current) {
      vidRef.current.play();
    }
  };


  return (
    <div
      className={divClass}
      style={{
        // position: "relative",
        overflow: "hidden",
        ...containerStyle
      }}
    >
      <video
        ref={vidRef}
        onLoadedMetadata={onLoadedMetadata}
        src={src}
        className={imgClass}
        controls={controls}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          objectFit: "cover",
          ...videoStyle
        }}
      />
    </div>
  );
};

interface ImageFillProps {
  src: string;
}

interface ImageFillState {
  reload: boolean;
}

class ImageFill extends Component<ImageFillProps, ImageFillState> {
  constructor(props: ImageFillProps) {
    super(props);
    this.state = {
      reload: false
    };
  }

  render() {
    const { src } = this.props;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        <img
          src={src}
          alt=""
          style={{ flexShrink: 0, minWidth: "100%", minHeight: "100%" }}
        />
      </div>
    );
  }
}

export { ImageFill, VideoScaler };
