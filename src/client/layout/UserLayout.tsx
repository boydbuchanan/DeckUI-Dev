"use client";
import type {
  BreadcrumbsProps,
  NavbarItemProps,
  OptionProps
} from "@deckai/deck-ui";
import { Breadcrumbs, Button, Icon, Navbar, Text, cn } from "@deckai/deck-ui";
import React, { useCallback, useMemo, useState } from "react";

import { getMenuItems } from "@deckai/client";
import type * as CMS from "@deckai/client/types/cms";
import { useSiteRouter } from "@site";
import { profileImage } from "@deckai/client/types/cms";
import { Footer } from "@deckai/client/layout/Footer";
import { ProfileEditor, SidebarTab } from "@deckai/client/features/profile/ProfileEditor";
import Me from "@me";
import type { MediaInfo } from "@deckai/client/types";

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

export const UserLayout = ({
  children,
  currentUser,
  openEditor,
  onClose,
  showBreadcrumbs = true,
  contentClassName,
  className,
  showTab,
}: {
  children: React.ReactNode;
  currentUser: CMS.User;
  onClose: () => void;
  openEditor?: boolean;
  showBreadcrumbs?: boolean;
  contentClassName?: string;
  className?: string;
  showTab?: SidebarTab;
}) => {
  // const { show, toasts } = useToast();

  const Router = useSiteRouter();
  const pathname = Router.pathname ?? "";
  var pathItems = pathname.split("/").filter((item) => item !== "");
  var breadcrumbItems: BreadcrumbsProps["items"] = pathItems.map((item, index) => {
    var path = "/" + pathItems.slice(0, index + 1).join("/");
    return {
      label: item.charAt(0).toUpperCase() + item.slice(1),
      href: path
    };
  });
  
  const handleSignIn = useCallback(() => {
    Router.goToSignIn();
  }, [Router]);

  // *** Profile Editor State ***
  
  const profileMenuItems: OptionProps[] = useMemo(() => {
    return getMenuItems(Router, currentUser?.IsVerifiedCreator ?? false);
  }, [currentUser, Router]);

  const [avatar, setAvatar] = useState<CMS.Upload | undefined>(currentUser?.avatar || undefined);
  
  const [currentTab, setCurrentTab] = useState(showTab || SidebarTab.About);
  const setTab = useMemo(() => {
    return showTab || currentTab;
  }
  , [showTab, currentTab]);

  return (
    <div
      className={cn(
        "flex flex-col w-screen max-w-screen overflow-x-hidden",
        className
      )}
    >
      
      <div className="sm:relative sticky top-0 bg-background-0 z-10">
        <Navbar
          avatarImage={profileImage(currentUser) ?? undefined}
          profileMenuItems={profileMenuItems}
          navbarItems={navbarItems}
          searchOptions={[]}
          onLogoClick={() => Router.goToHome()}
          onSearchChange={() => {}}
          isAuthenticated={!!currentUser}
          handleSignIn={handleSignIn}
        />
        {showBreadcrumbs && (
          <div className="lg:px-10 md:px-5 px-6">
            <Breadcrumbs
              items={breadcrumbItems}
              onHomeClick={() => Router.goToHome()}
            />
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
      <ProfileEditor
        open={openEditor}
        currentTab={setTab}
        setCurrentTab={setCurrentTab}
        onClose={onClose}
        user={currentUser}
        avatarUrl={avatar?.url}
      />
      <Footer />
      
    </div>
  );
};
