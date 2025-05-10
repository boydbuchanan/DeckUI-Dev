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
import { Footer } from "@deckai/client/layout/Footer";
import { SessionData } from "@deckai/client/types/session";

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

export const PageLayout = ({
  children,
  session,
  showBreadcrumbs = true,
  contentClassName,
  className
}: {
  children: React.ReactNode;
  session: SessionData,
  launchEditMode?: () => void;
  isAuthenticated?: boolean;
  showBreadcrumbs?: boolean;
  contentClassName?: string;
  className?: string;
}) => {
  const Router = useSiteRouter();
  const pathname = Router.pathname ?? "";
  const user = session.Auth?.user ?? undefined;
  var pathItems = pathname.split("/").filter((item) => item !== "");
  
  var breadcrumbItems: BreadcrumbsProps["items"] = pathItems.map((item, index) => {
    var path = "/" + pathItems.slice(0, index + 1).join("/");
    var label = item.charAt(0).toUpperCase() + item.slice(1);
    return {
      label: label,
      href: path,
    };
  });
  
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
      <Footer />
    </div>
  );
};
