"use client";
import type {
  BreadcrumbsProps,
  NavbarItemProps,
  OptionProps
} from "@deckai/deck-ui";
import { Breadcrumbs, Button, Icon, Navbar, Text, cn } from "@deckai/deck-ui";
import React, { useCallback, useMemo } from "react";

import { getMenuItems } from "@deckai/client";
import type * as CMS from "@deckai/client/types/cms";
import { useSiteRouter } from "@site";
import { profileImage } from "@deckai/client/types/cms";

const navbarItems: NavbarItemProps[] = [
  {
    title: "My Orders",
    iconName: "folder-2",
    onClick: () => {}
  },
  {
    iconName: "message-text",
    title: "Message",
    onClick: () => {},
    disabled: true,
    tooltip: "Messages Coming Soon"
  },
  {
    iconName: "notification",
    title: "Notifications",
    onClick: () => {},
    hasNotification: true,
    disabled: true,
    tooltip: "Notifications Coming Soon"
  },
  {
    iconName: "heart",
    title: "Favorites",
    onClick: () => {},
    disabled: true,
    tooltip: "Favorites Coming Soon"
  }
];

export const NewLayout = ({
  children,
  user,
  launchEditMode,
  showBreadcrumbs = true,
  contentClassName,
  className
}: {
  children: React.ReactNode;
  user?: CMS.SessionUser;
  launchEditMode?: () => void;
  isAuthenticated?: boolean;
  showBreadcrumbs?: boolean;
  contentClassName?: string;
  className?: string;
}) => {
  const Router = useSiteRouter();
  const pathname = Router.pathname ?? "";
  const breadcrumbItems: BreadcrumbsProps["items"] = [
    {
      // get the last part of the pathname and capitalize it
      label: `${pathname.split("/").pop()?.charAt(0).toUpperCase()}${pathname.split("/").pop()?.slice(1)}`,
      href: pathname
    }
  ];
  const handleSignIn = useCallback(() => {
    Router.goToSignIn();
  }, [Router]);

  const profileMenuItems: OptionProps[] = useMemo(() => {
      
    return getMenuItems(Router, user?.IsVerifiedCreator ?? false);
  }, [user, Router]);
  
  return (
    <div
      className={cn(
        "flex flex-col w-screen max-w-screen overflow-x-hidden",
        className
      )}
    >
      <div className="sm:relative sticky top-0 bg-background-0 z-10">
        <Navbar
          avatarImage={profileImage(user) ?? undefined}
          profileMenuItems={profileMenuItems}
          navbarItems={navbarItems}
          searchOptions={[]}
          onLogoClick={() => Router.goToHome()}
          onSearchChange={() => {}}
          isAuthenticated={!!user}
          handleSignIn={handleSignIn}
        />
        {showBreadcrumbs && (
          <div className="lg:px-10 md:px-5 px-6">
            <Breadcrumbs
              items={breadcrumbItems}
              onHomeClick={() => Router.goToHome()}
            >
              {launchEditMode && (
                <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-background-100 border border-secondary-50 lg:gap-6 gap-4 md:max-w-[70%] self-end">
                  <Text
                    variant={["lg:body-default-medium", "body-xxs-semibold"]}
                  >
                    This is your Creator profile. To make changes, open the
                    Editor.
                  </Text>
                  <Button
                    variant="filled"
                    color="black"
                    onClick={launchEditMode}
                    className="flex items-center gap-1 !px-3"
                  >
                    <Text
                      variant={["lg:body-default-medium", "body-xxs-semibold"]}
                      color="white"
                    >
                      Edit
                    </Text>
                    <Icon
                      name="pen"
                      color="white"
                      size={18}
                      className="-mt-1"
                    />
                  </Button>
                </div>
              )}
            </Breadcrumbs>
          </div>
        )}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col lg:px-10 md:px-5 px-6 gap-6 pt-4",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
