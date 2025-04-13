import React from 'react';
import { ImageProps } from '@deckai/client/media';

const ImageComponent: React.FC<ImageProps> = ({ src, alt, className }) => {
  return (
    <img src={src} alt={alt} className={className} />
  );
};

// use @image to handle which image component to render
export default ImageComponent;
export { ImageComponent as Image };
