import React from 'react';
import Image from 'next/image';
import { ImageProps } from '@deckai/client/media';

const NextImage: React.FC<ImageProps> = ({ src, alt, className }) => {
    return (
      <Image src={src} alt={alt} className={className} />
    );
  };

// use @image to handle which image component to render
export default NextImage;
export { NextImage as Image };