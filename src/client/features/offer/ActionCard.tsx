import { Avatar, Button, cn, Link, Text } from "@deckai/deck-ui";
import React, { useCallback } from "react";



export type ActionCardProps = {
  title: string;
  description: string;
  actionText?: string;
  className?: string;
  onClick?: () => void;
};

export const OfferCard: React.FC<ActionCardProps> = ({
  title,
  description,
  actionText,
  className,
  onClick,
}) => {

  return (
    <div
      className={cn("flex flex-col rounded-lg p-4 border border-stroke h-[270px] relative", className)}
    >
      <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Text variant="body-lg-semibold" color="primary">
              {title}
            </Text>
          </div>
        </div>

        <Text variant="body-default">
          {description}
        </Text>
        {onClick && (
          <Button
            onClick={onClick}
            variant="filled"
            className="absolute bottom-4 right-4"
          >
            {actionText ?? "Ok"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
