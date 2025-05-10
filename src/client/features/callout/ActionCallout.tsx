import { Text } from "@deckai/deck-ui";
import React, { useCallback, useState } from "react";

export const ActionCallout = ({
  title,
  header,
  children,
  footer,
}: {
  title?: string;
  header?: string;
  children?: React.ReactNode;
  footer?: string;
}) => {

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
      {title && (
      <Text variant="heading-md">{title}</Text>
      )}
      {header && (
      <Text variant="body-md" className="text-center">
        {header}
      </Text>
      )}
        {children}
      {footer && (
      <Text variant="body-xxs" color="secondary" className="text-center">
        {footer}
      </Text>
      )}
    </div>
  );
};
