import {
  Button,
  Icon,
  Input,
  Text,
  useMediaQuery,
  useToast
} from "@deckai/deck-ui";
import React, { useCallback, useEffect, useState } from "react";

import { Assets } from "@site";
import { Image } from "@image";

const designerImage = Assets.images.designer;

export const CalloutLayout = ({ 
  title = "Deck",
  description,
  children 
}: {
  title?: string;
  description?: string;
  children: React.ReactNode
}) => {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <div className="flex h-full min-h-screen w-screen p-8 bg-secondary-400 justify-center items-center relative">
      <div className="flex justify-center items-center md:flex-row flex-col md:gap-32 gap-20">
        <div className="flex flex-col justify-center items-center md:relative absolute top-16 inset-x-0">
          <Text
            variant="heading-xl"
            className="text-center bg-gradient-to-r from-[#0F5B73] to-[#089CCB] text-transparent bg-clip-text"
          >
            {title}
          </Text>
          {description && (
            <Text variant="body-md" className="text-center">
              {description}
            </Text>
          )}
          <Image
            src={designerImage}
            alt="Deck Creator"
            className={`w-${isMobile ? "300" : "500"} h-${isMobile ? "300" : "500"}`}
          />
        </div>
        <div className="absolute top-16 inset-x-0 z-10 animate-slide-in-from-bottom-to-top md:relative flex flex-col max-w-sm mx-auto my-auto gap-8 px-10 py-8 bg-background-0 rounded-xl shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
};
