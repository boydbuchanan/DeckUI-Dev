import { OfferState, OfferType } from "@deckai/client/types/cms";
import { Avatar, Button, cn, Icon, Link, Text } from "@deckai/deck-ui";
import { useSiteRouter } from "@site";
import React, { useCallback, useMemo } from "react";



export type OfferCardProps = {
  title: string;
  username: string;
  userAvatar?: string;
  description: string;
  type?: string;
  status?: OfferState;
  date?: string;
  inDanger?: boolean;
  className?: string;
  onClick?: () => void;
  onClickEdit?: () => void;
};

export const OfferCard: React.FC<OfferCardProps> = ({
  title,
  username,
  userAvatar,
  description,
  type,
  status,
  date,
  inDanger,
  className,
  onClick,
  onClickEdit,
}) => {
  const siteRouter = useSiteRouter();

  const statusColor = useMemo(() => {
  if(status === OfferState.Unavailable) return "bg-black";
    if(inDanger) return "bg-danger";
    switch (status) {
      case OfferState.Enabled:
        return "bg-primary-100";
      case OfferState.Disabled:
        return "bg-black";
      default:
        return "bg-background-0";
    }
  }, [status, inDanger]);

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg p-4 border border-stroke h-[270px] relative h-full",
        status !== OfferState.Enabled ? "bg-background-50" : "bg-background-0",
        className
      )}
    >
      <div className="flex flex-grow flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-md px-3 py-2",
                status !== OfferState.Enabled ? "bg-background-0" : "bg-secondary-400"
              )}
            >
              <Text variant="body-lg-semibold" color="primary">
                {title}
              </Text>
            </div>
          </div>
          <div className={cn("rounded-full h-4 w-4", statusColor)}></div>
        </div>
        
        {(userAvatar || username) && (
          <div className="flex items-center gap-2">
            {userAvatar && (
              <Avatar src={userAvatar} size={32} alt={username} className="mr-2" />
            ) || (
              <div className="relative w-7 h-7 bg-secondary-50 rounded-full flex items-center justify-center">
                <Icon
                  name={"user"}
                  size={20}
                  className="absolute inset-0 m-auto z-0"
                />
              </div>
            )}
            {username && (
            <Text variant="body-default-medium">{username}</Text>
            )}
          </div>
        )}

        <Text variant="body-default" className="line-clamp-2">
          {description}
        </Text>
        
      </div>
      {type && (
      <div className="flex items-center gap-2 flex-start">
        <Text variant="body-default">Type:</Text>
        <Text variant="body-default-bold" className="capitalize">{type}</Text> 
      </div>
      )}
      {status && (
      <div className="flex items-center gap-2 flex-start">
        <Text variant="body-default">Status:</Text>
        <Text variant="body-default-bold" className="capitalize">{status}</Text> 
      </div>
      )}
      {date && (
          <Text variant="body-xxs-medium" 
            color={inDanger ? "danger" : "primary-100"}>
              {inDanger ? "Expired" : "Expires"}: {date}
            </Text>
      )}
      {onClick || onClickEdit ? (
        <div className="flex items-center justify-between absolute bottom-4 right-4 gap-4">
          {onClickEdit && (
            <Icon name={"edit"} onClick={onClickEdit}  className="cursor-pointer" />
          )}
          {onClick && (
          <Icon name={"eye"} onClick={onClick} className="cursor-pointer" />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default OfferCard;
