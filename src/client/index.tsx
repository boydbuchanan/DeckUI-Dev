import { NavbarItemProps, OptionProps } from "@deckai/deck-ui";
import { SiteRouter } from "@site";

export const userMenuItems: OptionProps[] = [
  {
    label: "My Profile",
    value: "profile"
  },
  {
    label: "Become a Creator",
    value: "creator",
    badge: "Coming Soon",
    disabled: true
  },
  {
    label: "Settings",
    value: "settings",
    badge: "Coming Soon",
    disabled: true
  },
  {
    label: "Support",
    value: "support",
    badge: "Coming Soon",
    disabled: true
  },
  {
    label: "Logout",
    value: "logout",
    color: "danger" as const
  }
];
//const profileMenuItems: OptionProps[] = [
export function getMenuItems(siteRouter: SiteRouter) {
  const profileMenuItems: OptionProps[] = [
    {
      label: "My Profile",
      value: "profile",
      onClick: () => {
        siteRouter.goToMyProfile();
      }
    },
    {
      label: "My Offers",
      value: "offers",
      onClick: () => {
        siteRouter.goTo('offer');
      }
    },
    {
      label: "Logout",
      value: "logout",
      color: "danger" as const,
      onClick: () => {
        siteRouter.goToSignIn();
      }
    }
  ];
  return profileMenuItems;
}

export const navbarItems: NavbarItemProps[] = [
  {
    iconName: "folder-2",
    title: "Orders",
    onClick: () => {},
    disabled: true,
    tooltip: "Orders Coming Soon"
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

export const searchOptions: OptionProps[] = [
  {
    label: "Profile",
    value: "profile"
  },
  {
    label: "Content",
    value: "content"
  },
  {
    label: "Platform",
    value: "platform"
  }
];

export const Config = {
  CMSURL: process.env.NEXT_PUBLIC_CMS_URL,
  STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "",
  userMenuItems: userMenuItems,
  navbarItems: navbarItems,
  searchOptions: searchOptions
};
